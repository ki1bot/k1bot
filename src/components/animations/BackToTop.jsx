"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let animationFrameId = 0;
    let currentVisibility = window.scrollY > 600;

    setIsVisible(currentVisibility);

    function updateVisibility() {
      animationFrameId = 0;

      const nextVisibility = window.scrollY > 600;

      if (nextVisibility === currentVisibility) {
        return;
      }

      currentVisibility = nextVisibility;
      setIsVisible(nextVisibility);
    }

    function handleScroll() {
      if (animationFrameId) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(updateVisibility);
    }

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-50 flex size-12 items-center justify-center rounded-full border border-white/15 bg-blue-600 text-white shadow-2xl shadow-blue-600/30 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500 ${
        isVisible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ChevronUp className="size-5" />
    </button>
  );
}
