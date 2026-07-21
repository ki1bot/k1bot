import "./globals.css";

import { LoadingScreen } from "@/components/animations/LoadingScreen";
import { ReloadToHome } from "@/components/animations/ReloadToHome";
import { assetUrl } from "@/lib/supabase-storage";

const siteIcon = "/assets/logoKibot.png?v=2";

export const metadata = {
  title: "Rifqi | Software Development",
  description:
    "Website portofolio pribadi yang menampilkan project, sertifikat, dan kontak.",
  icons: {
    icon: [
      {
        url: siteIcon,
        type: "image/png",
      },
    ],
    shortcut: [
      {
        url: siteIcon,
        type: "image/png",
      },
    ],
    apple: [
      {
        url: siteIcon,
        type: "image/png",
      },
    ],
  },
};

export const viewport = {
  themeColor: "#020617",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className="portfolio-is-loading"
    >
      <body
        suppressHydrationWarning
        style={{
          "--portfolio-gradient-blue-image": `url("${assetUrl(
            "assets/gradient-blue.jpg",
          )}")`,
        }}
      >
        <ReloadToHome />
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
