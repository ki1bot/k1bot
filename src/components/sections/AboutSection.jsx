import { Code2, Database, LayoutDashboard } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { ProfileSummaryCard } from "@/components/cards/ProfileSummaryCard";

const skills = [
  {
    icon: LayoutDashboard,
    title: "Frontend Development",
    description:
      "Mengembangkan antarmuka website yang responsif, modern, dan mudah digunakan dengan React, Next.js, Tailwind CSS, dan lain lainnya.",
  },
  {
    icon: Database,
    title: "Database Integration",
    description:
      "Mengintegrasikan aplikasi dengan database untuk menyimpan, mengelola, dan menampilkan data proyek, sertifikat, komentar, serta data pendukung lainnya.",
  },
  {
    icon: Code2,
    title: "Clean Code Structure",
    description:
      "Menata struktur folder, komponen, dan kode secara terorganisir agar mudah dipahami, dipelihara, dan dikembangkan.",
  },
];

export function AboutSection({ projects = [], certificates = [] }) {
  return (
    <section
      id="about"
      className="border-t border-white/10 py-20 md:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 md:px-10">
        <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-24 xl:gap-36">
          <div>
            <RevealOnScroll>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-100/70 sm:text-sm sm:tracking-[0.35em]">
                About Me
              </p>

              <h2 className="mt-5 max-w-3xl text-3xl font-black leading-[1.12] tracking-tight text-white sm:text-4xl md:mt-6 md:text-5xl lg:text-6xl">
                Saya membangun website dengan tampilan yang rapi, responsif, dan
                nyaman digunakan di berbagai perangkat.
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-8 text-blue-100/72 md:mt-8 md:text-lg">
                Saya adalah mahasiswa Sistem Informasi yang berfokus pada
                pengembangan website modern. Saya menggunakan React, Next.js,
                Tailwind CSS, dan frameword lainnya untuk membangun antarmuka
                yang responsif, mengelola data aplikasi, serta menghadirkan
                pengalaman pengguna yang nyaman di berbagai perangkat. Saya juga
                memperhatikan struktur kode agar tetap rapi, mudah dipahami, dan
                mudah dikembangkan.
              </p>
            </RevealOnScroll>

            <div className="mt-10 grid gap-4 md:mt-14 md:gap-6">
              {skills.map((skill, index) => {
                const Icon = skill.icon;

                return (
                  <RevealOnScroll key={skill.title} delay={index * 120}>
                    <Card className="group border-white/10 bg-white/[0.08] hover:-translate-y-2 hover:border-violet-300/25 hover:bg-white/[0.1] hover:shadow-violet-500/15">
                      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:gap-6 md:p-7">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-violet-500/12 text-violet-200 transition group-hover:scale-110 group-hover:bg-violet-500/20 sm:size-14">
                          <Icon className="size-5 sm:size-6" />
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-white sm:text-xl">
                            {skill.title}
                          </h3>

                          <p className="mt-3 max-w-xl text-sm leading-7 text-blue-100/65 md:text-base">
                            {skill.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>

          <RevealOnScroll delay={160} y={20} scale={0.97}>
            <div className="mx-auto w-full max-w-[560px] lg:translate-x-6 xl:translate-x-12">
              <ProfileSummaryCard
                projectsCount={projects.length}
                certificatesCount={certificates.length}
              />
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
