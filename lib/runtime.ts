/**
 * Режим сборки.
 *
 * staticDemo: статическая демо-версия для GitHub Pages — расчёт цены считается
 * в браузере тем же кодом, что и на сервере, а форма заявки открывает почтовый
 * клиент вместо API (на Pages нет серверных роутов).
 */
export const staticDemo = process.env.NEXT_PUBLIC_STATIC_DEMO === "1";

/** Префикс пути, когда сайт опубликован не в корне домена (например /- у GitHub Pages). */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(path: string): string {
  if (!basePath) return path;
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}
