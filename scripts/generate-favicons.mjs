import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

// SVG with black fill (for PNG generation - no CSS media queries)
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <rect width="128" height="128" fill="#000"/>
  <path fill="#FFF" d="M32 16h40c22.1 0 40 17.9 40 40s-17.9 40-40 40H48v16c0 4.4-3.6 8-8 8s-8-3.6-8-8V24c0-4.4 3.6-8 8-8zm16 64h24c13.3 0 24-10.7 24-24s-10.7-24-24-24H48v48z"/>
</svg>`;

const sizes = [
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "favicon-32.png", size: 32 },
];

async function generateIcons() {
  for (const { name, size } of sizes) {
    const outputPath = path.join(publicDir, name);
    await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`Generated ${name} (${size}x${size})`);
  }
  console.log("\nAll icons generated successfully!");
  console.log("\nNote: To create favicon.ico, use https://favicon.io/favicon-converter/");
  console.log("Upload the favicon-32.png file to generate the .ico file.");
}

generateIcons();
