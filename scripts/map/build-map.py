# Builds public/images/map-notranje-gorice.jpg: OpenStreetMap tiles around Podovnice 1, tinted to the
# site palette, with a copper pin and the required "© OpenStreetMap contributors" credit.
# Coordinates from Nominatim (exact building match for "Podovnice 1, 1357 Notranje Gorice").
# Usage: python3 scripts/map/build-map.py   (fetches ~24 tiles once; respect the OSM tile usage policy)
import math, os, sys, time, tempfile, urllib.request
from PIL import Image, ImageOps, ImageDraw, ImageFont, ImageFilter
root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
D = tempfile.mkdtemp(prefix='osm-'); os.makedirs(f'{D}/tiles', exist_ok=True)
out = os.path.join(root, 'public/images/map-notranje-gorice.jpg')
font_path = os.path.join(root, 'scripts/brochure/fonts/Inter-SemiBold.ttf')
lat, lon, z = 45.9901642, 14.4031497, 15
W, H = 1200, 675
n = 2 ** z
fx = (lon + 180) / 360 * n * 256
fy = (1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * n * 256
x0, y0 = fx - W / 2, fy - H / 2
tx0, ty0, tx1, ty1 = int(x0 // 256), int(y0 // 256), int((x0 + W) // 256), int((y0 + H) // 256)
canvas = Image.new('RGB', ((tx1 - tx0 + 1) * 256, (ty1 - ty0 + 1) * 256))
count = 0
for tx in range(tx0, tx1 + 1):
    for ty in range(ty0, ty1 + 1):
        p = f'{D}/tiles/{z}_{tx}_{ty}.png'
        if not os.path.exists(p):
            req = urllib.request.Request(f'https://tile.openstreetmap.org/{z}/{tx}/{ty}.png', headers={'User-Agent': 'premiumhammer-site-map-builder/1.0 (one-off static map)'})
            open(p, 'wb').write(urllib.request.urlopen(req, timeout=30).read()); count += 1; time.sleep(0.3)
        canvas.paste(Image.open(p).convert('RGB'), ((tx - tx0) * 256, (ty - ty0) * 256))
print('downloaded tiles:', count)
ox, oy = int(x0 - tx0 * 256), int(y0 - ty0 * 256)
m = canvas.crop((ox, oy, ox + W, oy + H))
# Brand tint: greyscale, then map dark→ink and light→paper, keeping roads and labels readable.
g = ImageOps.grayscale(m)
m = ImageOps.colorize(g, black=(55, 56, 60), mid=(206, 199, 190), white=(246, 243, 239), midpoint=175)
d = ImageDraw.Draw(m)
cx, cy = W // 2, H // 2
# Copper pin with soft ring
d.ellipse((cx - 7, cy - 3, cx + 7, cy + 5), fill=(30, 31, 34))
d = ImageDraw.Draw(m)
d.polygon([(cx, cy + 2), (cx - 17, cy - 30), (cx + 17, cy - 30)], fill=(143, 85, 36))
d.ellipse((cx - 22, cy - 66, cx + 22, cy - 22), fill=(184, 115, 51), outline=(143, 85, 36), width=3)
d.ellipse((cx - 8, cy - 52, cx + 8, cy - 36), fill=(255, 255, 255))
f = ImageFont.truetype(font_path, 22)
lab = 'Tomstroj d.o.o. · Podovnice 1'
bb = d.textbbox((0, 0), lab, font=f); tw, th = bb[2] - bb[0], bb[3] - bb[1]
bx, by = cx - tw // 2 - 14, cy + 14
d.rounded_rectangle((bx, by, bx + tw + 28, by + th + 18), radius=8, fill=(30, 31, 34))
d.text((bx + 14, by + 7 - bb[1]), lab, font=f, fill=(255, 255, 255))
fs = ImageFont.truetype(font_path, 15)
att = '© OpenStreetMap contributors'
ab = d.textbbox((0, 0), att, font=fs)
d.rectangle((W - (ab[2] - ab[0]) - 20, H - 26, W, H), fill=(245, 242, 238))
d.text((W - (ab[2] - ab[0]) - 10, H - 22 - ab[1]), att, font=fs, fill=(80, 80, 80))
m.save(out, 'JPEG', quality=86, optimize=True, progressive=True)
print('saved', out, m.size)
