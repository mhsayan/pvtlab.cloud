import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

// ICO format header and directory entry structure
function createIco(pngBuffers) {
  // ICO Header: 6 bytes
  // - 2 bytes: Reserved (0)
  // - 2 bytes: Type (1 for ICO)
  // - 2 bytes: Number of images
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);      // Reserved
  header.writeUInt16LE(1, 2);      // Type: ICO
  header.writeUInt16LE(pngBuffers.length, 4); // Image count

  // Directory entries: 16 bytes each
  const entries = [];
  let dataOffset = 6 + (16 * pngBuffers.length);

  for (const { buffer, size } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size === 256 ? 0 : size, 0);  // Width (0 means 256)
    entry.writeUInt8(size === 256 ? 0 : size, 1);  // Height (0 means 256)
    entry.writeUInt8(0, 2);                        // Color palette
    entry.writeUInt8(0, 3);                        // Reserved
    entry.writeUInt16LE(1, 4);                     // Color planes
    entry.writeUInt16LE(32, 6);                    // Bits per pixel
    entry.writeUInt32LE(buffer.length, 8);         // Size of image data
    entry.writeUInt32LE(dataOffset, 12);           // Offset to image data

    entries.push(entry);
    dataOffset += buffer.length;
  }

  // Combine header, entries, and image data
  return Buffer.concat([
    header,
    ...entries,
    ...pngBuffers.map(p => p.buffer)
  ]);
}

// SVG with amber background and white P (matches logo monogram style)
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="16" ry="16" fill="#b45309"/>
  <path fill="#FFF" d="M32 16h40c22.1 0 40 17.9 40 40s-17.9 40-40 40H48v16c0 4.4-3.6 8-8 8s-8-3.6-8-8V24c0-4.4 3.6-8 8-8zm16 64h24c13.3 0 24-10.7 24-24s-10.7-24-24-24H48v48z"/>
</svg>`;

async function generateIco() {
  const sizes = [16, 32, 48];
  const pngBuffers = [];

  for (const size of sizes) {
    const buffer = await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png()
      .toBuffer();
    pngBuffers.push({ buffer, size });
  }

  const icoBuffer = createIco(pngBuffers);
  const outputPath = path.join(publicDir, "favicon.ico");
  fs.writeFileSync(outputPath, icoBuffer);
  console.log("Generated favicon.ico");
}

generateIco();
