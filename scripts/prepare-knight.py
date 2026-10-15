"""Extract the licensed Poly Haven knight; source downloads stay outside Git."""

import hashlib
import io
import json
from pathlib import Path
import struct
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "refernce and guide/3d-source/polyhaven-chess-set"
EXPECTED = {
    "chess_set_1k.gltf": "3e21ecd0c2ffb703dfdb3f3ea7a379c1dbd4ec513ba2cb8e6cb1e5f276d7eb91",
    "chess_set.bin": "c73476fd032a2cb4a9c256f70573eed260708132fdc42fec161c6216711560b3",
    "chess_set_pieces_black_nor_gl_2k.jpg": "0f34ac3bb06c64d3a6a8f8999b13612b2e299c5d9888ba7bd8fc4d9f2f0acc7e",
}
for filename, checksum in EXPECTED.items():
    assert hashlib.sha256((SOURCE / filename).read_bytes()).hexdigest() == checksum

source = json.loads((SOURCE / "chess_set_1k.gltf").read_text())
source_binary = (SOURCE / "chess_set.bin").read_bytes()
node = next(item for item in source["nodes"] if item.get("name") == "piece_knight_black_01")
primitive = source["meshes"][node["mesh"]]["primitives"][0]
assert primitive.get("mode", 4) == 4


def values(index, fmt):
    accessor = source["accessors"][index]
    view = source["bufferViews"][accessor["bufferView"]]
    assert "sparse" not in accessor and "byteStride" not in view
    offset = view.get("byteOffset", 0) + accessor.get("byteOffset", 0)
    length = accessor["count"] * struct.calcsize(fmt)
    return list(struct.iter_unpack(fmt, source_binary[offset:offset + length]))


points = values(primitive["attributes"]["POSITION"], "<3f")
normals = values(primitive["attributes"]["NORMAL"], "<3f")
uvs = values(primitive["attributes"]["TEXCOORD_0"], "<2f")
index_accessor = source["accessors"][primitive["indices"]]
assert index_accessor["componentType"] == 5123
indices = [item[0] for item in values(primitive["indices"], "<H")]
assert len(points) == len(normals) == len(uvs) == 1705 and len(indices) == 7986
floor = min(point[1] for point in points)
height = max(point[1] for point in points) - floor
points = [(x / height, (y - floor) / height, z / height) for x, y, z in points]

# The source has one material. Two existing base bands provide restrained gold.
groups = [[], []]
for offset in range(0, len(indices), 3):
    triangle = indices[offset:offset + 3]
    y = sum(points[index][1] for index in triangle) / 3
    gold = 0.055 <= y <= 0.085 or 0.245 <= y <= 0.265
    groups[int(gold)].extend(triangle)
assert all(groups) and sum(map(len, groups)) == len(indices)

# Keep the knight's baked detail; discard unused atlas texels with a bleed margin.
normal_image = Image.open(SOURCE / "chess_set_pieces_black_nor_gl_2k.jpg").convert("RGB").resize((1024, 1024), Image.Resampling.LANCZOS)
mask = Image.new("L", (1024, 1024))
draw = ImageDraw.Draw(mask)
for offset in range(0, len(indices), 3):
    draw.polygon([(uvs[i][0] * 1024, uvs[i][1] * 1024) for i in indices[offset:offset + 3]], fill=255)
masked = Image.new("RGB", (1024, 1024), (128, 128, 255))
masked.paste(normal_image, mask=mask.filter(ImageFilter.MaxFilter(9)))
image_bytes = io.BytesIO()
masked.save(image_bytes, format="PNG", optimize=True)

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
uv = append(uvs, "<2f", 5126, "VEC2", 34962)
primitives = []
for material, group in enumerate(groups):
    index = append([(i,) for i in group], "<H", 5123, "SCALAR", 34963)
    primitives.append({"attributes": {"POSITION": position, "NORMAL": normal, "TEXCOORD_0": uv}, "indices": index, "material": material})

binary += b"\0" * (-len(binary) % 4)
views.append({"buffer": 0, "byteOffset": len(binary), "byteLength": len(image_bytes.getvalue())})
image_view = len(views) - 1
binary.extend(image_bytes.getvalue())


def linear(hex_colour):
    rgb = [int(hex_colour[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in rgb] + [1]


document = {
    "asset": {"version": "2.0", "generator": "Golden Aura / scripts/prepare-knight.py", "copyright": "Chess Set by Riley Queen / Poly Haven, CC0-1.0; adapted materials"},
    "scene": 0,
    "scenes": [{"nodes": [0]}],
    "nodes": [{"name": "GoldenAuraKnight", "mesh": 0}],
    "meshes": [{"name": "Knight", "primitives": primitives}],
    "materials": [
        {"name": "Charcoal", "normalTexture": {"index": 0}, "pbrMetallicRoughness": {"baseColorFactor": linear("252926"), "metallicFactor": 0.12, "roughnessFactor": 0.52}},
        {"name": "ChampagneGold", "normalTexture": {"index": 0}, "pbrMetallicRoughness": {"baseColorFactor": linear("c4af78"), "metallicFactor": 1, "roughnessFactor": 0.32}},
    ],
    "images": [{"bufferView": image_view, "mimeType": "image/png"}],
    "textures": [{"source": 0}],
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
