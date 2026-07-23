"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { assetUrl } from "@/lib/supabase-storage";

const MOBILE_MEDIA_QUERY = "(max-width: 767px)";

const loadingIcons = [
  {
    label: "HTML",
    src: assetUrl("screen/html.png"),
    delay: "0ms",
  },
  {
    label: "Profile",
    src: assetUrl("screen/profile.png"),
    delay: "140ms",
  },
  {
    label: "Github",
    src: assetUrl("screen/github.png"),
    delay: "280ms",
  },
];

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const htmlElement = document.documentElement;
    const isMobile = window.matchMedia(MOBILE_MEDIA_QUERY).matches;
    const exitDelay = isMobile ? 1600 : 2300;
    const removeDelay = isMobile ? 2300 : 3000;

    document.body.classList.add("portfolio-loading-active");

    const exitTimer = window.setTimeout(() => {
      setIsLeaving(true);
      htmlElement.classList.remove("portfolio-is-loading");
    }, exitDelay);

    const removeTimer = window.setTimeout(() => {
      setIsVisible(false);
      document.body.classList.remove("portfolio-loading-active");
    }, removeDelay);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
      htmlElement.classList.remove("portfolio-is-loading");
      document.body.classList.remove("portfolio-loading-active");
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio website"
      className={`portfolio-loader ${isLeaving ? "portfolio-loader-exit" : ""}`}
    >
      <div className="portfolio-loader-orb portfolio-loader-orb-1" />
      <div className="portfolio-loader-orb portfolio-loader-orb-2" />
      <div className="portfolio-loader-grid" />

      <div className="portfolio-loader-content">
        <div className="portfolio-loader-icons" aria-hidden="true">
          {loadingIcons.map((icon) => (
            <div
              key={icon.label}
              className="portfolio-loader-icon"
              style={{
                "--loader-icon-delay": icon.delay,
              }}
            >
              <Image
                src={icon.src}
                alt=""
                width={48}
                height={48}
                sizes="(min-width: 640px) 40px, 35px"
                quality={60}
                loading="eager"
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
