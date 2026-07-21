"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  y = 32,
  scale = 0.985,
  once = true,
  as: Component = "div",
}) {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          if (once) {
            observer.unobserve(element);
          }

          return;
        }

        if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [once]);

  return (
    <Component
      ref={elementRef}
      style={{
        "--reveal-y": `${y}px`,
        "--reveal-scale": scale,
        "--reveal-delay": `${delay}ms`,
        willChange: isVisible ? "auto" : "opacity, filter, transform",
      }}
      className={cn(
        "reveal-on-scroll",
        isVisible && "reveal-on-scroll-visible",
        className,
      )}
    >
      {children}
    </Component>
  );
}
