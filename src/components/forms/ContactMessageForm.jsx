"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2, Mail, MessageSquareText, Send, User } from "lucide-react";

import { Button } from "@/components/ui/button";

const TOAST_DURATION = 3000;
const TOAST_EXIT_DURATION = 250;

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

  const [isToastVisible, setIsToastVisible] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toastTimerRef = useRef(null);
  const toastExitTimerRef = useRef(null);
  const toastAnimationFrameRef = useRef(null);
  const submissionRef = useRef(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }

      if (toastExitTimerRef.current) {
        window.clearTimeout(toastExitTimerRef.current);
      }

      if (toastAnimationFrameRef.current) {
        window.cancelAnimationFrame(toastAnimationFrameRef.current);
      }
    };
  }, []);

  function clearToastTimers() {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);

      toastTimerRef.current = null;
    }

    if (toastExitTimerRef.current) {
      window.clearTimeout(toastExitTimerRef.current);

      toastExitTimerRef.current = null;
    }

    if (toastAnimationFrameRef.current) {
      window.cancelAnimationFrame(toastAnimationFrameRef.current);

      toastAnimationFrameRef.current = null;
    }
  }

  function hideToast() {
    setIsToastVisible(false);

    toastExitTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastExitTimerRef.current = null;
    }, TOAST_EXIT_DURATION);
  }

  function showToast(message, type = "success") {
    clearToastTimers();

    setToast({
      message,
      type,
    });

    setIsToastVisible(false);

    toastAnimationFrameRef.current = window.requestAnimationFrame(() => {
      toastAnimationFrameRef.current = window.requestAnimationFrame(() => {
        setIsToastVisible(true);
        toastAnimationFrameRef.current = null;
      });
    });

    toastTimerRef.current = window.setTimeout(() => {
      toastTimerRef.current = null;
      hideToast();
    }, TOAST_DURATION);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

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
            className="pointer-events-none fixed inset-x-0 z-[9999] flex justify-center px-4 sm:px-6"
            style={{
              top: "max(1rem, env(safe-area-inset-top))",
            }}
          >
            <div
              role={toast.type === "error" ? "alert" : "status"}
              aria-live={toast.type === "error" ? "assertive" : "polite"}
              aria-atomic="true"
              className={`pointer-events-auto flex min-h-11 w-full max-w-[calc(100vw-2rem)] items-center justify-center rounded-xl border px-4 py-3 text-center text-[13px] font-medium leading-5 shadow-lg backdrop-blur-xl transition-all duration-200 ease-out sm:min-h-12 sm:w-auto sm:max-w-[440px] sm:px-6 sm:py-3.5 sm:text-sm ${
                toast.type === "error"
                  ? "border-red-300/20 bg-[#26171d]/95 text-red-100 shadow-black/20"
                  : "border-emerald-300/20 bg-[#14211f]/95 text-emerald-100 shadow-black/20"
              } ${
                isToastVisible
                  ? "translate-y-0 scale-100 opacity-100"
                  : "-translate-y-2 scale-[0.98] opacity-0"
              }`}
            >
              <span className="block w-full text-center break-words">
                {toast.message}
              </span>
            </div>
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
