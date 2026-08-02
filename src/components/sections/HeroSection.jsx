import Image from "next/image";
import { ExternalLink, Mail, Sparkles } from "lucide-react";

import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { HeroInteractiveImage } from "@/components/sections/HeroInteractiveImage";
import { HeroTypewriter } from "@/components/sections/HeroTypewriter";
import { PERSONAL_INFO } from "@/lib/constants";
import { assetUrl } from "@/lib/supabase-storage";

const heroStacks = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.JS",
  "Vue.JS",
  "Node.JS",
  "Bootstrap",
  "Tailwind CSS",
];

const heroSocials = [
  {
    title: "GitHub",
    href: PERSONAL_INFO.github,
    image: assetUrl("media/github.png"),
  },
  {
    title: "LinkedIn",
    href: PERSONAL_INFO.linkedin,
    image: assetUrl("media/linkedin.png"),
  },
  {
    title: "Instagram",
    href: PERSONAL_INFO.instagram,
    image: assetUrl("media/instagram.png"),
  },
];

const HERO_GIF_SOURCE = assetUrl("projects/coding.gif");

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_38%,rgba(124,58,237,0.18),transparent_28%),radial-gradient(circle_at_82%_38%,rgba(14,165,233,0.1),transparent_30%)] md:bg-[radial-gradient(circle_at_18%_38%,rgba(124,58,237,0.22),transparent_28%),radial-gradient(circle_at_82%_38%,rgba(14,165,233,0.14),transparent_30%)]" />

      <div className="mx-auto grid min-h-screen max-w-[1320px] items-center gap-10 px-4 pb-20 pt-28 sm:px-6 sm:pt-32 md:px-10 md:pb-28 md:pt-44 lg:grid-cols-[0.9fr_1.1fr] lg:gap-28 lg:pt-56 xl:gap-48">
        <RevealOnScroll
          className="order-1 opacity-100"
          y={28}
          scale={0.99}
          eager
          once
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-2 text-xs font-medium text-violet-200 shadow-lg shadow-violet-500/10 backdrop-blur-xl sm:px-4 sm:text-sm">
            <Sparkles className="size-4 text-blue-300" />
            Ready to Innovate
          </div>

          <h1 className="mt-7 max-w-2xl text-[2.75rem] font-black leading-[1.03] tracking-tight text-white min-[390px]:text-5xl sm:text-6xl md:mt-10 md:text-7xl">
            Software{" "}
            <span className="-mb-[0.12em] block bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text pb-[0.12em] leading-[1.12] text-transparent">
              Engineer
            </span>
          </h1>

          <HeroTypewriter />

          <p className="mt-6 max-w-xl text-base leading-8 text-blue-100/75 sm:text-lg md:mt-8">
            Saya membangun website yang modern, fungsional, dan mudah digunakan
            untuk menjawab berbagai kebutuhan digital.
          </p>

          <div className="mt-7 flex flex-wrap gap-3 md:mt-9 md:gap-4">
            {heroStacks.map((stack) => (
              <span
                key={stack}
                className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-medium text-blue-100/85 shadow-lg shadow-blue-950/10 backdrop-blur-xl sm:text-sm"
              >
                {stack}
              </span>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:flex sm:flex-row sm:gap-4 md:mt-10">
            <a
              href="/projects"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-violet-400/20 bg-slate-950/80 px-6 text-sm font-semibold text-white shadow-xl shadow-violet-950/30 transition hover:-translate-y-1 hover:border-violet-300/40 hover:bg-violet-600/20 sm:w-auto sm:min-w-40"
            >
              Projects
              <ExternalLink className="size-4" />
            </a>

            <a
              href="/contact"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-violet-400/20 bg-slate-950/80 px-6 text-sm font-semibold text-white shadow-xl shadow-violet-950/30 transition hover:-translate-y-1 hover:border-violet-300/40 hover:bg-violet-600/20 sm:w-auto sm:min-w-40"
            >
              Contact
              <Mail className="size-4" />
            </a>
          </div>

          <div className="mt-10 flex items-center gap-4 sm:gap-6 md:mt-12 md:gap-7">
            {heroSocials.map((social) => (
              <a
                key={social.title}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.title}
                className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] p-3 shadow-lg shadow-violet-950/20 backdrop-blur-xl transition hover:-translate-y-1 hover:border-violet-300/25 hover:bg-violet-500/10 sm:size-12"
              >
                <Image
                  src={social.image}
                  alt={social.title}
                  width={32}
                  height={32}
                  sizes="32px"
                  loading="eager"
                  className="h-full w-full object-contain"
                  draggable={false}
                />
              </a>
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll
          className="order-2 block lg:translate-x-16 xl:translate-x-20"
          delay={120}
          y={28}
          scale={0.99}
          eager
          once
        >
          <HeroInteractiveImage source={HERO_GIF_SOURCE} />
        </RevealOnScroll>
      </div>
    </section>
  );
}
