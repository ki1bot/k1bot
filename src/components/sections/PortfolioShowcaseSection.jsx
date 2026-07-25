"use client";

import Image from "next/image";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Award,
  ChevronDown,
  ChevronUp,
  Code2,
  FolderKanban,
} from "lucide-react";

import { TECH_STACK } from "@/lib/constants";
import { CertificateCard } from "@/components/cards/CertificateCard";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

const ITEMS_PER_CLICK = 3;
const MOBILE_INITIAL_VISIBLE_ITEMS = 3;
const DESKTOP_INITIAL_VISIBLE_ITEMS = 6;
const PROJECT_RETURN_STORAGE_KEY = "portfolio_project_return";
const PORTFOLIO_SECTION_ID = "projects";

const tabs = [
  {
    key: "projects",
    label: "Projects",
    icon: FolderKanban,
  },
  {
    key: "certificates",
    label: "Certificates",
    icon: Award,
  },
  {
    key: "techstack",
    label: "Tech Stack",
    icon: Code2,
  },
];

function isVectorImage(imageUrl) {
  return /\.svg(?:\?.*)?$/i.test(imageUrl);
}

function getHeaderOffset() {
  const header = document.querySelector("header");

  if (!header) {
    return 16;
  }

  const headerStyles = window.getComputedStyle(header);
  const isFixedHeader =
    headerStyles.position === "fixed" || headerStyles.position === "sticky";

  if (!isFixedHeader) {
    return 16;
  }

  return header.getBoundingClientRect().height + 16;
}

function easeInOutCubic(progress) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

function smoothScrollToPortfolioShowcase() {
  return new Promise((resolve) => {
    const targetElement = document.getElementById(PORTFOLIO_SECTION_ID);

    if (!targetElement) {
      resolve();
      return;
    }

    const documentElement = document.documentElement;
    const previousInlineScrollBehavior = documentElement.style.scrollBehavior;

    documentElement.style.scrollBehavior = "auto";

    const startPosition = window.scrollY;
    const headerOffset = getHeaderOffset();
    const targetPosition = Math.max(
      0,
      startPosition + targetElement.getBoundingClientRect().top - headerOffset,
    );
    const distance = targetPosition - startPosition;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || Math.abs(distance) < 2) {
      window.scrollTo(0, targetPosition);
      documentElement.style.scrollBehavior = previousInlineScrollBehavior;
      resolve();
      return;
    }

    const duration = Math.min(1200, Math.max(700, Math.abs(distance) * 0.3));
    let startTime = null;

    function animateScroll(currentTime) {
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = easeInOutCubic(progress);

      window.scrollTo(0, startPosition + distance * easedProgress);

      if (progress < 1) {
        window.requestAnimationFrame(animateScroll);
        return;
      }

      window.scrollTo(0, targetPosition);
      documentElement.style.scrollBehavior = previousInlineScrollBehavior;
      resolve();
    }

    window.requestAnimationFrame(animateScroll);
  });
}

function getResponsiveVisibilityClass(
  index,
  mobileVisibleCount,
  desktopVisibleCount,
) {
  const visibleOnMobile = index < mobileVisibleCount;
  const visibleOnDesktop = index < desktopVisibleCount;

  if (!visibleOnMobile && !visibleOnDesktop) {
    return "hidden";
  }

  if (!visibleOnMobile && visibleOnDesktop) {
    return "hidden md:block";
  }

  if (visibleOnMobile && !visibleOnDesktop) {
    return "md:hidden";
  }

  return undefined;
}

