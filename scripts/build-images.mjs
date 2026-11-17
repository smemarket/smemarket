// Pre-renders public/images/*.jpg|png to WebP at every width the static image loader may request.
// Output: public/images/_w/<name>-<width>.webp (git-ignored, rebuilt on each Pages build).
import { readdir, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const WIDTHS = [64, 128, 256, 384, 640, 828, 1200, 1920, 2560];
const src = path.join(process.cwd(), "public/images");
const out = path.join(src, "_w");
await mkdir(out, { recursive: true });

const files = (await readdir(src)).filter((f) => /\.(jpe?g|png)$/i.test(f));
let made = 0;
for (const f of files) {
  const name = f.replace(/\.[^.]+$/, "");
  const input = path.join(src, f);
  const mtime = (await stat(input)).mtimeMs;
  await Promise.all(
    WIDTHS.map(async (w) => {
      const dest = path.join(out, `${name}-${w}.webp`);
      const done = await stat(dest).then((s) => s.mtimeMs >= mtime).catch(() => false);
      if (done) return;
      await sharp(input).resize({ width: w, withoutEnlargement: true }).webp({ quality: w <= 384 ? 80 : 84 }).toFile(dest);
      made++;
    }),
  );
}
console.log(`images: ${files.length} sources, ${made} variants written to public/images/_w`);
