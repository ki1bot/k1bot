"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const TRANSPARENT_GIF =
  "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function resetGifMotion(element) {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  element.classList.remove("is-gif-active");
  element.style.setProperty("--gif-x", "0px");
  element.style.setProperty("--gif-y", "0px");
  element.style.setProperty("--gif-rotate-x", "0deg");
  element.style.setProperty("--gif-rotate-y", "0deg");
  element.style.setProperty("--gif-scale", "1");
  element.style.setProperty("--gif-spot-x", "50%");
  element.style.setProperty("--gif-spot-y", "50%");
  element.style.setProperty("--gif-glow-opacity", "0");
}

export function HeroInteractiveImage({ source }) {
  const gifFieldRef = useRef(null);
  const [shouldLoadGif, setShouldLoadGif] = useState(false);

  useEffect(() => {
    const gifField = gifFieldRef.current;

    if (!gifField) {
      return;
    }

    const desktopMediaQuery = window.matchMedia("(min-width: 1024px)");
    let animationFrameId = 0;

    function scheduleGifLoad() {
      animationFrameId = window.requestAnimationFrame(() => {
        setShouldLoadGif(true);
      });
    }

    if (desktopMediaQuery.matches) {
      scheduleGifLoad();

      return () => {
        window.cancelAnimationFrame(animationFrameId);
      };
    }

    if (!("IntersectionObserver" in window)) {
      scheduleGifLoad();

      return () => {
        window.cancelAnimationFrame(animationFrameId);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((entry) => entry.isIntersecting);

        if (!isVisible) {
          return;
        }

        setShouldLoadGif(true);
        observer.disconnect();
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.01,
      },
    );

    observer.observe(gifField);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  function handleGifPointerMove(event) {
    const element = event.currentTarget;

    if (!(element instanceof HTMLElement)) {
      return;
    }

    const rect = element.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0) {
      return;
    }

    const pointerX = clamp(event.clientX - rect.left, 0, rect.width);
    const pointerY = clamp(event.clientY - rect.top, 0, rect.height);

    const normalizedX = pointerX / rect.width - 0.5;
    const normalizedY = pointerY / rect.height - 0.5;

    const translateX = normalizedX * 34;
    const translateY = normalizedY * 26;
    const rotateX = normalizedY * -9;
    const rotateY = normalizedX * 12;

    element.classList.add("is-gif-active");
    element.style.setProperty("--gif-x", `${translateX.toFixed(2)}px`);
    element.style.setProperty("--gif-y", `${translateY.toFixed(2)}px`);
    element.style.setProperty("--gif-rotate-x", `${rotateX.toFixed(2)}deg`);
    element.style.setProperty("--gif-rotate-y", `${rotateY.toFixed(2)}deg`);
    element.style.setProperty("--gif-scale", "1.055");
    element.style.setProperty(
      "--gif-spot-x",
      `${(pointerX / rect.width) * 100}%`,
    );
    element.style.setProperty(
      "--gif-spot-y",
      `${(pointerY / rect.height) * 100}%`,
    );
    element.style.setProperty("--gif-glow-opacity", "1");
  }

  function handleGifPointerLeave(event) {
    resetGifMotion(event.currentTarget);
  }

  return (
    <div
      ref={gifFieldRef}
      onPointerMove={handleGifPointerMove}
      onPointerLeave={handleGifPointerLeave}
      onPointerCancel={handleGifPointerLeave}
      className="hero-gif-field relative mx-auto flex w-full max-w-[320px] cursor-pointer items-center justify-center bg-transparent sm:max-w-[420px] md:max-w-[520px] lg:max-w-[720px]"
    >
      <Image
        src={shouldLoadGif ? source : TRANSPARENT_GIF}
        alt="Frontend development illustration"
        width={690}
        height={690}
        sizes="(max-width: 639px) 320px, (max-width: 767px) 420px, (max-width: 1023px) 520px, 690px"
        loading={shouldLoadGif ? "eager" : "lazy"}
        fetchPriority={shouldLoadGif ? "high" : "low"}
        decoding="async"
        unoptimized
        className="hero-gif-image relative z-10 w-full max-w-[320px] object-contain sm:max-w-[420px] md:max-w-[520px] lg:max-w-[690px]"
      />
    </div>
  );
}
