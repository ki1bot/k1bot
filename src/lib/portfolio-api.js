import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  FALLBACK_CERTIFICATES,
  FALLBACK_COMMENTS,
  FALLBACK_PROJECTS,
} from "@/lib/constants";

export async function getProjects() {
  if (!isSupabaseConfigured || !supabase) {
    return FALLBACK_PROJECTS;
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, title, description, img, link, github, features, tech_stack, order_index, created_at",
    )
    .eq("is_published", true)
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch projects:", error.message);
    return FALLBACK_PROJECTS;
  }

  return data?.length ? data : FALLBACK_PROJECTS;
}

export async function getCertificates() {
  if (!isSupabaseConfigured || !supabase) {
    return FALLBACK_CERTIFICATES;
  }

  const { data, error } = await supabase
    .from("certificates")
    .select("id, title, img, type, order_index, created_at")
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch certificates:", error.message);
    return FALLBACK_CERTIFICATES;
  }

  return data?.length ? data : FALLBACK_CERTIFICATES;
}

export async function getComments() {
  if (!isSupabaseConfigured || !supabase) {
    return FALLBACK_COMMENTS;
  }

  const { data, error } = await supabase
    .from("portfolio_comments")
    .select("id, content, user_name, profile_image, is_pinned, created_at")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch comments:", error.message);
    return FALLBACK_COMMENTS;
  }

  return data?.length ? data : FALLBACK_COMMENTS;
}

export async function getPortfolioData() {
  const [projects, certificates, comments] = await Promise.all([
    getProjects(),
    getCertificates(),
    getComments(),
  ]);

  return {
    projects,
    certificates,
    comments,
  };
}
