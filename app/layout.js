import "./globals.css";
import { SITE } from "@/lib/fmt";
import Effects from "@/components/Effects";

const title = "EV HEXA – EV news, launches & owner reviews";
const description = "EV HEXA is an electric vehicle media platform: latest EV news, launches, charging guides and honest owner reviews from India.";

export const metadata = {
  metadataBase: new URL(SITE),
  title: { default: title, template: "%s | EV HEXA" },
  description,
  keywords: ["electric vehicles", "EV news India", "EV reviews", "EV charging", "EV HEXA"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "EV HEXA", title, description, locale: "en_IN", url: "/", images: ["/logo.png"] },
  twitter: { card: "summary_large_image", title, description, images: ["/logo.png"] },
  robots: { index: true, follow: true },
  icons: { icon: "/logo.png" },
};

const ld = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "EV HEXA",
  url: SITE,
  logo: SITE + "/logo.png",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Flat No. D-58, 12M-3-8, Gandhinagar, Sigra",
    addressLocality: "Varanasi",
    addressRegion: "Uttar Pradesh",
    postalCode: "221010",
    addressCountry: "IN",
  },
  sameAs: ["https://www.instagram.com/evhexa.it/", "https://www.youtube.com/@EVHEXA"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.dataset.theme="light";try{localStorage.setItem("evh_theme","light")}catch(e){}`,
          }}
        />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
        <Effects />
        {children}
      </body>
    </html>
  );
}