"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronUp } from "lucide-react";

const SHOW_BUTTON_AFTER = 600;
const SCROLL_DURATION = 850;

function easeOutQuart(progress) {
  return 1 - Math.pow(1 - progress, 4);
}

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const visibilityFrameRef = useRef(null);
  const scrollAnimationFrameRef = useRef(null);

  useEffect(() => {
    function updateVisibility() {
      setIsVisible(window.scrollY > SHOW_BUTTON_AFTER);
      visibilityFrameRef.current = null;
    }

    function handleScroll() {
      if (visibilityFrameRef.current !== null) {
        return;
      }

      visibilityFrameRef.current =
        window.requestAnimationFrame(updateVisibility);
    }

    updateVisibility();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (visibilityFrameRef.current !== null) {
        window.cancelAnimationFrame(visibilityFrameRef.current);
      }

      if (scrollAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollAnimationFrameRef.current);
      }
    };
  }, []);

  function scrollToTop() {
    if (scrollAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(scrollAnimationFrameRef.current);
    }

    const initialScrollPosition = window.scrollY;

    if (initialScrollPosition <= 0) {
      return;
    }

    const animationStartTime = performance.now();

    function animateScroll(currentTime) {
      const elapsedTime = currentTime - animationStartTime;
      const progress = Math.min(elapsedTime / SCROLL_DURATION, 1);
      const easedProgress = easeOutQuart(progress);
      const nextScrollPosition = initialScrollPosition * (1 - easedProgress);

      window.scrollTo(0, Math.max(nextScrollPosition, 0));

      if (progress < 1) {
        scrollAnimationFrameRef.current =
          window.requestAnimationFrame(animateScroll);
        return;
      }

      window.scrollTo(0, 0);
      scrollAnimationFrameRef.current = null;
    }

    scrollAnimationFrameRef.current =
      window.requestAnimationFrame(animateScroll);
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      className={`fixed bottom-6 right-6 z-[80] flex size-12 items-center justify-center rounded-full border border-white/15 bg-blue-600 text-white shadow-2xl shadow-blue-600/30 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105 hover:bg-blue-500 active:translate-y-0 active:scale-95 sm:bottom-8 sm:right-8 sm:size-14 ${
        isVisible
          ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-6 scale-90 opacity-0"
      }`}
    >
      <ChevronUp className="size-5 sm:size-6" />
    </button>
  );
}
