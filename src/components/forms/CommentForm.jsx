"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageSquare, Send, User } from "lucide-react";

import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export function CommentForm() {
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");

  const isFormValid = useMemo(() => {
    return userName.trim().length > 0 && content.trim().length > 0;
  }, [userName, content]);

  function resetStatus() {
    setStatusMessage("");
    setStatusType("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    resetStatus();

    if (!isFormValid) {
      setStatusType("error");
      setStatusMessage("Nama dan komentar wajib diisi.");
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setStatusType("error");
      setStatusMessage("Supabase belum dikonfigurasi dengan benar.");
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase.from("portfolio_comments").insert({
        user_name: userName.trim(),
        content: content.trim(),
        profile_image: null,
        is_pinned: false,
      });

      if (error) {
        throw new Error(error.message);
      }

      setUserName("");
      setContent("");

      setStatusType("success");
      setStatusMessage("Komentar berhasil dikirim.");

      router.refresh();
    } catch (error) {
      setStatusType("error");
      setStatusMessage(
        error.message || "Gagal mengirim komentar. Coba lagi nanti.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      <div>
        <label className="mb-2 block text-sm font-semibold text-blue-100/80">
          Name
        </label>

        <div className="relative">
          <User className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-blue-100/45 sm:left-5" />

          <input
            type="text"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            placeholder="Enter your name"
            maxLength={100}
            required
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-blue-100/35 focus:border-violet-300/35 focus:bg-white/[0.09] sm:h-14 sm:pl-12 sm:pr-5"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-blue-100/80">
          Message
        </label>

        <div className="relative">
          <MessageSquare className="pointer-events-none absolute left-4 top-5 size-4 text-blue-100/45 sm:left-5" />

          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write your message here..."
            rows={4}
            maxLength={1000}
            required
            className="min-h-[116px] w-full resize-y rounded-2xl border border-white/10 bg-white/[0.06] py-4 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-blue-100/35 focus:border-violet-300/35 focus:bg-white/[0.09] sm:min-h-[120px] sm:pl-12 sm:pr-5"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-xs leading-5 text-blue-100/50">
        Komentar akan menggunakan avatar default.
      </div>

      {statusMessage ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${
            statusType === "success"
              ? "border-emerald-300/20 bg-emerald-500/10 text-emerald-100"
              : "border-red-300/20 bg-red-500/10 text-red-100"
          }`}
        >
          {statusMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting || !isFormValid}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-sm font-bold text-white shadow-xl shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:h-14"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="size-4" />
            Post Comment
          </>
        )}
      </button>
    </form>
  );
}