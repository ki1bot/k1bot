"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ExternalLink, FileText, FolderKanban } from "lucide-react";

import { PERSONAL_INFO, TECH_STACK } from "@/lib/constants";
import { assetUrl } from "@/lib/supabase-storage";

const CV_DRIVE_URL =
  "https://drive.google.com/drive/folders/1SmhgvKkpRICHDnnvEH3dTHS-72bmsp16?usp=sharing";

const GITHUB_USERNAME = "ki1bot";
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;
const GITHUB_CONTRIBUTIONS_URL = `https://ghchart.rshah.org/8b5cf6/${GITHUB_USERNAME}`;
const GITHUB_ICON = assetUrl("media/github.png");

const STATIC_GITHUB_CONTRIBUTIONS = 417;
const GITHUB_REFRESH_INTERVAL = 1000;

const CONTRIBUTION_NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

export function ProfileSummaryCard({
  projectsCount = 0,
  certificatesCount = 0,
}) {
  const [totalContributions, setTotalContributions] = useState(
    STATIC_GITHUB_CONTRIBUTIONS,
  );

  useEffect(() => {
    let isMounted = true;
    let activeController = null;

    async function loadGitHubContributions() {
      activeController?.abort();
      activeController = new AbortController();

      try {
        const response = await fetch("/api/github-contributions", {
          signal: activeController.signal,
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (
          isMounted &&
          data.username === GITHUB_USERNAME &&
          Number.isInteger(data.totalContributions)
        ) {
          setTotalContributions(data.totalContributions);
        }
      } catch {}
    }

    loadGitHubContributions();

    const intervalId = window.setInterval(
      loadGitHubContributions,
      GITHUB_REFRESH_INTERVAL,
    );

    return () => {
      isMounted = false;
      activeController?.abort();
      window.clearInterval(intervalId);
    };
  }, []);

  const stats = [
    {
      value: projectsCount,
      label: "Projects",
    },
    {
      value: certificatesCount,
      label: "Certificates",
    },
    {
      value: TECH_STACK.length,
      label: "Tech Stack",
    },
  ];

  const contributionText = `${CONTRIBUTION_NUMBER_FORMATTER.format(
    totalContributions,
  )} contributions in the last year`;

  function handleViewProjectsClick(event) {
    event.preventDefault();

    const projectsSection = document.getElementById("projects");

    if (!projectsSection) {
      window.location.href = "/projects";
      return;
    }

    const navbarOffset = window.innerWidth < 768 ? 84 : 115;

    const projectsPosition =
      projectsSection.getBoundingClientRect().top +
      window.scrollY -
      navbarOffset;

    window.history.pushState(null, "", "/projects");

    window.scrollTo({
      top: Math.max(projectsPosition, 0),
      behavior: "smooth",
    });
  }

  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div className="absolute -inset-4 rounded-[2rem] bg-violet-500/20 blur-2xl sm:-inset-8 sm:rounded-[2.5rem] sm:blur-3xl" />

      <div className="relative rounded-[1.75rem] border border-white/10 bg-white/[0.08] p-3 shadow-2xl shadow-blue-950/30 backdrop-blur-2xl sm:rounded-[2.5rem] sm:p-5">
        <div className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-slate-950/35 px-5 pb-5 pt-10 sm:overflow-visible sm:rounded-[2rem] sm:p-8 md:p-10">
          <div className="relative mx-auto mt-4 flex size-36 items-center justify-center sm:mt-5 sm:size-48 md:mt-6 md:size-56">
            <div className="absolute inset-0 rounded-full border border-blue-200/18 sm:border-blue-200/15" />

            <div className="absolute inset-[-10px] rounded-full border border-blue-300/16 sm:inset-[-18px] sm:border-blue-300/12" />

            <div className="absolute inset-[-20px] rounded-full border border-blue-300/12 sm:inset-[-36px] sm:border-blue-300/10" />

            <div className="absolute right-2 top-4 size-3.5 rounded-full bg-cyan-300 shadow-lg shadow-cyan-300/60 sm:right-3 sm:top-5 sm:size-5" />

            <div className="absolute bottom-7 left-2 size-3 rounded-full bg-blue-300 shadow-lg shadow-blue-300/60 sm:bottom-8 sm:left-2 sm:size-4" />

            <div className="size-24 overflow-hidden rounded-full border border-blue-200/30 bg-blue-950/40 p-1.5 shadow-2xl shadow-blue-500/20 sm:size-32 sm:p-2 md:size-40">
              <div className="relative h-full w-full overflow-hidden rounded-full">
                <Image
                  src={PERSONAL_INFO.profileImage}
                  alt={PERSONAL_INFO.name}
                  fill
                  sizes="(max-width: 639px) 84px, (max-width: 767px) 112px, 144px"
                  loading="lazy"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="mt-12 px-1 text-center sm:mt-14 sm:px-2 md:mt-16">
            <h2 className="text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
              {PERSONAL_INFO.name}
            </h2>

            <p className="mx-auto mt-3 whitespace-nowrap text-[1.15rem] font-black leading-[1.15] tracking-[-0.025em] text-blue-100 min-[390px]:text-[1.3rem] min-[440px]:text-[1.45rem] sm:text-[1.6rem] md:text-[1.75rem]">
              {PERSONAL_INFO.role}
            </p>

            <p className="mt-4 text-sm text-blue-100/65 sm:text-base">
              {PERSONAL_INFO.location}
            </p>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-2 sm:mt-8 sm:gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/10 p-3 text-center backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-violet-300/25 hover:bg-white/[0.14] sm:p-5"
              >
                <p className="text-2xl font-black text-white sm:text-3xl">
                  {stat.value}
                </p>

                <p className="mt-1 text-[11px] leading-4 text-blue-100/60 sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-7 sm:mt-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-500/10">
                  <Image
                    src={GITHUB_ICON}
                    alt="GitHub"
                    width={20}
                    height={20}
                    sizes="20px"
                    className="size-5 object-contain"
                  />
                </div>

                <p className="text-sm font-bold text-blue-100 sm:text-base">
                  GitHub Contributions
                </p>
              </div>

              <a
                href={GITHUB_PROFILE_URL}
                target="_blank"
                rel="noreferrer"
                className="group/github inline-flex items-center gap-1.5 text-xs font-semibold text-violet-300 transition duration-300 hover:text-violet-200 sm:text-sm"
              >
                View on GitHub
                <ExternalLink className="size-3.5 transition duration-300 group-hover/github:-translate-y-0.5 group-hover/github:translate-x-0.5" />
              </a>
            </div>

            <a
              href={GITHUB_PROFILE_URL}
              target="_blank"
              rel="noreferrer"
              aria-label={`Lihat kontribusi GitHub ${GITHUB_USERNAME}`}
              className="group/contributions block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] shadow-xl shadow-blue-950/20 transition duration-300 hover:-translate-y-1 hover:border-violet-300/25 hover:bg-white/[0.09] hover:shadow-violet-500/10"
            >
              <div className="overflow-hidden bg-[#f6f8fa] p-3 sm:p-4">
                <div
                  role="img"
                  aria-label={`Grafik kontribusi GitHub ${GITHUB_USERNAME}`}
                  className="aspect-[663/104] w-full bg-contain bg-center bg-no-repeat transition duration-500 group-hover/contributions:scale-[1.015]"
                  style={{
                    backgroundImage: `url("${GITHUB_CONTRIBUTIONS_URL}")`,
                  }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
                <span className="text-[11px] font-medium text-blue-100/60 sm:text-xs">
                  {contributionText}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-medium text-blue-100/60 sm:text-[11px]">
                    Less
                  </span>

                  <div className="flex items-center gap-1">
                    <span className="size-3 rounded-[3px] bg-[#ebedf0]" />
                    <span className="size-3 rounded-[3px] bg-[#ddd6fe]" />
                    <span className="size-3 rounded-[3px] bg-[#a78bfa]" />
                    <span className="size-3 rounded-[3px] bg-[#7c3aed]" />
                    <span className="size-3 rounded-[3px] bg-[#4c1d95]" />
                  </div>

                  <span className="text-[10px] font-medium text-blue-100/60 sm:text-[11px]">
                    More
                  </span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className="relative mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4">
        <a
          href={CV_DRIVE_URL}
          target="_blank"
          rel="noreferrer"
          className="video-hover-button video-hover-button-primary group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg px-5 py-3 text-center text-sm font-extrabold text-white shadow-xl shadow-violet-500/25 sm:min-h-14 sm:text-base"
        >
          <FileText className="size-5 stroke-[2.4]" />
          <span>Download CV</span>
        </a>

        <a
          href="/projects"
          onClick={handleViewProjectsClick}
          className="video-hover-button video-hover-button-dark group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-center text-sm font-extrabold text-white shadow-xl shadow-blue-950/10 sm:min-h-14 sm:text-base"
        >
          <FolderKanban className="size-5 stroke-[2.4]" />
          <span>View Projects</span>
        </a>
      </div>
    </div>
  );
}
