"use client";

import { useEffect } from "react";

const RELOAD_TO_HOME_HAS_RUN_KEY = "__portfolio_reload_to_home_has_run__";

const PROJECT_RETURN_STORAGE_KEY = "portfolio_project_return";

const PROJECT_RETURN_MAX_AGE = 10 * 60 * 1000;
const PORTFOLIO_SECTION_HASH = "/";

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

function hasValidProjectReturnState() {
  try {
    const storedValue = sessionStorage.getItem(PROJECT_RETURN_STORAGE_KEY);

    if (!storedValue) {
      return false;
    }

    const returnState = JSON.parse(storedValue);
    const savedAt = Number(returnState.savedAt);

    if (
      !Number.isFinite(savedAt) ||
      Date.now() - savedAt < 0 ||
      Date.now() - savedAt > PROJECT_RETURN_MAX_AGE
    ) {
      sessionStorage.removeItem(PROJECT_RETURN_STORAGE_KEY);

      return false;
    }

    const returnUrl = new URL(returnState.url, window.location.origin);

    return (
      returnUrl.origin === window.location.origin && returnUrl.pathname === "/"
    );
  } catch {
    sessionStorage.removeItem(PROJECT_RETURN_STORAGE_KEY);

    return false;
  }
}

function shouldPreservePortfolioPosition() {
  if (window.location.hash === PORTFOLIO_SECTION_HASH) {
    return true;
  }

  return hasValidProjectReturnState();
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

    if (shouldPreservePortfolioPosition()) {
      return;
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const reloadScrollDelays = isMobile
      ? MOBILE_RELOAD_SCROLL_DELAYS_MS
      : DESKTOP_RELOAD_SCROLL_DELAYS_MS;

    let timers = [];
    let hasScrollIntent = false;

    if ("scrollRestoration" in window.history) {
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

    function clearScrollTimers() {
      timers.forEach((timer) => {
        window.clearTimeout(timer);
      });

      timers = [];
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

    return () => {
      clearScrollTimers();
      removeScrollIntentListeners();
    };
  }, []);

  return null;
}
