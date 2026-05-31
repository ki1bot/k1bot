import "./globals.css";

import { LoadingScreen } from "@/components/animations/LoadingScreen";
import { ReloadToHome } from "@/components/animations/ReloadToHome";

export const metadata = {
  title: "Rifqi Susanto | Software Engineer",
  description:
    "Website portofolio pribadi yang menampilkan project, sertifikat, dan kontak.",
  icons: {
    icon: [
      {
        url: "/assets/logoKibot.png",
        type: "image/png",
      },
    ],
    shortcut: [
      {
        url: "/assets/logoKibot.png",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/assets/logoKibot.png",
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
      <body>
        <ReloadToHome />
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
