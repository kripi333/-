#!/usr/bin/env node
/**
 * Статическая сборка для GitHub Pages.
 *
 * Next не умеет `output: export` вместе с серверными роутами, поэтому папка
 * app/api на время сборки убирается в сторону и возвращается обратно —
 * даже если сборка упала.
 *
 * Запуск:  node scripts/build-static.mjs
 * Переменные:
 *   NEXT_PUBLIC_STATIC_DEMO=1   включает статический режим (см. next.config.ts)
 *   NEXT_PUBLIC_BASE_PATH       префикс пути, для репозитория на Pages это /<repo>
 */
import { spawnSync } from "node:child_process";
import { rename, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const apiDir = path.join(root, "app", "api");
const apiBackup = path.join(root, ".api-static-backup");

async function restoreApi() {
  if (existsSync(apiBackup)) {
    await mkdir(path.dirname(apiDir), { recursive: true });
    await rename(apiBackup, apiDir);
  }
}

async function main() {
  const hadApi = existsSync(apiDir);
  if (hadApi) await rename(apiDir, apiBackup);

  try {
    const result = spawnSync(
      process.execPath,
      ["./node_modules/next/dist/bin/next", "build"],
      {
        cwd: root,
        stdio: "inherit",
        env: {
          ...process.env,
          NEXT_PUBLIC_STATIC_DEMO: "1",
          NODE_ENV: "production",
        },
      },
    );
    if (result.status !== 0) {
      console.error("\nСтатическая сборка завершилась с ошибкой.");
      process.exitCode = result.status ?? 1;
    } else {
      console.log("\nГотово: статическая версия лежит в out/");
    }
  } finally {
    await restoreApi();
  }
}

main().catch(async (error) => {
  console.error(error);
  await restoreApi();
  process.exit(1);
});
