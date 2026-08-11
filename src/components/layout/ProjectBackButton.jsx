"use client";

import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const PROJECT_RETURN_STORAGE_KEY = "portfolio_project_return";
const PROJECT_RETURN_MAX_AGE = 10 * 60 * 1000;
const PORTFOLIO_FALLBACK_URL = "/#projects";

function getValidReturnLocation() {
  try {
    const storedValue = sessionStorage.getItem(PROJECT_RETURN_STORAGE_KEY);

    sessionStorage.removeItem(PROJECT_RETURN_STORAGE_KEY);

    if (!storedValue) {
      return null;
    }

    const returnState = JSON.parse(storedValue);
    const savedAt = Number(returnState.savedAt);
    const stateAge = Date.now() - savedAt;

    if (
      !Number.isFinite(savedAt) ||
      stateAge < 0 ||
      stateAge > PROJECT_RETURN_MAX_AGE
    ) {
      return null;
    }

    const returnUrl = new URL(returnState.url, window.location.origin);

    if (
      returnUrl.origin !== window.location.origin ||
      returnUrl.pathname !== "/"
    ) {
      return null;
    }

    if (!returnUrl.hash) {
      returnUrl.hash = "#projects";
    }

    return returnUrl;
  } catch {
    return null;
  }
}

export function ProjectBackButton() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch(PORTFOLIO_FALLBACK_URL);
  }, [router]);

  function prefetchPortfolio() {
    router.prefetch(PORTFOLIO_FALLBACK_URL);
  }

  function handleBack() {
    const returnLocation = getValidReturnLocation();

    if (returnLocation && window.history.length > 1) {
      router.back();
      return;
    }

    if (returnLocation) {
      const returnPath = `${returnLocation.pathname}${returnLocation.search}${returnLocation.hash}`;

      router.replace(returnPath);
      return;
    }

    router.replace(PORTFOLIO_FALLBACK_URL);
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      onPointerEnter={prefetchPortfolio}
      onFocus={prefetchPortfolio}
      onTouchStart={prefetchPortfolio}
      className="video-hover-button video-hover-button-dark inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 px-4 text-white shadow-lg shadow-blue-950/10 sm:h-12 sm:px-5"
    >
      <ArrowLeft className="size-4" />
      Back
    </button>
  );
}
