"use client";

import { useEffect, useState } from "react";
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

const MOBILE_VISIBLE_ITEMS_LIMIT = 3;
const DESKTOP_VISIBLE_ITEMS_LIMIT = 6;
const PROJECT_RETURN_STORAGE_KEY = "portfolio_project_return";

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

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    function handleChange(event) {
      setIsMobile(event.matches);
    }

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return isMobile;
}

function TechStackGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {TECH_STACK.map((tech, index) => (
        <RevealOnScroll key={tech.name} delay={index * 35}>
          <div className="group rounded-[1.25rem] border border-white/10 bg-white/[0.06] p-4 shadow-xl shadow-blue-950/10 backdrop-blur-md transition duration-300 hover:-translate-y-2 hover:border-violet-300/25 hover:bg-white/[0.1] hover:shadow-violet-500/15 sm:rounded-[1.5rem] sm:p-5">
            <div className="flex min-h-[124px] flex-col items-center justify-center gap-3 sm:min-h-[150px] sm:gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] p-3 transition duration-300 group-hover:scale-110 group-hover:bg-violet-500/15 sm:size-16 sm:rounded-3xl">
                <img
                  src={tech.icon}
                  alt={tech.name}
                  loading="lazy"
                  decoding="async"
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
}

function SeeMoreButton({
  isExpanded,
  hiddenCount,
  onClick,
  expandedLabel = "Show Less",
}) {
  const Icon = isExpanded ? ChevronUp : ChevronDown;

  return (
    <div className="mt-8 flex justify-center sm:mt-10">
      <button
        type="button"
        onClick={onClick}
        aria-expanded={isExpanded}
        className="see-more-button group relative inline-flex min-h-[52px] w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border border-violet-300/25 bg-white/[0.06] px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-white shadow-xl shadow-blue-950/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-violet-200/45 hover:bg-violet-500/14 hover:shadow-violet-500/20 sm:min-h-14 sm:w-auto sm:px-7 sm:text-sm sm:tracking-[0.18em]"
      >
        <span className="see-more-button-glow" />

        <span className="relative z-10">
          {isExpanded ? expandedLabel : `See More ${hiddenCount}`}
        </span>

        <span className="relative z-10 flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] text-violet-100 transition duration-300 group-hover:scale-110 group-hover:bg-violet-500/20 sm:size-9">
          <Icon className="size-4 transition duration-300 group-hover:translate-y-0.5" />
        </span>
      </button>
    </div>
  );
}

function ProjectsPanel({ projects }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  const visibleItemsLimit = isMobile
    ? MOBILE_VISIBLE_ITEMS_LIMIT
    : DESKTOP_VISIBLE_ITEMS_LIMIT;

  useEffect(() => {
    setIsExpanded(false);
  }, [isMobile]);

  if (!projects?.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-center text-sm text-blue-100/65 sm:p-8 sm:text-base">
        Belum ada project yang ditampilkan.
      </div>
    );
  }

  const shouldShowButton = projects.length > visibleItemsLimit;

  const visibleProjects = isExpanded
    ? projects
    : projects.slice(0, visibleItemsLimit);

  const hiddenProjectsCount = Math.max(projects.length - visibleItemsLimit, 0);

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
        {visibleProjects.map((project, index) => (
          <RevealOnScroll key={project.id ?? project.title} delay={index * 70}>
            <ProjectCard project={project} />
          </RevealOnScroll>
        ))}
      </div>

      {shouldShowButton && (
        <SeeMoreButton
          isExpanded={isExpanded}
          hiddenCount={hiddenProjectsCount}
          onClick={() => setIsExpanded((current) => !current)}
          expandedLabel="Show Less"
        />
      )}
    </div>
  );
}

function CertificatesPanel({ certificates }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  const visibleItemsLimit = isMobile
    ? MOBILE_VISIBLE_ITEMS_LIMIT
    : DESKTOP_VISIBLE_ITEMS_LIMIT;

  useEffect(() => {
    setIsExpanded(false);
  }, [isMobile]);

  if (!certificates?.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-center text-sm text-blue-100/65 sm:p-8 sm:text-base">
        Belum ada sertifikat yang ditampilkan.
      </div>
    );
  }

  const shouldShowButton = certificates.length > visibleItemsLimit;

  const visibleCertificates = isExpanded
    ? certificates
    : certificates.slice(0, visibleItemsLimit);

  const hiddenCertificatesCount = Math.max(
    certificates.length - visibleItemsLimit,
    0,
  );

  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
        {visibleCertificates.map((certificate, index) => (
          <RevealOnScroll
            key={certificate.id ?? certificate.title ?? certificate.img}
            delay={index * 70}
          >
            <CertificateCard certificate={certificate} />
          </RevealOnScroll>
        ))}
      </div>

      {shouldShowButton && (
        <SeeMoreButton
          isExpanded={isExpanded}
          hiddenCount={hiddenCertificatesCount}
          onClick={() => setIsExpanded((current) => !current)}
          expandedLabel="Show Less"
        />
      )}
    </div>
  );
}

export function PortfolioShowcaseSection({ projects = [], certificates = [] }) {
  const [activeTab, setActiveTab] = useState("projects");

  useEffect(() => {
    try {
      sessionStorage.removeItem(PROJECT_RETURN_STORAGE_KEY);
    } catch {}
  }, []);

  return (
    <section id="projects" className="border-t border-white/10 py-20 md:py-24">
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
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
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

        <div className="mt-8 sm:mt-10">
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