function useIncrementalVisibility(totalItems) {
  const [mobileVisibleCount, setMobileVisibleCount] = useState(
    MOBILE_INITIAL_VISIBLE_ITEMS,
  );
  const [desktopVisibleCount, setDesktopVisibleCount] = useState(
    DESKTOP_INITIAL_VISIBLE_ITEMS,
  );
  const isAnimatingRef = useRef(false);

  const effectiveMobileVisibleCount = Math.min(mobileVisibleCount, totalItems);

  const effectiveDesktopVisibleCount = Math.min(
    desktopVisibleCount,
    totalItems,
  );

  const showMoreMobile = useCallback(() => {
    setMobileVisibleCount((currentCount) =>
      Math.min(currentCount + ITEMS_PER_CLICK, totalItems),
    );
  }, [totalItems]);

  const showMoreDesktop = useCallback(() => {
    setDesktopVisibleCount((currentCount) =>
      Math.min(currentCount + ITEMS_PER_CLICK, totalItems),
    );
  }, [totalItems]);

  const showLess = useCallback(async () => {
    if (isAnimatingRef.current) {
      return;
    }

    isAnimatingRef.current = true;

    await smoothScrollToPortfolioShowcase();

    setMobileVisibleCount(MOBILE_INITIAL_VISIBLE_ITEMS);
    setDesktopVisibleCount(DESKTOP_INITIAL_VISIBLE_ITEMS);
    isAnimatingRef.current = false;
  }, []);

  return {
    mobileVisibleCount: effectiveMobileVisibleCount,
    desktopVisibleCount: effectiveDesktopVisibleCount,
    showMoreMobile,
    showMoreDesktop,
    showLess,
  };
}

const TechStackGrid = memo(function TechStackGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {TECH_STACK.map((tech, index) => (
        <RevealOnScroll key={tech.name} delay={index * 35}>
          <div className="group rounded-[1.25rem] border border-white/10 bg-white/[0.06] p-4 shadow-xl shadow-blue-950/10 backdrop-blur-md transition duration-300 hover:-translate-y-2 hover:border-violet-300/25 hover:bg-white/[0.1] hover:shadow-violet-500/15 sm:rounded-[1.5rem] sm:p-5">
            <div className="flex min-h-[124px] flex-col items-center justify-center gap-3 sm:min-h-[150px] sm:gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] p-3 transition duration-300 group-hover:scale-110 group-hover:bg-violet-500/15 sm:size-16 sm:rounded-3xl">
                <Image
                  src={tech.icon}
                  alt={tech.name}
                  width={64}
                  height={64}
                  sizes="64px"
                  loading="lazy"
                  unoptimized={isVectorImage(tech.icon)}
                  className="h-full w-full object-contain transition duration-300 group-hover:rotate-6"
                />
              </div>

              <p className="text-center text-xs font-semibold text-white sm:text-sm">
                {tech.name}
              </p>
            </div>
          </div>
        </RevealOnScroll>
      ))}
    </div>
  );
});

function PaginationButton({ label, icon: Icon, onClick }) {
  const isShowLess = label === "Show Less";

  const buttonAppearance = isShowLess
    ? "border-fuchsia-300/25 bg-[linear-gradient(135deg,rgba(217,70,239,0.16),rgba(124,58,237,0.12),rgba(15,23,42,0.56))] shadow-[0_16px_36px_rgba(88,28,135,0.18)] hover:border-fuchsia-200/45 hover:shadow-[0_20px_44px_rgba(168,85,247,0.26)]"
    : "border-cyan-300/25 bg-[linear-gradient(135deg,rgba(59,130,246,0.17),rgba(124,58,237,0.13),rgba(15,23,42,0.56))] shadow-[0_16px_36px_rgba(30,64,175,0.18)] hover:border-cyan-200/45 hover:shadow-[0_20px_44px_rgba(59,130,246,0.25)]";

  const accentLineAppearance = isShowLess
    ? "via-fuchsia-200/80"
    : "via-cyan-200/80";

  const ambientGlowAppearance = isShowLess
    ? "bg-fuchsia-500/25 group-hover:bg-fuchsia-400/35"
    : "bg-blue-500/25 group-hover:bg-cyan-400/35";

  const iconBorderAppearance = isShowLess
    ? "bg-gradient-to-br from-fuchsia-200/60 via-violet-300/30 to-fuchsia-500/20 text-fuchsia-100 shadow-[0_0_20px_rgba(217,70,239,0.18)]"
    : "bg-gradient-to-br from-cyan-200/60 via-blue-300/30 to-violet-500/20 text-cyan-100 shadow-[0_0_20px_rgba(59,130,246,0.18)]";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`group relative inline-flex min-h-[52px] w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020617] sm:min-h-14 sm:w-auto sm:px-7 sm:text-sm sm:tracking-[0.18em] ${buttonAppearance}`}
    >
      <span className="pointer-events-none absolute inset-[1px] rounded-[calc(1rem-1px)] border border-white/[0.06] bg-[#10142d]/55" />

      <span
        className={`pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent to-transparent ${accentLineAppearance}`}
      />

      <span
        className={`pointer-events-none absolute -bottom-10 left-1/2 h-20 w-36 -translate-x-1/2 rounded-full blur-2xl transition duration-500 ${ambientGlowAppearance}`}
      />

      <span className="pointer-events-none absolute -left-16 top-[-70%] h-[240%] w-10 rotate-[18deg] bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[115%] group-hover:opacity-100" />

      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.12),transparent_42%)] opacity-70" />

      <span className="relative z-10 bg-gradient-to-r from-white via-blue-100 to-violet-100 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(255,255,255,0.12)]">
        {label}
      </span>

      <span
        className={`relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full p-px transition duration-300 group-hover:scale-110 sm:size-9 ${iconBorderAppearance}`}
      >
        <span className="flex h-full w-full items-center justify-center rounded-full border border-white/10 bg-[#171a36]/95 shadow-inner shadow-white/5">
          <Icon
            className={`size-4 transition duration-300 ${
              isShowLess
                ? "group-hover:-translate-y-0.5"
                : "group-hover:translate-y-0.5"
            }`}
          />
        </span>
      </span>
    </button>
  );
}

