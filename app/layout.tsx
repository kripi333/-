import type { Metadata } from "next";
import "./globals.css";
import { LocaleProvider } from "@/components/LocaleProvider";

export const metadata: Metadata = {
  title: "UmzugKlar | Ihr Umzug. Klar geplant.",
  description: "Zuverlässige Umzüge für Wohnungen, Häuser und Unternehmen. Jetzt unverbindlich kalkulieren.",
  metadataBase: new URL("https://umzugklar.de"),
  openGraph: { title: "UmzugKlar", description: "Ihr Umzug. Klar geplant.", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="de" data-scroll-behavior="smooth"><body><LocaleProvider>{children}</LocaleProvider></body></html>;
}
