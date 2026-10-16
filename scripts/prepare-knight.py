"""Extract the CC BY 4.0 knight; the full source board stays outside Git."""

import hashlib
import json
from pathlib import Path
import struct

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "refernce and guide/3d-source/cc-by-chess-set/source.glb"
raw = SOURCE.read_bytes()
assert hashlib.sha256(raw).hexdigest() == "d2cb8b2b21a69e998a8725f41c5da28390d1f0092ec82831d53e4b0854d49bfc"
assert struct.unpack_from("<4sII", raw) == (b"glTF", 2, len(raw))
json_length = struct.unpack_from("<I", raw, 12)[0]
source = json.loads(raw[20:20 + json_length])
source_binary = raw[28 + json_length:]
assert source["asset"]["extras"]["license"].startswith("CC-BY-4.0")
assert source["nodes"][10]["name"] == "Black Knight _4"
primitive = source["meshes"][3]["primitives"][0]
assert primitive.get("mode", 4) == 4


def values(index, fmt):
    accessor = source["accessors"][index]
    view = source["bufferViews"][accessor["bufferView"]]
    assert "sparse" not in accessor and view.get("byteStride", struct.calcsize(fmt)) == struct.calcsize(fmt)
    offset = view.get("byteOffset", 0) + accessor.get("byteOffset", 0)
    length = accessor["count"] * struct.calcsize(fmt)
    return list(struct.iter_unpack(fmt, source_binary[offset:offset + length]))


points = values(primitive["attributes"]["POSITION"], "<3f")
normals = values(primitive["attributes"]["NORMAL"], "<3f")
index_accessor = source["accessors"][primitive["indices"]]
assert index_accessor["componentType"] == 5125
indices = [item[0] for item in values(primitive["indices"], "<I")]
assert len(points) == len(normals) == 20675 and len(indices) == 117120
assert max(indices) < len(points) < 65536
floor = min(point[1] for point in points)
height = max(point[1] for point in points) - floor
points = [(-z / height, (y - floor) / height, x / height) for x, y, z in points]
normals = [(-z, y, x) for x, y, z in normals]

# Follow the existing base mouldings and the narrow centre of the mane.
groups = [[], []]
for offset in range(0, len(indices), 3):
    triangle = indices[offset:offset + 3]
    y = sum(points[index][1] for index in triangle) / 3
    x = sum(points[index][0] for index in triangle) / 3
    z = sum(points[index][2] for index in triangle) / 3
    nz = sum(normals[index][2] for index in triangle) / 3
    gold = 0.04 <= y <= 0.051 or 0.213 <= y <= 0.223 or (0.38 < y < 0.94 and z > 0.145 and abs(x) < 0.015 and nz > 0.3)
    groups[int(gold)].extend(triangle)
assert all(groups) and sum(map(len, groups)) == len(indices)

binary = bytearray()
views = []
accessors = []


def append(items, fmt, component_type, kind, target, bounds=False):
    while len(binary) % 4:
        binary.append(0)
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
primitives = []
for material, group in enumerate(groups):
    index = append([(i,) for i in group], "<H", 5123, "SCALAR", 34963)
    primitives.append({"attributes": {"POSITION": position, "NORMAL": normal}, "indices": index, "material": material})


def linear(hex_colour):
    rgb = [int(hex_colour[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in rgb] + [1]


document = {
    "asset": {"version": "2.0", "generator": "Golden Aura / scripts/prepare-knight.py", "copyright": "Wooden Chess Board by Bhargav Limje, CC BY 4.0; isolated knight, new materials and accents", "extras": source["asset"]["extras"]},
    "scene": 0,
    "scenes": [{"nodes": [0]}],
    "nodes": [{"name": "GoldenAuraKnight", "mesh": 0}],
    "meshes": [{"name": "Knight", "primitives": primitives}],
    "materials": [
        {"name": "Charcoal", "pbrMetallicRoughness": {"baseColorFactor": linear("1a1e1c"), "metallicFactor": 0.35, "roughnessFactor": 0.4}},
        {"name": "ChampagneGold", "pbrMetallicRoughness": {"baseColorFactor": linear("c4af78"), "metallicFactor": 1, "roughnessFactor": 0.28}},
    ],
    "buffers": [{"byteLength": len(binary)}],
    "bufferViews": views,
    "accessors": accessors,
}
json_bytes = json.dumps(document, separators=(",", ":")).encode()
json_bytes += b" " * (-len(json_bytes) % 4)
binary += b"\0" * (-len(binary) % 4)
output = struct.pack("<4sII", b"glTF", 2, 28 + len(json_bytes) + len(binary))
output += struct.pack("<I4s", len(json_bytes), b"JSON") + json_bytes
output += struct.pack("<I4s", len(binary), b"BIN\0") + binary
assert len(output) < 1_000_000
destination = ROOT / "public/models/knight.glb"
destination.parent.mkdir(parents=True, exist_ok=True)
destination.write_bytes(output)
print(f"{destination.relative_to(ROOT)}: {len(output):,} bytes; {len(indices) // 3:,} triangles; 2 materials; Y-up, height 1, faces -Z")
