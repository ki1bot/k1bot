import { NextResponse } from "next/server";

import { buildContactEmail } from "@/lib/email/contact-email-template";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MAX_SUBMISSION_AGE_MS = 24 * 60 * 60 * 1000;

const rateLimitStore = globalThis.__portfolioContactRateLimitStore || new Map();

globalThis.__portfolioContactRateLimitStore = rateLimitStore;

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidSubmissionId(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function cleanEmailHeader(value) {
  return String(value || "")
    .replace(/[\r\n]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "";
  }

  return request.headers.get("x-real-ip")?.trim() || "";
}

function checkRateLimit(ip) {
  if (!ip) {
    return {
      allowed: true,
      retryAfter: 0,
    };
  }

  const now = Date.now();

  if (rateLimitStore.size > 500) {
    for (const [storedIp, data] of rateLimitStore.entries()) {
      if (data.resetAt <= now) {
        rateLimitStore.delete(storedIp);
      }
    }
  }

  const current = rateLimitStore.get(ip);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });

    return {
      allowed: true,
      retryAfter: 0,
    };
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  rateLimitStore.set(ip, current);

  return {
    allowed: true,
    retryAfter: 0,
  };
}

function jsonError(message, status, headers = {}) {
  return NextResponse.json(
    {
      message,
    },
    {
      status,
      headers,
    },
  );
}

function parseSubmittedAt(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const now = Date.now();
  const submittedTime = date.getTime();

  if (
    submittedTime > now + 5 * 60 * 1000 ||
    now - submittedTime > MAX_SUBMISSION_AGE_MS
  ) {
    return null;
  }

  return date;
}

function formatReceivedAt(date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

function getEmailConfig() {
  const resendApiKey = process.env.RESEND_API_KEY?.trim() || "";

  const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL?.trim() || "";

  const senderEmail = process.env.CONTACT_SENDER_EMAIL?.trim() || "";

  const senderName =
    cleanEmailHeader(process.env.CONTACT_SENDER_NAME || "Rifqi Portfolio") ||
    "Rifqi Portfolio";

  const missing = [];

  if (!resendApiKey) {
    missing.push("RESEND_API_KEY");
  }

  if (!receiverEmail) {
    missing.push("CONTACT_RECEIVER_EMAIL");
  }

  if (!senderEmail) {
    missing.push("CONTACT_SENDER_EMAIL");
  }

  return {
    resendApiKey,
    receiverEmail,
    senderEmail,
    senderName,
    missing,
  };
}

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (!contentType.toLowerCase().includes("application/json")) {
      return jsonError("Format permintaan tidak didukung.", 415);
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return jsonError("Data permintaan tidak valid.", 400);
    }

    const name = String(body.name || "").trim();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const message = String(body.message || "").trim();
    const website = String(body.website || "").trim();
    const submissionId = String(body.submissionId || "").trim();
    const submittedAt = String(body.submittedAt || "").trim();

    if (website) {
      return NextResponse.json(
        {
          message: "Pesan berhasil dikirim.",
        },
        {
          status: 200,
        },
      );
    }

    if (!name || !email || !message) {
      return jsonError("Nama, email, dan pesan wajib diisi.", 400);
    }

    if (!isValidEmail(email)) {
      return jsonError("Format email tidak valid.", 400);
    }

    if (name.length > 100) {
      return jsonError("Nama terlalu panjang. Maksimal 100 karakter.", 400);
    }

    if (email.length > 254) {
      return jsonError("Email terlalu panjang. Maksimal 254 karakter.", 400);
    }

    if (message.length > 3000) {
      return jsonError("Pesan terlalu panjang. Maksimal 3000 karakter.", 400);
    }

    if (!isValidSubmissionId(submissionId)) {
      return jsonError("ID pengiriman tidak valid.", 400);
    }

    const submissionDate = parseSubmittedAt(submittedAt);

    if (!submissionDate) {
      return jsonError("Waktu pengiriman tidak valid.", 400);
    }

    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(clientIp);

    if (!rateLimit.allowed) {
      return jsonError(
        "Terlalu banyak pesan dikirim. Silakan coba lagi beberapa saat.",
        429,
        {
          "Retry-After": String(rateLimit.retryAfter),
        },
      );
    }

    const { resendApiKey, receiverEmail, senderEmail, senderName, missing } =
      getEmailConfig();

    if (missing.length > 0) {
      console.error("CONTACT_EMAIL_CONFIG_MISSING:", missing);

      return jsonError(
        "Layanan email sedang tidak tersedia. Silakan coba lagi nanti.",
        500,
      );
    }

    if (!isValidEmail(receiverEmail)) {
      console.error("CONTACT_RECEIVER_EMAIL_INVALID");

      return jsonError(
        "Layanan email sedang tidak tersedia. Silakan coba lagi nanti.",
        500,
      );
    }

    if (!isValidEmail(senderEmail)) {
      console.error("CONTACT_SENDER_EMAIL_INVALID");

      return jsonError(
        "Layanan email sedang tidak tersedia. Silakan coba lagi nanti.",
        500,
      );
    }

    const visitorName = cleanEmailHeader(name);

    const receivedAt = formatReceivedAt(submissionDate);

    const contactEmail = buildContactEmail({
      name,
      email,
      message,
      receivedAt,
    });

    let resendResponse;

    try {
      resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `portfolio-contact/${submissionId}`,
        },
        body: JSON.stringify({
          from: `${senderName} <${senderEmail}>`,
          to: [receiverEmail],
          reply_to: email,
          subject: `Pesan baru dari ${visitorName}`,
          text: contactEmail.text,
          html: contactEmail.html,
        }),
        signal: AbortSignal.timeout(10000),
      });
    } catch (error) {
      if (error?.name === "TimeoutError" || error?.name === "AbortError") {
        console.error("RESEND_REQUEST_TIMEOUT");

        return jsonError(
          "Layanan email membutuhkan waktu terlalu lama. Silakan coba lagi.",
          504,
        );
      }

      console.error("RESEND_REQUEST_ERROR:", error);

      return jsonError("Pesan gagal dikirim. Silakan coba lagi nanti.", 502);
    }

    const resendResult = await resendResponse.json().catch(() => null);

    if (!resendResponse.ok) {
      console.error("RESEND_EMAIL_ERROR:", {
        status: resendResponse.status,
        type: resendResult?.name || resendResult?.type || null,
        message:
          resendResult?.message ||
          resendResult?.error ||
          "Unknown Resend error",
      });

      if (resendResponse.status === 401 || resendResponse.status === 403) {
        return jsonError(
          "Layanan email sedang tidak tersedia. Silakan coba lagi nanti.",
          502,
        );
      }

      if (resendResponse.status === 429) {
        return jsonError(
          "Layanan email sedang sibuk. Silakan coba lagi beberapa saat.",
          503,
        );
      }

      return jsonError("Pesan gagal dikirim. Silakan coba lagi nanti.", 502);
    }

    if (!resendResult?.id) {
      console.error("RESEND_INVALID_SUCCESS_RESPONSE:", resendResult);

      return jsonError("Pesan gagal dikirim. Silakan coba lagi nanti.", 502);
    }

    return NextResponse.json(
      {
        message: "Pesan berhasil dikirim.",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("CONTACT_EMAIL_ERROR:", error);

    return jsonError("Pesan gagal dikirim. Silakan coba lagi nanti.", 500);
  }
}
