import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE, OG_IMAGE } from "@/lib/site";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBar from "@/components/layout/MobileBar";
import SmoothScroll from "@/components/layout/SmoothScroll";
import PageTransition from "@/components/layout/PageTransition";
import EnquiryModalProvider from "@/components/forms/EnquiryModal";
import PlanProvider from "@/components/plan/Plan";

const sans = Geist({ subsets: ["latin"], variable: "--ff-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--ff-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "SME Market | AI-powered growth for UAE SMEs",
    template: "%s | SME Market",
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: "SME Market | Growth you can count",
    description: SITE.description,
    locale: "en_AE",
    url: "/",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", title: "SME Market | Growth you can count", description: SITE.description, images: [OG_IMAGE.url] },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#f2eee6",
  width: "device-width",
  initialScale: 1,
};

const orgLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE.name,
  legalName: SITE.legal,
  url: SITE.url,
  email: SITE.email,
  telephone: SITE.phone,
  description: SITE.description,
  areaServed: { "@type": "Country", name: "United Arab Emirates" },
  address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE", streetAddress: "Meydan Free Zone" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
          Skip to content
        </a>
        <SmoothScroll />
        <EnquiryModalProvider>
          <PlanProvider>
          <Header />
          <main id="main" className="relative z-10 rounded-b-[40px] bg-paper">
            {children}
          </main>
          <Footer />
          <MobileBar />
          <PageTransition />
          </PlanProvider>
        </EnquiryModalProvider>
      </body>
    </html>
  );
}
