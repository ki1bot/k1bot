"use client";

import { useEffect, useState } from "react";

const PORTFOLIO_READY_EVENT = "portfolio:ready";

const heroRoles = ["Fullstack Website", "Mobile Application"];

function useTypewriter(
  words,
  isActive,
  typingSpeed = 75,
  deletingSpeed = 45,
  pause = 1500,
) {
  const firstWord = words[0] || "";
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState(firstWord);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isActive || typeof window === "undefined") {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || words.length === 0) {
      return;
    }

    const currentWord = words[wordIndex] || "";

    if (!isDeleting && displayText === currentWord) {
      const pauseTimeout = window.setTimeout(() => {
        setIsDeleting(true);
      }, pause);

      return () => {
        window.clearTimeout(pauseTimeout);
      };
    }

    const timeout = window.setTimeout(
      () => {
        if (!isDeleting) {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
          return;
        }

        const nextText = currentWord.slice(0, displayText.length - 1);

        setDisplayText(nextText);

        if (nextText === "") {
          setIsDeleting(false);
          setWordIndex((currentIndex) => (currentIndex + 1) % words.length);
        }
      },
      isDeleting ? deletingSpeed : typingSpeed,
    );

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    words,
    isActive,
    wordIndex,
    displayText,
    isDeleting,
    typingSpeed,
    deletingSpeed,
    pause,
  ]);

  return displayText;
}

export function HeroTypewriter() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const activateTypewriter = () => {
      setIsReady(true);
    };

    if (!document.body.classList.contains("portfolio-loading-active")) {
      activateTypewriter();
      return;
    }

    window.addEventListener(PORTFOLIO_READY_EVENT, activateTypewriter, {
      once: true,
    });

    return () => {
      window.removeEventListener(PORTFOLIO_READY_EVENT, activateTypewriter);
    };
  }, []);

  const typedRole = useTypewriter(heroRoles, isReady);

  return (
    <div className="mt-5 min-h-[40px] text-xl font-medium text-white sm:text-2xl md:mt-7 md:min-h-[56px] md:text-3xl">
      <span>{typedRole}</span>
      <span className="ml-1 animate-pulse text-violet-400">|</span>
    </div>
  );
}