function DevicePaginationControls({
  visibleCount,
  initialVisibleCount,
  totalCount,
  onShowMore,
  onShowLess,
  visibilityClass,
}) {
  const hiddenCount = Math.max(totalCount - visibleCount, 0);
  const nextVisibleCount = Math.min(ITEMS_PER_CLICK, hiddenCount);
  const canShowMore = hiddenCount > 0;
  const canShowLess = visibleCount > Math.min(initialVisibleCount, totalCount);

  if (!canShowMore && !canShowLess) {
    return null;
  }

  return (
    <div
      className={`mt-8 flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row ${visibilityClass}`}
    >
      {canShowMore && (
        <PaginationButton
          label={`See More ${nextVisibleCount}`}
          icon={ChevronDown}
          onClick={onShowMore}
        />
      )}

      {canShowLess && (
        <PaginationButton
          label="Show Less"
          icon={ChevronUp}
          onClick={onShowLess}
        />
      )}
    </div>
  );
}

function PaginationControls({
  mobileVisibleCount,
  desktopVisibleCount,
  totalCount,
  onShowMoreMobile,
  onShowMoreDesktop,
  onShowLess,
}) {
  return (
    <>
      <DevicePaginationControls
        visibleCount={mobileVisibleCount}
        initialVisibleCount={MOBILE_INITIAL_VISIBLE_ITEMS}
        totalCount={totalCount}
        onShowMore={onShowMoreMobile}
        onShowLess={onShowLess}
        visibilityClass="flex md:hidden"
      />

      <DevicePaginationControls
        visibleCount={desktopVisibleCount}
        initialVisibleCount={DESKTOP_INITIAL_VISIBLE_ITEMS}
        totalCount={totalCount}
        onShowMore={onShowMoreDesktop}
        onShowLess={onShowLess}
        visibilityClass="hidden md:flex"
      />
    </>
  );
}

const ProjectsPanel = memo(function ProjectsPanel({ projects }) {
  const projectItems = useMemo(() => {
    return Array.isArray(projects) ? projects : [];
  }, [projects]);

  const {
    mobileVisibleCount,
    desktopVisibleCount,
    showMoreMobile,
    showMoreDesktop,
    showLess,
  } = useIncrementalVisibility(projectItems.length);

  const visibleProjects = useMemo(() => {
    const maximumVisibleCount = Math.max(
      mobileVisibleCount,
      desktopVisibleCount,
    );

    return projectItems.slice(0, maximumVisibleCount);
  }, [desktopVisibleCount, mobileVisibleCount, projectItems]);

  if (!projectItems.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-center text-sm text-blue-100/65 sm:p-8 sm:text-base">
        Belum ada project yang ditampilkan.
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
        {visibleProjects.map((project, index) => (
          <RevealOnScroll
            key={project.id ?? project.title}
            delay={index * 70}
            className={getResponsiveVisibilityClass(
              index,
              mobileVisibleCount,
              desktopVisibleCount,
            )}
          >
            <ProjectCard project={project} />
          </RevealOnScroll>
        ))}
      </div>

      <PaginationControls
        mobileVisibleCount={mobileVisibleCount}
        desktopVisibleCount={desktopVisibleCount}
        totalCount={projectItems.length}
        onShowMoreMobile={showMoreMobile}
        onShowMoreDesktop={showMoreDesktop}
        onShowLess={showLess}
      />
    </div>
  );
});

