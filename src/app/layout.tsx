import type { Metadata } from "next";
import { Geist, Geist_Mono, Jost } from "next/font/google";
import "./globals.css";
import "../styles/consultation-animations.css";
import Providers from "@/lib/providers";
import { Toaster } from "sonner";
import { LocaleProvider } from "@/provider/LocaleProvider";

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

// 🔹 Dynamic metadata for each language (SEO + OpenGraph + Twitter + hreflang)
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params?.locale || "ar"; // default to Arabic for SEO focus
  const isArabic = locale === "ar";
  const baseUrl = "https://theyas.co"; // ⚠️ Replace with your actual domain
  const title = isArabic
    ? "ذا ياس لو | الجيل الجديد من الذكاء الاصطناعي القانوني"
    : "TheYas Law | Next Generation Legal Artificial Intelligence";
  const description =
    "احجز مواعيد مع المحامين، تحدث مع مساعد قانوني مدعوم بالذكاء الاصطناعي، واكتشف معلومات قانونية مفيدة.. English: Book consultations with lawyers, chat with an AI-powered legal assistant, and explore legal insights.";
  const keywords =
    "الذكاء الاصطناعي القانوني, محامي, استشارات قانونية, الكويت, AI, Legal AI, Artificial Intelligence, Legal Practitioner, Consultations, Kuwait, AI";

  return {
    metadataBase: new URL(baseUrl),
    title: title,
    description: description,
    keywords: keywords,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        ar: `${baseUrl}/ar`,
      },
    },
    openGraph: {
      type: "website",
      locale: isArabic ? "ar_AR" : "en_US",
      url: `${baseUrl}/${locale}`,
      title: title,
      description: description,
      siteName: "TheYas Law",
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [`${baseUrl}/og-image.jpg`],
    },
    other: {
      "Content-Language": isArabic ? "ar" : "en",
      "og:locale": isArabic ? "ar_AR" : "en_US",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: { locale: string } }>) {
  const locale = params?.locale || "ar";
  const dir = locale === "ar" ? "rtl" : "ltr";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: "TheYas Law",
    description:
      locale === "ar"
        ? "ذا ياس لو | الجيل الجديد من الذكاء الاصطناعي القانوني"
        : "TheYas Law | Next Generation Legal Artificial Intelligence",
    url: `https://theyas.co`,
    areaServed: locale === "ar" ? "الكويت" : "Kuwait",
    inLanguage: locale,
    sameAs: [
      "https://www.facebook.com/theyaslaw",
      "https://www.linkedin.com/company/theyaslaw",
      "https://x.com/theyaslaw",
    ],
  };

  return (
    <html lang={locale} dir={dir}>
      <head>
        {/* 🔹 Structured Data for Google Knowledge Panel */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jost.variable} ${jost.className} antialiased`}
      >
        <LocaleProvider>
          <Providers>
            {children}
            <Toaster richColors position="top-right" />
          </Providers>
        </LocaleProvider>
      </body>
    </html>
  );
}
