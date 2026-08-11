import { getProjects } from "@/lib/portfolio-api";
import { createProjectSlug } from "@/lib/project-slug";

const baseUrl = "https://www.rifqii.com";

export const revalidate = 3600;

export default async function sitemap() {
  const projects = await getProjects();
  const now = new Date();

  const projectEntries = projects
    .filter((project) => project?.id != null && project?.title)
    .map((project) => {
      const projectId = encodeURIComponent(String(project.id));
      const projectSlug = encodeURIComponent(createProjectSlug(project.title));

      return {
        url: `${baseUrl}/project?id=${projectId}&slug=${projectSlug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
      };
    });

  return [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...projectEntries,
  ];
}
