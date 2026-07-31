"use client";

import { useEffect } from "react";

const RELOAD_TO_HOME_HAS_RUN_KEY = "__portfolio_reload_to_home_has_run__";
const PROJECT_RETURN_STORAGE_KEY = "portfolio_project_return";

const MOBILE_RELOAD_SCROLL_DELAYS_MS = [0, 50, 150, 350, 700, 1100, 1500];

const DESKTOP_RELOAD_SCROLL_DELAYS_MS = [
  0, 50, 150, 350, 700, 1200, 1800, 2300, 2800,
];

const SCROLL_INTENT_EVENTS = ["wheel", "touchstart", "pointerdown"];

const SCROLL_INTENT_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  "Space",
]);

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

    if (!isBrowserReload()) {
      return;
    }

    const currentPath = normalizePathname(window.location.pathname);

    if (currentPath !== "/") {
      return;
    }

    if (window[RELOAD_TO_HOME_HAS_RUN_KEY]) {
      return;
    }

    window[RELOAD_TO_HOME_HAS_RUN_KEY] = true;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const reloadScrollDelays = isMobile
      ? MOBILE_RELOAD_SCROLL_DELAYS_MS
      : DESKTOP_RELOAD_SCROLL_DELAYS_MS;

    let timers = [];
    let restoreScrollRestorationTimer = null;
    let hasScrollIntent = false;

    const previousScrollRestoration =
      "scrollRestoration" in window.history
        ? window.history.scrollRestoration
        : null;

    try {
      sessionStorage.removeItem(PROJECT_RETURN_STORAGE_KEY);
    } catch {}

    if (previousScrollRestoration !== null) {
      window.history.scrollRestoration = "manual";
    }

    if (window.location.search || window.location.hash) {
      window.history.replaceState(window.history.state, "", "/");
    }

    function scrollToHome() {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    }

    function restoreScrollRestoration() {
      if (previousScrollRestoration === null) {
        return;
      }

      window.history.scrollRestoration = previousScrollRestoration;
    }

    function clearScrollTimers() {
      timers.forEach((timer) => {
        window.clearTimeout(timer);
      });

      timers = [];

      if (restoreScrollRestorationTimer !== null) {
        window.clearTimeout(restoreScrollRestorationTimer);

        restoreScrollRestorationTimer = null;
      }
    }

    function removeScrollIntentListeners() {
      SCROLL_INTENT_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, handleScrollIntent);
      });

      window.removeEventListener("keydown", handleScrollIntentKeyDown);
    }

    function handleScrollIntent() {
      if (hasScrollIntent) {
        return;
      }

      hasScrollIntent = true;

      clearScrollTimers();
      removeScrollIntentListeners();
      restoreScrollRestoration();
    }

    function handleScrollIntentKeyDown(event) {
      if (!SCROLL_INTENT_KEYS.has(event.code)) {
        return;
      }

      handleScrollIntent();
    }

    SCROLL_INTENT_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, handleScrollIntent, {
        passive: true,
      });
    });

    window.addEventListener("keydown", handleScrollIntentKeyDown);

    scrollToHome();

    timers = reloadScrollDelays.map((delay) =>
      window.setTimeout(scrollToHome, delay),
    );

    const finalScrollDelay = Math.max(...reloadScrollDelays);

    restoreScrollRestorationTimer = window.setTimeout(() => {
      restoreScrollRestoration();
      removeScrollIntentListeners();
      restoreScrollRestorationTimer = null;
    }, finalScrollDelay + 100);

    return () => {
      clearScrollTimers();
      removeScrollIntentListeners();
      restoreScrollRestoration();
    };
  }, []);

  return null;
}
