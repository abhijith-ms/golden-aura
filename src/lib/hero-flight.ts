import { CatmullRomCurve3, MathUtils, Matrix4, PerspectiveCamera, Quaternion, Vector3 } from "three";

export type HeroFrame = { left: number; top: number; width: number; height: number };
export const queenLanding = new Vector3(0.21, 0, -0.63);
export const queenScale = 0.82;
export const queenFlightDuration = 3.2;

export function setHeroProjection(camera: PerspectiveCamera, frame: HeroFrame, viewport: { width: number; height: number }, expanded: boolean) {
  camera.clearViewOffset();
  camera.aspect = frame.width / frame.height;
  if (expanded) camera.setViewOffset(frame.width, frame.height, -frame.left, -frame.top, viewport.width, viewport.height);
  else camera.updateProjectionMatrix();
}

export function createQueenFlight(camera: PerspectiveCamera, frame: HeroFrame, viewport: { width: number; height: number }, board: Matrix4) {
  const lens = camera.clone();
  setHeroProjection(lens, frame, viewport, true);
  lens.updateMatrixWorld();
  const forward = new Vector3(0, 0, -1).applyQuaternion(lens.quaternion);
  const inverseBoard = board.clone().invert();
  const point = (x: number, y: number, depth: number) => {
    const ray = new Vector3(x, y, 0).unproject(lens).sub(lens.position);
    return ray.multiplyScalar(depth / ray.dot(forward)).add(lens.position).applyMatrix4(inverseBoard);
  };
  const rotation = new Quaternion().setFromRotationMatrix(board).invert().multiply(lens.quaternion)
    .multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), -0.35));
  const curve = new CatmullRomCurve3([
    point(-2.4, -7, 0.46), point(-1.8, -2.4, 0.34), point(-0.3, -1.1, 0.34), point(0.55, -0.25, 1.6),
    queenLanding.clone().add(new Vector3(0, 0.3, 0)), queenLanding.clone(),
  ], false, "centripetal");
  return { curve, rotation };
}

export function queenFlightPose(flight: ReturnType<typeof createQueenFlight>, progress: number) {
  const p = MathUtils.clamp(progress, 0, 1);
  return {
    position: flight.curve.getPoint(p),
    rotation: flight.rotation.clone().slerp(new Quaternion(), MathUtils.smoothstep(p, 0.35, 0.85)),
    accent: MathUtils.smoothstep(p, 0.04, 0.16) * (1 - MathUtils.smoothstep(p, 0.62, 0.94)),
  };
}
