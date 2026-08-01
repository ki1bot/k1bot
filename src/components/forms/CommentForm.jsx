"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageSquare, Send, User } from "lucide-react";

import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

const DEFAULT_PROFILE_IMAGE = "/img/screen/default-avatar.jpg";

export function CommentForm({ messageFieldHeight = null }) {
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");

  const isFormValid = useMemo(() => {
    return userName.trim().length > 0 && content.trim().length > 0;
  }, [userName, content]);

  const messageFieldStyle =
    typeof messageFieldHeight === "number"
      ? {
          height: `${messageFieldHeight}px`,
          minHeight: `${messageFieldHeight}px`,
          maxHeight: `${messageFieldHeight}px`,
        }
      : undefined;

  function resetStatus() {
    setStatusMessage("");
    setStatusType("");
  }

  function handleUserNameChange(event) {
    setUserName(event.target.value);
    resetStatus();
  }

  function handleContentChange(event) {
    setContent(event.target.value);
    resetStatus();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    resetStatus();

    const normalizedUserName = userName.trim();
    const normalizedContent = content.trim();

    if (!normalizedUserName || !normalizedContent) {
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
        user_name: normalizedUserName,
        content: normalizedContent,
        profile_image: DEFAULT_PROFILE_IMAGE,
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
        error instanceof Error
          ? error.message
          : "Gagal mengirim komentar. Coba lagi nanti.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="comment-name" className="sr-only">
          Nama
        </label>

        <div className="relative">
          <User className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-blue-100/45 sm:left-5" />

          <input
            id="comment-name"
            type="text"
            value={userName}
            onChange={handleUserNameChange}
            placeholder="Masukkan nama Anda"
            autoComplete="name"
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-blue-100/35 focus:border-violet-300/35 focus:bg-white/[0.09] sm:h-14 sm:pl-12 sm:pr-5"
          />
        </div>
      </div>

      <div>
        <label htmlFor="comment-message" className="sr-only">
          Pesan
        </label>

        <div className="relative">
          <MessageSquare className="pointer-events-none absolute left-4 top-5 size-4 text-blue-100/45 sm:left-5" />

          <textarea
            id="comment-message"
            value={content}
            onChange={handleContentChange}
            placeholder="Tulis pesan Anda di sini..."
            rows={7}
            style={messageFieldStyle}
            className="min-h-[198px] w-full resize-none rounded-2xl border border-white/10 bg-white/[0.06] py-4 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-blue-100/35 focus:border-violet-300/35 focus:bg-white/[0.09] sm:min-h-[206px] sm:pl-12 sm:pr-5"
          />
        </div>
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
            Mengirim...
          </>
        ) : (
          <>
            <Send className="size-4" />
            Kirim Komentar
          </>
        )}
      </button>
    </form>
  );
}
