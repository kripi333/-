#!/usr/bin/env node
/**
 * Сборка ассетов логотипа Kushch Services из исходного PNG.
 *
 * Использование:
 *   npm run logo                       # читает public/brand/logo-source.png
 *   npm run logo -- путь/к/файлу.png   # или явный путь
 *
 * Что делает:
 * 1. отделяет белый фон и делает его прозрачным (чёрная и белая версии);
 * 2. разбивает логотип на смысловые блоки (знак, вордмарк, подписи) по пустым строкам;
 * 3. сохраняет: знак, лок-ап «знак + слово», полный логотип — каждый в двух версиях;
 * 4. делает favicon (app/icon.png) и OG-картинку (app/opengraph-image.png);
 * 5. включает использование картинок в config/brand.ts.
 */
import { createRequire } from "node:module";
import { mkdir, writeFile, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(root, "public", "brand");
const appDir = path.join(root, "app");

const WHITE_THRESHOLD = 246;   // всё светлее считаем фоном
const GAP_THRESHOLD = 8;       // пустые строки, разделяющие блоки логотипа

async function findSource() {
  const cli = process.argv[2];
  const candidates = cli
    ? [path.resolve(process.cwd(), cli)]
    : [
        path.join(root, "public", "brand", "logo-source.png"),
        path.join(root, "public", "logo-source.png"),
        path.join(root, "logo-source.png"),
        "/home/user/uploads/image-1.png",
      ];
  for (const candidate of candidates) {
    try {
      const info = await stat(candidate);
      if (info.isFile()) return candidate;
    } catch {
      /* пробуем следующий */
    }
  }
  console.error(
    "Не найден исходный PNG.\n" +
    "Положите файл в public/brand/logo-source.png и запустите: npm run logo\n" +
    "Либо укажите путь: npm run logo -- /путь/к/логотипу.png",
  );
  process.exit(1);
}

/** Читает картинку как grayscale и возвращает яркость пикселей 0..255. */
async function readLuminance(source) {
  const { data, info } = await sharp(source).greyscale().raw().toBuffer({ resolveWithObject: true });
  return { luminance: data, width: info.width, height: info.height };
}

/** Ищет горизонтальные полосы с содержимым, разделённые пустыми строками. */
function findBands({ luminance, width, height }) {
  const rowHasInk = new Array(height).fill(false);
  for (let y = 0; y < height; y += 1) {
    const offset = y * width;
    for (let x = 0; x < width; x += 1) {
      if (luminance[offset + x] < WHITE_THRESHOLD) { rowHasInk[y] = true; break; }
    }
  }

  const bands = [];
  let start = -1;
  let gap = 0;
  for (let y = 0; y < height; y += 1) {
    if (rowHasInk[y]) {
      if (start === -1) start = y;
      gap = 0;
    } else if (start !== -1) {
      gap += 1;
      if (gap >= GAP_THRESHOLD) {
        bands.push([start, y - gap]);
        start = -1;
        gap = 0;
      }
    }
  }
  if (start !== -1) bands.push([start, height - 1]);

  return bands.filter(([from, to]) => to - from > 2);
}

/** Границы по горизонтали внутри указанного диапазона строк. */
function columnBounds({ luminance, width }, from, to) {
  let left = width;
  let right = 0;
  for (let y = from; y <= to; y += 1) {
    const offset = y * width;
    for (let x = 0; x < width; x += 1) {
      if (luminance[offset + x] < WHITE_THRESHOLD) {
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
  }
  return [left, right];
}

/** Собирает RGBA-буфер: тёмная версия — чёрный рисунок, светлая — белый, фон прозрачный. */
function toTransparent({ luminance, width }, x0, y0, x1, y1, light) {
  const w = x1 - x0 + 1;
  const h = y1 - y0 + 1;
  const out = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y += 1) {
    const srcRow = (y + y0) * width;
    const dstRow = y * w;
    for (let x = 0; x < w; x += 1) {
      const lum = luminance[srcRow + x + x0];
      const alpha = light ? lum : 255 - lum;
      const index = (dstRow + x) * 4;
      const value = light ? 255 : 0;
      out[index] = value;
      out[index + 1] = value;
      out[index + 2] = value;
      out[index + 3] = alpha;
    }
  }
  return { buffer: out, width: w, height: h };
}

async function savePng({ buffer, width, height }, file, maxWidth) {
  const pipeline = sharp(buffer, { raw: { width, height, channels: 4 } }).png({ compressionLevel: 9, palette: false });
  if (maxWidth && width > maxWidth) pipeline.resize({ width: maxWidth, fit: "inside", withoutEnlargement: true });
  await pipeline.toFile(file);
  return file;
}

async function main() {
  const source = await findSource();
  const image = await readLuminance(source);
  const bands = findBands(image);

  if (bands.length < 3) {
    console.error(
      `Удалось выделить только ${bands.length} блока(ов) в логотипе. ` +
      "Ожидается минимум три: знак, слово и подпись. Проверьте, что фон исходника белый и без рамок.",
    );
    process.exit(1);
  }

  const [top, second, third] = bands;
  const all = [top[0], bands[bands.length - 1][1]];
  const lockupFrom = top[0];
  const lockupTo = third[1];
  const wordmarkFrom = second[0];
  const wordmarkTo = third[1];

  await mkdir(outputDir, { recursive: true });
  await mkdir(appDir, { recursive: true });

  const regions = {
    mark: [top[0], top[1]],
    lockup: [lockupFrom, lockupTo],
    wordmark: [wordmarkFrom, wordmarkTo],
    full: all,
  };

  const written = [];
  for (const [name, [from, to]] of Object.entries(regions)) {
    const [left, right] = columnBounds(image, from, to);
    for (const light of [false, true]) {
      const raw = toTransparent(image, left, from, right, to, light);
      const file = path.join(outputDir, `${name}-${light ? "light" : "dark"}.png`);
      await savePng(raw, file, name === "mark" ? 360 : name === "full" ? 1400 : 1000);
      written.push(path.relative(root, file));
    }
  }

  // Favicon: знак на белом скруглённом квадрате — одинаково читается в светлой и тёмной теме.
  const markRegion = regions.mark;
  const [markLeft, markRight] = columnBounds(image, markRegion[0], markRegion[1]);
  const markRaw = toTransparent(image, markLeft, markRegion[0], markRight, markRegion[1], false);
  const markPng = await sharp(markRaw.buffer, { raw: { width: markRaw.width, height: markRaw.height, channels: 4 } })
    .resize({ width: 400, height: 400, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();
  const iconSvg = Buffer.from(
    `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">` +
    `<rect width="512" height="512" rx="104" fill="#ffffff"/>` +
    `<rect x="4" y="4" width="504" height="504" rx="100" fill="none" stroke="#dcebf7" stroke-width="8"/>` +
    `</svg>`,
  );
  await sharp(iconSvg)
    .composite([{ input: markPng, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(appDir, "icon.png"));
  await rm(path.join(appDir, "icon.svg"), { force: true });
  written.push("app/icon.png");

  // OG-картинка для соцсетей.
  const [fullLeft, fullRight] = columnBounds(image, all[0], all[1]);
  const fullRaw = toTransparent(image, fullLeft, all[0], fullRight, all[1], false);
  const fullPng = await sharp(fullRaw.buffer, { raw: { width: fullRaw.width, height: fullRaw.height, channels: 4 } })
    .resize({ width: 1000, height: 430, fit: "inside", withoutEnlargement: false })
    .png()
    .toBuffer();
  await sharp({ create: { width: 1200, height: 630, channels: 4, background: "#ffffff" } })
    .composite([{ input: fullPng, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(appDir, "opengraph-image.png"));
  written.push("app/opengraph-image.png");

  // Переключаем сайт на картинки логотипа.
  await writeFile(
    path.join(root, "config", "brand.ts"),
    `/**\n * Флаг собирается скриптом scripts/build-logo.mjs.\n` +
    ` * false — рисуем знак и вордмарк кодом, true — используем файлы из public/brand.\n */\n` +
    `export const brand = { hasLogoImages: true } as const;\n`,
    "utf8",
  );
  written.push("config/brand.ts (hasLogoImages: true)");

  console.log(`Источник: ${path.relative(root, source)} (${image.width}×${image.height})`);
  console.log(`Найдено блоков: ${bands.length} → ${bands.map(([from, to]) => `${from}-${to}`).join(", ")}`);
  console.log("Создано:\n" + written.map((file) => `  ${file}`).join("\n"));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
