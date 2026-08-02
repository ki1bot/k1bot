"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const MOBILE_EXIT_DELAY_MS = 1200;
const MOBILE_REMOVE_DELAY_MS = 1700;

const DESKTOP_EXIT_DELAY_MS = 2300;
const DESKTOP_REMOVE_DELAY_MS = 3000;

const PORTFOLIO_READY_EVENT = "portfolio:ready";

const loadingIcons = [
  {
    label: "HTML",
    src: "/img/screen/html.png",
    desktopDelay: "0ms",
    mobileDelay: "0ms",
  },
  {
    label: "Profile",
    src: "/img/screen/profile.png",
    desktopDelay: "140ms",
    mobileDelay: "90ms",
  },
  {
    label: "Github",
    src: "/img/screen/github.png",
    desktopDelay: "280ms",
    mobileDelay: "180ms",
  },
];

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const exitDelay = isMobile ? MOBILE_EXIT_DELAY_MS : DESKTOP_EXIT_DELAY_MS;

    const removeDelay = isMobile
      ? MOBILE_REMOVE_DELAY_MS
      : DESKTOP_REMOVE_DELAY_MS;

    document.body.classList.add("portfolio-loading-active");

    const exitTimer = window.setTimeout(() => {
      setIsLeaving(true);
    }, exitDelay);

    const removeTimer = window.setTimeout(() => {
      setIsVisible(false);
      document.body.classList.remove("portfolio-loading-active");
      window.dispatchEvent(new Event(PORTFOLIO_READY_EVENT));
    }, removeDelay);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
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
                "--loader-icon-delay": icon.desktopDelay,
                "--loader-icon-mobile-delay": icon.mobileDelay,
              }}
            >
              <Image
                src={icon.src}
                alt=""
                width={48}
                height={48}
                sizes="(max-width: 639px) 36px, 40px"
                quality={75}
                priority
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
