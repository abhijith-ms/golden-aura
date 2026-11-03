export function heroVideoSource({
  reducedMotion,
  saveData,
  mobile,
}: {
  reducedMotion: boolean;
  saveData: boolean;
  mobile: boolean;
}) {
  if (reducedMotion || saveData) return undefined;
  return mobile ? "/video/hero_video_mobile.mp4" : "/video/hero_video.mp4";
}
