import "./globals.css";
import "./loading-screen.css";

import { LoadingScreen } from "@/components/animations/LoadingScreen";
import { ReloadToHome } from "@/components/animations/ReloadToHome";

const siteIcon = "/assets/logoKibot.png?v=2";

export const metadata = {
  title: "Rifqi | Software Engineer",
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
    <html lang="id" data-scroll-behavior="smooth">
      <body>
        <ReloadToHome />
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
