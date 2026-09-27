"""Convert the remaining HEIC phone shots into the photo folder.

sharp's prebuilt libvips can parse the HEIF container but its bundled decoder
refuses the HEVC payload, so these five never made it through. pillow-heif
carries its own decoder and handles them.
"""
import os
from PIL import Image, ImageOps
import pillow_heif

pillow_heif.register_heif_opener()

SRC = r"C:\Users\alhad\OneDrive - Wayne State University\Documents\japan flicks"
OUT = r"C:\Users\alhad\OneDrive - Wayne State University\Documents\pell-to-planet\src\assets\photos"

MAP = {
    "group karayoke tokyo_k": "tokyo-karaoke-group",
    "Hiroshima \U0001F3D4\uFE0F _k": "hiroshima-hills",
    "hiroshimamazdadinner_k": "hiroshima-mazda-dinner",
    "keylex group pic_k": "keylex-group",
    "tokyobus_k": "tokyo-bus-ride",
    # asked for by name: the Kyoto group shot
    "kyotogrouppic": "kyoto-group",
    "kyotoshrinegates": "kyoto-shrine-gates",
}

MAX = 2400

for name in os.listdir(SRC):
    stem, ext = os.path.splitext(name)
    if ext.lower() != ".heic":
        continue
    slug = MAP.get(stem) or MAP.get(stem.strip())
    if not slug:
        print(f'SKIP (unmapped): "{stem}"')
        continue
    try:
        im = Image.open(os.path.join(SRC, name))
        im = ImageOps.exif_transpose(im)          # phone orientation
        im = im.convert("RGB")
        im.thumbnail((MAX, MAX), Image.LANCZOS)
        dest = os.path.join(OUT, slug + ".jpg")
        im.save(dest, "JPEG", quality=88, optimize=True, progressive=True)
        kb = os.path.getsize(dest) // 1024
        print(f"OK   {slug}.jpg  {im.width}x{im.height}  {kb}kB   <- {name}")
    except Exception as e:
        print(f"FAIL {name}: {e}")
