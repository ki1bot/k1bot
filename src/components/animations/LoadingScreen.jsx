"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { assetUrl } from "@/lib/supabase-storage";

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

const MOBILE_REMOVE_DELAY = 2100;
const DESKTOP_REMOVE_DELAY = 3000;

export function LoadingScreen() {
  const loaderRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const loader = loaderRef.current;
    const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;
    const removeDelay = isMobileViewport
      ? MOBILE_REMOVE_DELAY
      : DESKTOP_REMOVE_DELAY;

    let isCancelled = false;
    let fallbackTimer = null;

    function removeLoader() {
      if (isCancelled) {
        return;
      }

      document.body.classList.remove("portfolio-loading-active");
      setIsVisible(false);
    }

    document.body.classList.add("portfolio-loading-active");

    if (!loader) {
      removeLoader();

      return () => {
        isCancelled = true;
        document.body.classList.remove("portfolio-loading-active");
      };
    }

    const loaderStyle = window.getComputedStyle(loader);
    const loaderOpacity = Number.parseFloat(loaderStyle.opacity);

    if (loaderStyle.visibility === "hidden" || loaderOpacity === 0) {
      removeLoader();

      return () => {
        isCancelled = true;
        document.body.classList.remove("portfolio-loading-active");
      };
    }

    const animations =
      typeof loader.getAnimations === "function" ? loader.getAnimations() : [];

    const exitAnimation = animations.find(
      (animation) =>
        "animationName" in animation &&
        animation.animationName === "portfolioLoaderAutoExit",
    );

    if (exitAnimation) {
      exitAnimation.finished.then(removeLoader).catch(() => {});
    } else {
      fallbackTimer = window.setTimeout(removeLoader, removeDelay);
    }

    return () => {
      isCancelled = true;

      if (fallbackTimer) {
        window.clearTimeout(fallbackTimer);
      }

      document.body.classList.remove("portfolio-loading-active");
    };
  }, []);

  function handleAnimationEnd(event) {
    if (
      event.target !== event.currentTarget ||
      event.animationName !== "portfolioLoaderAutoExit"
    ) {
      return;
    }

    document.body.classList.remove("portfolio-loading-active");
    setIsVisible(false);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <style>{`
        .portfolio-loader.portfolio-loader-auto-exit {
          animation-name: portfolioLoaderAutoExit;
          animation-duration: 700ms;
          animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
          animation-delay: 1400ms;
          animation-fill-mode: forwards;
          will-change: opacity, transform, filter;
        }

        @media (min-width: 768px) {
          .portfolio-loader.portfolio-loader-auto-exit {
            animation-delay: 2300ms;
          }
        }

        @keyframes portfolioLoaderAutoExit {
          0% {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
            transform: scale(1);
            filter: blur(0);
          }

          100% {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transform: scale(1.04);
            filter: blur(14px);
          }
        }
      `}</style>

      <div
        ref={loaderRef}
        role="status"
        aria-live="polite"
        aria-label="Loading portfolio website"
        onAnimationEnd={handleAnimationEnd}
        className="portfolio-loader portfolio-loader-auto-exit"
      >
        <div className="portfolio-loader-orb portfolio-loader-orb-1" />
        <div className="portfolio-loader-orb portfolio-loader-orb-2" />
        <div className="portfolio-loader-grid" />

        <div className="portfolio-loader-content">
          <div className="portfolio-loader-icons" aria-hidden="true">
            {loadingIcons.map((icon, index) => (
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
    </>
  );
}
