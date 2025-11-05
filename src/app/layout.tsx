import type { Metadata } from "next";
import { Geist, Geist_Mono, Jost } from "next/font/google";
import "./globals.css";
import "../styles/consultation-animations.css";
import Providers from "@/lib/providers";
import { Toaster } from "sonner";
import { getUserLocale } from "@/lib/getUserLocale";
import { getMessages } from "@/i18n";
import { LocaleProvider } from "@/components/LocaleProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jost = Jost({
  variable: "--font-jost",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TheYas Law | Next Generation Legal Artificial Intelligence",
  description: "A website that allows you to schedule bookings with legal practitioners, chat with an AI powered legal assistant, and discover lots of information.",
  keywords: ["Legal AI", "Artificial Intelligence", "Legal Practitioner", "Consultations", "Kuwait", "AI"]
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getUserLocale(); 
  const messages = await getMessages(locale);
  return (
    <html lang="ar">
      <head>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jost.variable} ${jost.className} antialiased`}
      >
        <LocaleProvider initialLocale={locale} messages={messages}>
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>

        </LocaleProvider>
      </body>
    </html>
  );
}
