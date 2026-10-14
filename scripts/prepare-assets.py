"""Create web copies from the retained originals; never overwrite a source."""
import json
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
assets = json.loads((root / "scripts/assets.json").read_text())
output = root / "public/images"
output.mkdir(parents=True, exist_ok=True)
before = after = 0
for asset in assets:
    source = root / asset["source"]
    target = output / asset["file"]
    assert source.resolve() != target.resolve(), "Cannot replace an original"
    max_width = 480 if asset["album"] == "brand" and target.stem != "chess-hero" else 1800
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original)
        image.thumbnail((max_width, max_width), Image.Resampling.LANCZOS)
        image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
        image.save(target, "WEBP", quality=82, method=6)
    with Image.open(target) as check:
        assert max(check.size) <= max_width
        assert check.format == "WEBP"
        assert not check.getexif(), "Web copies must not contain EXIF location metadata"
    before += source.stat().st_size
    after += target.stat().st_size
print(f"{len(assets)} web copies: {before / 1024**2:.1f} MiB → {after / 1024**2:.1f} MiB")
