"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const PROJECT_RETURN_STORAGE_KEY = "portfolio_project_return";
const PROJECT_RETURN_MAX_AGE = 10 * 60 * 1000;

function getValidReturnLocation() {
  try {
    const storedValue = sessionStorage.getItem(PROJECT_RETURN_STORAGE_KEY);

    sessionStorage.removeItem(PROJECT_RETURN_STORAGE_KEY);

    if (!storedValue) {
      return null;
    }

    const returnState = JSON.parse(storedValue);
    const savedAt = Number(returnState.savedAt);

    if (
      !Number.isFinite(savedAt) ||
      Date.now() - savedAt < 0 ||
      Date.now() - savedAt > PROJECT_RETURN_MAX_AGE
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

    return returnUrl;
  } catch {
    return null;
  }
}

export function ProjectBackButton() {
  const router = useRouter();

  function handleBack() {
    const returnLocation = getValidReturnLocation();

    if (returnLocation && window.history.length > 1) {
      router.back();
      return;
    }

    router.replace("/#projects");
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className="video-hover-button video-hover-button-dark inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 px-4 text-white shadow-lg shadow-blue-950/10 sm:h-12 sm:px-5"
    >
      <ArrowLeft className="size-4" />
      Back
    </button>
  );
}
