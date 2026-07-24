"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const OBSERVER_OPTIONS = {
  threshold: 0.08,
  rootMargin: "0px 0px -40px 0px",
};

let observerPool = null;

function getObserverPool() {
  if (observerPool) {
    return observerPool;
  }

  const callbacks = new Map();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      callbacks.get(entry.target)?.(entry);
    });
  }, OBSERVER_OPTIONS);

  observerPool = {
    callbacks,
    observer,
  };

  return observerPool;
}

function observeElement(element, callback) {
  const pool = getObserverPool();
  let isActive = true;

  pool.callbacks.set(element, callback);
  pool.observer.observe(element);

  return () => {
    if (!isActive) {
      return;
    }

    isActive = false;
    pool.callbacks.delete(element);
    pool.observer.unobserve(element);

    if (pool.callbacks.size === 0) {
      pool.observer.disconnect();
      observerPool = null;
    }
  };
}

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  y = 32,
  scale = 0.985,
  once = false,
  as: Component = "div",
}) {
  const elementRef = useRef(null);
  const hasRevealedRef = useRef(false);
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
      return;
    }

    if (!("IntersectionObserver" in window)) {
      const animationFrameId = window.requestAnimationFrame(() => {
        hasRevealedRef.current = true;
        setIsVisible(true);
      });

      return () => {
        window.cancelAnimationFrame(animationFrameId);
      };
    }

    let stopObserving = () => {};

    stopObserving = observeElement(element, (entry) => {
      if (entry.isIntersecting) {
        hasRevealedRef.current = true;
        setIsVisible(true);

        if (once) {
          stopObserving();
        }

        return;
      }

      if (!once && hasRevealedRef.current) {
        setIsVisible(false);
      }
    });

    return stopObserving;
  }, [once]);

  return (
    <Component
      ref={elementRef}
      style={{
        "--reveal-y": `${y}px`,
        "--reveal-scale": scale,
        "--reveal-delay": isVisible ? `${delay}ms` : "0ms",
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
