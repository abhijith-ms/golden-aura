"""Export only the CC BY 4.0 knight and queen; keep the source set outside Git."""

import copy
import hashlib
import io
import json
from pathlib import Path
import struct
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "refernce and guide/3d-source/oleksandr-chessboard/source.glb"
raw = SOURCE.read_bytes()
assert hashlib.sha256(raw).hexdigest() == "2d5e463da58ae98cd9c7234c7dd17f1248c947100400419c057653f04963a92c"
assert struct.unpack_from("<4sII", raw) == (b"glTF", 2, len(raw))
json_length = struct.unpack_from("<I", raw, 12)[0]
source = json.loads(raw[20:20 + json_length])
source_binary = raw[28 + json_length:]
assert source["asset"]["extras"]["license"].startswith("CC-BY-4.0")
assert source["asset"]["extras"]["title"] == "Chessboard"
assert source["nodes"][7] == {"mesh": 5, "name": "Object_7"}
assert source["nodes"][10] == {"mesh": 8, "name": "Object_10"}
assert source["nodes"][24] == {"mesh": 22, "name": "Object_24"}


def values(index, fmt, component_type):
    accessor = source["accessors"][index]
    view = source["bufferViews"][accessor["bufferView"]]
    assert accessor["componentType"] == component_type and "sparse" not in accessor
    assert view.get("byteStride", struct.calcsize(fmt)) == struct.calcsize(fmt)
    offset = view.get("byteOffset", 0) + accessor.get("byteOffset", 0)
    length = accessor["count"] * struct.calcsize(fmt)
    assert offset + length <= len(source_binary)
    return list(struct.iter_unpack(fmt, source_binary[offset:offset + length]))


texture = source["textures"][0]
image = source["images"][texture["source"]]
view = source["bufferViews"][image["bufferView"]]
image_bytes = source_binary[view["byteOffset"]:view["byteOffset"] + view["byteLength"]]
assert image["mimeType"] == "image/jpeg"
wood = Image.open(io.BytesIO(image_bytes)).convert("RGB")
assert wood.size == (512, 1024)
encoded = io.BytesIO()
wood.save(encoded, format="JPEG", quality=90, optimize=True)


def export_piece(name, mesh_ids, base_mesh, vertex_count, index_count, budget):
    points, normals, uvs, indices = [], [], [], []
    for mesh in mesh_ids:
        primitive = source["meshes"][mesh]["primitives"][0]
        assert primitive.get("mode", 4) == 4 and primitive["material"] == 0
        offset = len(points)
        points.extend(values(primitive["attributes"]["POSITION"], "<3f", 5126))
        normals.extend(values(primitive["attributes"]["NORMAL"], "<3f", 5126))
        uvs.extend(values(primitive["attributes"]["TEXCOORD_0"], "<2f", 5126))
        indices.extend(item[0] + offset for item in values(primitive["indices"], "<I", 5125))
    assert len(points) == len(normals) == len(uvs) == vertex_count and len(indices) == index_count
    assert max(indices) < len(points) < 65536
    base = source["accessors"][source["meshes"][base_mesh]["primitives"][0]["attributes"]["POSITION"]]
    cx, cy = [(base["min"][i] + base["max"][i]) / 2 for i in (0, 1)]
    floor = min(z for x, y, z in points)
    height = max(z for x, y, z in points) - floor
    # Source is Z-up and faces +X. Preserve the pieces' proportions in Y-up.
    points = [(-(y - cy) / height, (z - floor) / height, -(x - cx) / height) for x, y, z in points]
    normals = [(-y, z, -x) for x, y, z in normals]
    binary, views, accessors = bytearray(), [], []

    def append(items, fmt, component_type, kind, target, bounds=False):
        binary.extend(b"\0" * (-len(binary) % 4))
        start = len(binary)
        for item in items:
            binary.extend(struct.pack(fmt, *item))
        views.append({"buffer": 0, "byteOffset": start, "byteLength": len(binary) - start, "target": target})
        accessor = {"bufferView": len(views) - 1, "componentType": component_type, "count": len(items), "type": kind}
        if bounds:
            accessor["min"] = [min(item[i] for item in items) for i in range(len(items[0]))]
            accessor["max"] = [max(item[i] for item in items) for i in range(len(items[0]))]
        accessors.append(accessor)
        return len(accessors) - 1

    position = append(points, "<3f", 5126, "VEC3", 34962, True)
    normal = append(normals, "<3f", 5126, "VEC3", 34962)
    uv = append(uvs, "<2f", 5126, "VEC2", 34962)
    index = append([(i,) for i in indices], "<H", 5123, "SCALAR", 34963)
    binary.extend(b"\0" * (-len(binary) % 4))
    views.append({"buffer": 0, "byteOffset": len(binary), "byteLength": len(encoded.getvalue())})
    image_view = len(views) - 1
    binary.extend(encoded.getvalue())
    material = copy.deepcopy(source["materials"][4])
    material["name"] = "DarkWood"
    material["pbrMetallicRoughness"]["baseColorTexture"]["index"] = 0
    document = {
        "asset": {"version": "2.0", "generator": "Golden Aura / scripts/prepare-knight.py", "copyright": f"Chessboard by Oleksandr Zymohliad, CC BY 4.0; isolated {name.lower()}, normalised coordinates and re-encoded wood texture", "extras": source["asset"]["extras"]},
        "scene": 0, "scenes": [{"nodes": [0]}],
        "nodes": [{"name": f"GoldenAuraWooden{name}", "mesh": 0}],
        "meshes": [{"name": name, "primitives": [{"attributes": {"POSITION": position, "NORMAL": normal, "TEXCOORD_0": uv}, "indices": index, "material": 0}]}],
        "materials": [material], "textures": [{"source": 0, "sampler": 0}],
        "samplers": [source["samplers"][texture["sampler"]]],
        "images": [{"bufferView": image_view, "mimeType": "image/jpeg"}],
        "buffers": [{"byteLength": len(binary)}], "bufferViews": views, "accessors": accessors,
    }
    json_bytes = json.dumps(document, separators=(",", ":")).encode()
    json_bytes += b" " * (-len(json_bytes) % 4)
    binary += b"\0" * (-len(binary) % 4)
    output = struct.pack("<4sII", b"glTF", 2, 28 + len(json_bytes) + len(binary))
    output += struct.pack("<I4s", len(json_bytes), b"JSON") + json_bytes
    output += struct.pack("<I4s", len(binary), b"BIN\0") + binary
    assert len(output) < budget
    destination = ROOT / f"public/models/{name.lower()}.glb"
    destination.write_bytes(output)
    print(f"{destination.relative_to(ROOT)}: {len(output):,} bytes; {len(indices) // 3:,} triangles; {len(points):,} vertices; height 1")


export_piece("Knight", (5, 8), 8, 13477, 79878, 1_000_000)
export_piece("Queen", (22,), 22, 29574, 171360, 1_500_000)
