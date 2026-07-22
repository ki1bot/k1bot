import Image from "next/image";

import { assetUrl } from "@/lib/supabase-storage";

const loadingIcons = [
  {
    label: "HTML",
    src: assetUrl("screen/html.png"),
  },
  {
    label: "Profile",
    src: assetUrl("screen/profile.png"),
  },
  {
    label: "Github",
    src: assetUrl("screen/github.png"),
  },
];

export function LoadingScreen() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio website"
      className="portfolio-loader portfolio-loader-auto-exit"
    >
      <div className="portfolio-loader-orb portfolio-loader-orb-1" />
      <div className="portfolio-loader-orb portfolio-loader-orb-2" />
      <div className="portfolio-loader-grid" />

      <div className="portfolio-loader-content">
        <div className="portfolio-loader-icons" aria-hidden="true">
          {loadingIcons.map((icon, index) => (
            <div key={icon.label} className="portfolio-loader-icon">
              <Image
                src={icon.src}
                alt=""
                width={40}
                height={40}
                sizes="40px"
                loading="eager"
                fetchPriority={index === 0 ? "high" : "auto"}
                className="portfolio-loader-image-icon"
                draggable={false}
              />
            </div>
          ))}
        </div>

        <h1 className="portfolio-loader-title">
          <span>Welcome To My</span>
          <strong>Portofolio Website</strong>
        </h1>

        <div className="portfolio-loader-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}
