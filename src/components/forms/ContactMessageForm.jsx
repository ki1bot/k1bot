"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2, Mail, MessageSquareText, Send, User } from "lucide-react";

import { Button } from "@/components/ui/button";

const initialForm = {
  name: "",
  email: "",
  message: "",
  website: "",
};

const fieldClassName =
  "w-full rounded-xl border border-white/15 bg-white/[0.07] text-sm font-medium text-white caret-white outline-none transition placeholder:text-blue-100/40 focus:border-violet-300/40 focus:bg-white/[0.1] autofill:border-white/15 autofill:shadow-[0_0_0_1000px_rgba(255,255,255,0.07)_inset] autofill:[-webkit-text-fill-color:white] autofill:caret-white autofill:transition-[background-color] autofill:duration-[999999s]";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function createSubmission() {
  return {
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
  };
}

export function ContactMessageForm() {
  const [form, setForm] = useState(initialForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [successToast, setSuccessToast] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const successTimerRef = useRef(null);
  const submissionRef = useRef(null);

  const isFormValid = useMemo(() => {
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    return Boolean(
      name &&
      email &&
      message &&
      name.length <= 100 &&
      email.length <= 254 &&
      message.length <= 3000 &&
      isValidEmail(email),
    );
  }, [form]);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  function showSuccessToast(message) {
    if (successTimerRef.current) {
      window.clearTimeout(successTimerRef.current);
    }

    setSuccessToast(message);

    successTimerRef.current = window.setTimeout(() => {
      setSuccessToast("");
      successTimerRef.current = null;
    }, 3000);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setErrorMessage("");
    submissionRef.current = null;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();
    const website = form.website.trim();

    setErrorMessage("");

    if (!name || !email || !message) {
      setErrorMessage("Nama, email, dan pesan wajib diisi.");
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage("Format email tidak valid.");
      return;
    }

    if (name.length > 100) {
      setErrorMessage("Nama terlalu panjang. Maksimal 100 karakter.");
      return;
    }

    if (email.length > 254) {
      setErrorMessage("Email terlalu panjang. Maksimal 254 karakter.");
      return;
    }

    if (message.length > 3000) {
      setErrorMessage("Pesan terlalu panjang. Maksimal 3000 karakter.");
      return;
    }

    if (!submissionRef.current) {
      submissionRef.current = createSubmission();
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
          website,
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

      setForm(initialForm);
      submissionRef.current = null;

      showSuccessToast(result?.message || "Pesan berhasil dikirim.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Pesan gagal dikirim. Silakan coba lagi nanti.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {successToast && typeof document !== "undefined"
        ? createPortal(
            <div
              role="status"
              aria-live="polite"
              className="pointer-events-none fixed left-1/2 top-5 z-[9999] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-xl border border-emerald-300/20 bg-[#142238]/95 px-5 py-3.5 text-center text-sm font-medium text-emerald-100 shadow-xl backdrop-blur-md"
            >
              {successToast}
            </div>,
            document.body,
          )
        : null}

      <form onSubmit={handleSubmit} className="relative space-y-4">
        <input
          type="text"
          name="website"
          value={form.website}
          onChange={handleChange}
          autoComplete="off"
          tabIndex={-1}
          aria-label="Website"
          className="pointer-events-none absolute -left-[9999px] h-px w-px opacity-0"
        />

        <div className="relative">
          <User className="pointer-events-none absolute left-4 top-1/2 z-10 size-4 -translate-y-1/2 text-blue-100/40" />

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nama Anda"
            autoComplete="name"
            maxLength={100}
            required
            className={`${fieldClassName} h-12 pl-11 pr-4 sm:h-14`}
          />
        </div>

        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 z-10 size-4 -translate-y-1/2 text-blue-100/40" />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Anda"
            autoComplete="email"
            maxLength={254}
            required
            className={`${fieldClassName} h-12 pl-11 pr-4 sm:h-14`}
          />
        </div>

        <div className="relative">
          <MessageSquareText className="pointer-events-none absolute left-4 top-4 z-10 size-4 text-blue-100/40" />

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Pesan Anda"
            rows={5}
            maxLength={3000}
            required
            className={`${fieldClassName} min-h-[120px] resize-none py-4 pl-11 pr-4`}
          />
        </div>

        {errorMessage ? (
          <div
            role="alert"
            aria-live="assertive"
            className="rounded-xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-100"
          >
            {errorMessage}
          </div>
        ) : null}

        <Button
          type="submit"
          disabled={isSubmitting || !isFormValid}
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
