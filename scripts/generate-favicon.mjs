import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import toIco from "to-ico";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svgPath = join(root, "app", "icon.svg");
const svg = readFileSync(svgPath);

const sizes = [
  { name: "favicon-16.png", size: 16 },
  { name: "favicon-32.png", size: 32 },
  { name: "favicon-48.png", size: 48 },
  { name: "apple-icon.png", size: 180 },
];

const pngBuffers = [];

for (const { name, size } of sizes) {
  const buffer = await sharp(svg)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  if (name.startsWith("favicon-")) {
    pngBuffers.push(buffer);
  } else {
    writeFileSync(join(root, "app", name), buffer);
  }
}

const ico = await toIco(pngBuffers);
writeFileSync(join(root, "app", "favicon.ico"), ico);

console.log("Generated app/favicon.ico, app/apple-icon.png");