const CertificatesPanel = memo(function CertificatesPanel({ certificates }) {
  const certificateItems = useMemo(() => {
    return Array.isArray(certificates) ? certificates : [];
  }, [certificates]);

  const {
    mobileVisibleCount,
    desktopVisibleCount,
    showMoreMobile,
    showMoreDesktop,
    showLess,
  } = useIncrementalVisibility(certificateItems.length);

  const visibleCertificates = useMemo(() => {
    const maximumVisibleCount = Math.max(
      mobileVisibleCount,
      desktopVisibleCount,
    );

    return certificateItems.slice(0, maximumVisibleCount);
  }, [certificateItems, desktopVisibleCount, mobileVisibleCount]);

  if (!certificateItems.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-center text-sm text-blue-100/65 sm:p-8 sm:text-base">
        Belum ada sertifikat yang ditampilkan.
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
        {visibleCertificates.map((certificate, index) => (
          <RevealOnScroll
            key={certificate.id ?? certificate.title ?? certificate.img}
            delay={index * 70}
            className={getResponsiveVisibilityClass(
              index,
              mobileVisibleCount,
              desktopVisibleCount,
            )}
          >
            <CertificateCard certificate={certificate} />
          </RevealOnScroll>
        ))}
      </div>

      <PaginationControls
        mobileVisibleCount={mobileVisibleCount}
        desktopVisibleCount={desktopVisibleCount}
        totalCount={certificateItems.length}
        onShowMoreMobile={showMoreMobile}
        onShowMoreDesktop={showMoreDesktop}
        onShowLess={showLess}
      />
    </div>
  );
});

export function PortfolioShowcaseSection({ projects = [], certificates = [] }) {
  const [activeTab, setActiveTab] = useState("projects");

  useEffect(() => {
    try {
      sessionStorage.removeItem(PROJECT_RETURN_STORAGE_KEY);
    } catch {}
  }, []);

  const selectTab = useCallback(
    (tabKey) => {
      if (tabKey === activeTab) {
        return;
      }

      setActiveTab(tabKey);
    },
    [activeTab],
  );

  return (
    <section
      id={PORTFOLIO_SECTION_ID}
      className="border-t border-white/10 py-20 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <RevealOnScroll className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
              Portofolio Showcase
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-blue-100/72 sm:text-base md:mt-5 md:text-lg md:leading-8">
            Jelajahi project, sertifikat, dan teknologi yang saya gunakan dalam
            proses belajar dan pengembangan Portofolio ini.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={100} y={20}>
          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-2.5 shadow-2xl shadow-blue-950/20 backdrop-blur-md sm:mt-12 sm:rounded-[2rem] sm:p-4">
            <div className="grid grid-cols-3 gap-2 sm:gap-3" role="tablist">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => selectTab(tab.key)}
                    className={`group flex min-h-[74px] flex-col items-center justify-center rounded-[1.05rem] border px-2 py-3 text-center transition duration-300 sm:min-h-[96px] sm:rounded-[1.4rem] sm:px-6 sm:py-5 ${
                      isActive
                        ? "border-violet-300/20 bg-[linear-gradient(135deg,rgba(124,58,237,0.28),rgba(255,255,255,0.08))] shadow-xl shadow-violet-500/10"
                        : "border-transparent bg-transparent hover:border-white/10 hover:bg-white/[0.04]"
                    }`}
                  >
                    <Icon
                      className={`mb-2 size-4 transition sm:mb-3 sm:size-5 ${
                        isActive
                          ? "text-violet-200"
                          : "text-blue-100/55 group-hover:text-blue-100/85"
                      }`}
                    />

                    <span
                      className={`text-[11px] font-semibold leading-tight transition min-[390px]:text-xs sm:text-2xl ${
                        isActive
                          ? "text-white"
                          : "text-blue-100/70 group-hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </RevealOnScroll>

        <div className="mt-8 sm:mt-10" role="tabpanel">
          {activeTab === "projects" && <ProjectsPanel projects={projects} />}

          {activeTab === "certificates" && (
            <CertificatesPanel certificates={certificates} />
          )}

          {activeTab === "techstack" && <TechStackGrid />}
        </div>
      </div>
    </section>
  );
}
