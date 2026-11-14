import "./globals.css";
import { SITE } from "@/lib/fmt";
const title = "EV HEXA – EV news, launches & owner reviews";
const description = "EV HEXA is an electric vehicle media platform: latest EV news, launches, charging guides and honest owner reviews from India.";
export const metadata = {
  metadataBase: new URL(SITE),
  title: { default: title, template: "%s | EV HEXA" }, description,
  keywords: ["electric vehicles", "EV news India", "EV reviews", "EV charging", "EV HEXA"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "EV HEXA", title, description, locale: "en_IN", url: "/", images: ["/logo.png"] },
  twitter: { card: "summary_large_image", title, description, images: ["/logo.png"] },
  robots: { index: true, follow: true }, icons: { icon: "/logo.png" },
};
const ld = { "@context": "https://schema.org", "@type": "Organization", name: "EV HEXA", url: SITE, logo: SITE + "/logo.png" };
export default function RootLayout({ children }) {
  return (<html lang="en"><body>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    {children}</body></html>);
}
