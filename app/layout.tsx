import type { Metadata } from "next";
import { cookies } from "next/headers";
import "@fontsource-variable/onest";
import "./globals.css";
import { LocaleProvider } from "@/components/LocaleProvider";
import { company } from "@/config/company";
import { LOCALE_COOKIE, isLocale, translate, type Locale } from "@/config/i18n";
import { staticDemo } from "@/lib/runtime";

async function currentLocale(): Promise<Locale> {
  // В статической демо-версии серверных cookie нет: язык подхватывает LocaleProvider в браузере.
  if (staticDemo) return "de";
  const cookieStore = await cookies();
  const stored = cookieStore.get(LOCALE_COOKIE)?.value;
  return isLocale(stored) ? stored : "de";
}

/** Метаданные на языке пользователя — иначе во вкладке и в поиске остаётся немецкий заголовок. */
export async function generateMetadata(): Promise<Metadata> {
  const locale = await currentLocale();
  const title = translate(locale, "metaTitle");
  const description = translate(locale, "metaDescription");
  return {
    title: { default: title, template: `%s | ${company.name}` },
    description,
    metadataBase: new URL(company.site),
    openGraph: { title, description, type: "website", siteName: company.name },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await currentLocale();

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body>
        {/* Класс включает анимации появления только при работающем JS: без него контент виден сразу. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
