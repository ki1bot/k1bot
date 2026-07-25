"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ExternalLink, FileText, FolderKanban, MapPin } from "lucide-react";

import { PERSONAL_INFO, TECH_STACK } from "@/lib/constants";
import { assetUrl } from "@/lib/supabase-storage";

const CV_DRIVE_URL =
  "https://drive.google.com/drive/folders/1SmhgvKkpRICHDnnvEH3dTHS-72bmsp16?usp=sharing";

const GITHUB_USERNAME = "ki1bot";
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;
const GITHUB_CONTRIBUTIONS_URL = `https://ghchart.rshah.org/8b5cf6/${GITHUB_USERNAME}`;
const GITHUB_ICON = assetUrl("media/github.png");

const STATIC_GITHUB_CONTRIBUTIONS = 417;
const GITHUB_REFRESH_INTERVAL = 300000;

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
    <div className="relative mx-auto w-full max-w-[580px]">
      <div className="pointer-events-none absolute -inset-4 rounded-[2.4rem] bg-gradient-to-br from-violet-600/35 via-blue-500/15 to-fuchsia-500/25 opacity-80 blur-3xl sm:-inset-7 sm:rounded-[3.4rem]" />

      <div className="relative rounded-[2rem] bg-gradient-to-br from-violet-300/40 via-white/10 to-blue-400/30 p-px shadow-[0_35px_100px_rgba(30,27,75,0.55)] sm:rounded-[2.8rem]">
        <div className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-[#11142d]/95 p-2.5 backdrop-blur-2xl sm:rounded-[calc(2.8rem-1px)] sm:p-4">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(139,92,246,0.25),transparent_30%),radial-gradient(circle_at_100%_25%,rgba(59,130,246,0.18),transparent_32%),radial-gradient(circle_at_45%_100%,rgba(217,70,239,0.12),transparent_38%)]" />

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:42px_42px] opacity-35" />

          <div className="relative overflow-hidden rounded-[1.55rem] border border-white/10 bg-white/[0.035] sm:rounded-[2.2rem]">
            <div className="relative overflow-hidden px-5 pb-8 pt-7 sm:px-8 sm:pb-10 sm:pt-9">
              <div className="pointer-events-none absolute left-1/2 top-0 h-44 w-80 -translate-x-1/2 rounded-full bg-violet-500/15 blur-3xl sm:h-56 sm:w-[430px]" />

              <div className="relative mx-auto flex size-[190px] items-center justify-center sm:size-[230px]">
                <div className="absolute inset-0 rounded-full border border-violet-300/15" />

                <div className="absolute inset-[15px] rounded-full border border-blue-300/15" />

                <div className="absolute inset-[30px] rounded-full border border-violet-200/15" />

                <div className="absolute inset-[45px] rounded-full border border-blue-200/15" />

                <div className="absolute left-[5px] top-[105px] size-3.5 rounded-full bg-blue-300 shadow-[0_0_22px_rgba(147,197,253,0.95)] sm:left-[7px] sm:top-[126px] sm:size-4" />

                <div className="absolute right-[17px] top-[31px] size-4 rounded-full bg-cyan-300 shadow-[0_0_24px_rgba(103,232,249,0.95)] sm:right-[22px] sm:top-[38px] sm:size-[18px]" />

                <div className="absolute right-[36px] bottom-[23px] size-2 rounded-full bg-fuchsia-300/80 shadow-[0_0_16px_rgba(240,171,252,0.85)] sm:right-[45px] sm:bottom-[30px] sm:size-2.5" />

                <div className="relative size-[118px] rounded-full bg-gradient-to-br from-violet-300/55 via-blue-300/30 to-fuchsia-300/45 p-px shadow-[0_22px_55px_rgba(59,130,246,0.3)] sm:size-[144px]">
                  <div className="h-full w-full rounded-full bg-[#080a18] p-1.5 sm:p-2">
                    <div className="relative h-full w-full overflow-hidden rounded-full bg-slate-950">
                      <Image
                        src={PERSONAL_INFO.profileImage}
                        alt={PERSONAL_INFO.name}
                        fill
                        sizes="(max-width: 639px) 104px, 128px"
                        loading="lazy"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative mt-6 text-center sm:mt-8">
                <h2 className="bg-gradient-to-r from-white via-blue-100 to-violet-200 bg-clip-text text-3xl font-black leading-tight tracking-tight text-transparent sm:text-4xl md:text-[2.6rem]">
                  {PERSONAL_INFO.name}
                </h2>

                <p className="mx-auto mt-3 max-w-md text-lg font-extrabold leading-snug tracking-[-0.03em] text-blue-100 sm:mt-4 sm:text-2xl">
                  {PERSONAL_INFO.role}
                </p>

                <div className="mt-5 flex items-center justify-center gap-2 text-blue-100/60 sm:mt-6">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-violet-300/15 bg-violet-500/10">
                    <MapPin className="size-3.5 text-violet-300" />
                  </div>

                  <p className="text-xs leading-6 min-[390px]:text-sm sm:text-base">
                    {PERSONAL_INFO.location}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative border-t border-white/10 px-4 py-5 sm:px-7 sm:py-7">
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="group relative overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-white/15 via-white/[0.06] to-violet-500/10 p-px shadow-[0_16px_35px_rgba(2,6,23,0.18)] transition duration-300 hover:-translate-y-1.5 sm:rounded-[1.55rem]"
                  >
                    <div className="relative h-full rounded-[calc(1.25rem-1px)] border border-white/5 bg-[#252847]/85 px-2 py-4 text-center backdrop-blur-xl transition duration-300 group-hover:border-violet-300/20 group-hover:bg-[#2c3053]/90 sm:rounded-[calc(1.55rem-1px)] sm:px-4 sm:py-5">
                      <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-violet-200/70 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

                      <p className="bg-gradient-to-b from-white to-blue-200 bg-clip-text text-2xl font-black leading-none text-transparent sm:text-3xl">
                        {stat.value}
                      </p>

                      <p className="mt-2 text-[10px] font-medium leading-4 text-blue-100/55 min-[390px]:text-[11px] sm:text-sm">
                        {stat.label}
                      </p>

                      <div
                        className={`mx-auto mt-3 h-1 w-8 rounded-full ${
                          index === 0
                            ? "bg-blue-400/65"
                            : index === 1
                              ? "bg-violet-400/65"
                              : "bg-fuchsia-400/65"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[1.4rem] bg-gradient-to-br from-violet-300/20 via-white/10 to-blue-300/15 p-px shadow-[0_20px_45px_rgba(2,6,23,0.22)] sm:mt-6 sm:rounded-[1.8rem]">
                <div className="overflow-hidden rounded-[calc(1.4rem-1px)] bg-[#1a1d39]/95 sm:rounded-[calc(1.8rem-1px)]">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-5 sm:py-5">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative flex size-10 shrink-0 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-500/10 shadow-lg shadow-violet-950/30 sm:size-11">
                        <div className="absolute inset-0 rounded-xl bg-violet-400/10 blur-md" />

                        <Image
                          src={GITHUB_ICON}
                          alt="GitHub"
                          width={22}
                          height={22}
                          sizes="22px"
                          className="relative size-5 object-contain sm:size-[22px]"
                        />
                      </div>

                      <p className="truncate text-sm font-extrabold text-blue-100 sm:text-base">
                        GitHub Contributions
                      </p>
                    </div>

                    <a
                      href={GITHUB_PROFILE_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="group/github inline-flex shrink-0 items-center gap-1.5 rounded-full border border-violet-300/10 bg-violet-500/10 px-3 py-1.5 text-[11px] font-bold text-violet-200 transition duration-300 hover:border-violet-300/25 hover:bg-violet-500/20 hover:text-white sm:text-xs"
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
                    className="group/contributions block"
                  >
                    <div className="relative overflow-hidden bg-[#f6f8fa] px-3 py-4 sm:px-5 sm:py-5">
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-100/20 via-transparent to-blue-100/20" />

                      <div
                        role="img"
                        aria-label={`Grafik kontribusi GitHub ${GITHUB_USERNAME}`}
                        className="relative aspect-[663/104] w-full bg-contain bg-center bg-no-repeat transition duration-500 group-hover/contributions:scale-[1.018]"
                        style={{
                          backgroundImage: `url("${GITHUB_CONTRIBUTIONS_URL}")`,
                        }}
                      />
                    </div>

                    <div className="flex flex-col gap-3 border-t border-white/10 bg-white/[0.025] px-4 py-3.5 min-[430px]:flex-row min-[430px]:items-center min-[430px]:justify-between sm:px-5">
                      <span className="text-[11px] font-medium text-blue-100/60 sm:text-xs">
                        {contributionText}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-medium text-blue-100/55 sm:text-[11px]">
                          Less
                        </span>

                        <div className="flex items-center gap-1">
                          <span className="size-3 rounded-[3px] bg-[#ebedf0]" />
                          <span className="size-3 rounded-[3px] bg-[#ddd6fe]" />
                          <span className="size-3 rounded-[3px] bg-[#a78bfa]" />
                          <span className="size-3 rounded-[3px] bg-[#7c3aed]" />
                          <span className="size-3 rounded-[3px] bg-[#4c1d95]" />
                        </div>

                        <span className="text-[10px] font-medium text-blue-100/55 sm:text-[11px]">
                          More
                        </span>
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4">
                <a
                  href={CV_DRIVE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative inline-flex min-h-[54px] items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-5 py-3 text-center text-sm font-extrabold text-white shadow-[0_15px_35px_rgba(124,58,237,0.3)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(124,58,237,0.42)] sm:min-h-14 sm:text-base"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition duration-500 group-hover:opacity-100" />

                  <FileText className="relative size-5 stroke-[2.4] transition duration-300 group-hover:-translate-y-0.5" />

                  <span className="relative">Download CV</span>
                </a>

                <a
                  href="/projects"
                  onClick={handleViewProjectsClick}
                  className="group relative inline-flex min-h-[54px] items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-white/15 bg-white/[0.06] px-5 py-3 text-center text-sm font-extrabold text-white shadow-[0_15px_35px_rgba(2,6,23,0.2)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-violet-300/30 hover:bg-white/[0.1] hover:shadow-[0_20px_45px_rgba(76,29,149,0.2)] sm:min-h-14 sm:text-base"
                >
                  <span className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-violet-200/70 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

                  <FolderKanban className="relative size-5 stroke-[2.4] transition duration-300 group-hover:-translate-y-0.5" />

                  <span className="relative">View Projects</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
