"use client";

import { useEffect } from "react";

const RELOAD_TO_HOME_HAS_RUN_KEY = "__portfolio_reload_to_home_has_run__";

function isBrowserReload() {
  if (typeof window === "undefined") {
    return false;
  }

  const navigationEntries = performance.getEntriesByType?.("navigation");
  const navigationEntry = navigationEntries?.[0];

  if (navigationEntry && "type" in navigationEntry) {
    return navigationEntry.type === "reload";
  }

  return performance.navigation?.type === 1;
}

function normalizePathname(pathname) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.replace(/\/+$/, "");
}

export function ReloadToHome() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window[RELOAD_TO_HOME_HAS_RUN_KEY]) {
      return;
    }

    window[RELOAD_TO_HOME_HAS_RUN_KEY] = true;

    if (!isBrowserReload()) {
      return;
    }

    const currentPath = normalizePathname(window.location.pathname);

    if (currentPath !== "/") {
      return;
    }

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (window.location.search || window.location.hash) {
      window.history.replaceState(null, "", "/");
    }

    window.scrollTo(0, 0);

    const animationFrameId = window.requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return null;
}
