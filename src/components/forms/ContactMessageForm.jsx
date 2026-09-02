"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2, Mail, MessageSquareText, Send, User } from "lucide-react";

import { Button } from "@/components/ui/button";

const fieldClassName =
  "w-full rounded-xl border border-white/15 bg-white/[0.07] text-sm font-medium text-white caret-white outline-none transition placeholder:text-blue-100/40 focus:border-violet-300/40 focus:bg-white/[0.1] autofill:border-white/15 autofill:shadow-[0_0_0_1000px_rgba(255,255,255,0.07)_inset] autofill:[-webkit-text-fill-color:white] autofill:caret-white autofill:transition-[background-color] autofill:duration-[999999s]";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function createSubmission(fingerprint) {
  return {
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    fingerprint,
  };
}

function getFormValue(formData, name) {
  return String(formData.get(name) || "").trim();
}

export function ContactMessageForm() {
  const [toast, setToast] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toastTimerRef = useRef(null);
  const submissionRef = useRef(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  function showToast(message, type = "success") {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    setToast({
      message,
      type,
    });

    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 3000);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const formElement = event.currentTarget;

    const formData = new FormData(formElement);

    const name = getFormValue(formData, "name");

    const email = getFormValue(formData, "email");

    const message = getFormValue(formData, "message");

    if (!name || !email || !message) {
      showToast("Nama, email, dan pesan wajib diisi.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showToast("Format email tidak valid.", "error");
      return;
    }

    if (name.length > 100) {
      showToast("Nama terlalu panjang. Maksimal 100 karakter.", "error");
      return;
    }

    if (email.length > 254) {
      showToast("Email terlalu panjang. Maksimal 254 karakter.", "error");
      return;
    }

    if (message.length > 3000) {
      showToast("Pesan terlalu panjang. Maksimal 3000 karakter.", "error");
      return;
    }

    const fingerprint = JSON.stringify([name, email.toLowerCase(), message]);

    if (
      !submissionRef.current ||
      submissionRef.current.fingerprint !== fingerprint
    ) {
      submissionRef.current = createSubmission(fingerprint);
    }

    const submission = submissionRef.current;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          submissionId: submission.id,
          submittedAt: submission.submittedAt,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message || "Pesan gagal dikirim. Silakan coba lagi nanti.",
        );
      }

      formElement.reset();

      submissionRef.current = null;

      showToast(result?.message || "Pesan berhasil dikirim.", "success");
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Pesan gagal dikirim. Silakan coba lagi nanti.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const toastElement =
    toast && typeof document !== "undefined"
      ? createPortal(
          <div
            role={toast.type === "error" ? "alert" : "status"}
            aria-live={toast.type === "error" ? "assertive" : "polite"}
            className={`pointer-events-none fixed left-1/2 top-5 z-[9999] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center justify-center rounded-xl border px-5 py-3.5 text-center text-sm font-medium shadow-2xl backdrop-blur-xl ${
              toast.type === "error"
                ? "border-red-300/20 bg-[#351b27]/95 text-red-100"
                : "border-emerald-300/20 bg-[#142b2a]/95 text-emerald-100"
            }`}
          >
            <span className="w-full text-center">{toast.message}</span>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      {toastElement}

      <form
        onSubmit={handleSubmit}
        autoComplete="on"
        noValidate
        className="relative space-y-4"
      >
        <div className="relative">
          <label htmlFor="contact-name" className="sr-only">
            Nama
          </label>

          <User className="pointer-events-none absolute left-4 top-1/2 z-10 size-4 -translate-y-1/2 text-blue-100/40" />

          <input
            id="contact-name"
            type="text"
            name="name"
            placeholder="Nama Anda"
            autoComplete="section-contact name"
            autoCapitalize="words"
            maxLength={100}
            required
            className={`${fieldClassName} h-12 pl-11 pr-4 sm:h-14`}
          />
        </div>

        <div className="relative">
          <label htmlFor="contact-email" className="sr-only">
            Email
          </label>

          <Mail className="pointer-events-none absolute left-4 top-1/2 z-10 size-4 -translate-y-1/2 text-blue-100/40" />

          <input
            id="contact-email"
            type="email"
            name="email"
            placeholder="Email Anda"
            autoComplete="section-contact email"
            inputMode="email"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={254}
            required
            className={`${fieldClassName} h-12 pl-11 pr-4 sm:h-14`}
          />
        </div>

        <div className="relative">
          <label htmlFor="contact-message" className="sr-only">
            Pesan
          </label>

          <MessageSquareText className="pointer-events-none absolute left-4 top-4 z-10 size-4 text-blue-100/40" />

          <textarea
            id="contact-message"
            name="message"
            placeholder="Pesan Anda"
            autoComplete="off"
            rows={5}
            maxLength={3000}
            required
            className={`${fieldClassName} min-h-[120px] resize-none py-4 pl-11 pr-4`}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-sm font-bold text-white shadow-xl shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:h-14"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Mengirim...
            </>
          ) : (
            <>
              <Send className="size-4" />
              Kirim Pesan
            </>
          )}
        </Button>
      </form>
    </>
  );
}
