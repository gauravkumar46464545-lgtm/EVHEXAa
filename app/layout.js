import "./globals.css";

export const metadata = {
  title: "EV HEXA – EV news, launches & owner reviews",
  description: "EV HEXA is an electric vehicle media platform: latest EV news, launches, charging guides and honest owner reviews from India.",
  icons: { icon: "/logo.png" },
  robots: { index: true, follow: true },
  openGraph: { title: "EV HEXA – EV news, launches & owner reviews", type: "website" },
  twitter: { card: "summary_large_image" },
};
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

// Applies the saved theme before first paint so there is no dark -> light flash.
const themeInit = `try{document.documentElement.dataset.theme=localStorage.getItem("evh_theme")||"dark"}catch(e){document.documentElement.dataset.theme="dark"}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeInit }} /></head>
      <body>{children}</body>
    </html>
  );
}
