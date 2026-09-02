import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

const rateLimitStore = globalThis.__portfolioContactRateLimitStore || new Map();

globalThis.__portfolioContactRateLimitStore = rateLimitStore;

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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

  if (!forwardedFor) {
    return "";
  }

  return forwardedFor.split(",")[0]?.trim() || "";
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

function formatReceivedAt() {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date());
}

export async function POST(request) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();
    const website = String(body.website || "").trim();

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

    const resendApiKey = process.env.RESEND_API_KEY?.trim();

    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL?.trim();

    const senderEmail = process.env.CONTACT_SENDER_EMAIL?.trim();

    const senderName = cleanEmailHeader(
      process.env.CONTACT_SENDER_NAME || "Rifqi Portfolio",
    );

    if (!resendApiKey || !receiverEmail || !senderEmail || !senderName) {
      return jsonError("Konfigurasi layanan email belum lengkap.", 500);
    }

    if (!isValidEmail(receiverEmail) || !isValidEmail(senderEmail)) {
      return jsonError("Konfigurasi alamat email server tidak valid.", 500);
    }

    const visitorName = cleanEmailHeader(name);

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

    const receivedAt = escapeHtml(formatReceivedAt());

    const replyMailto = `mailto:${encodeURIComponent(email)}`;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${senderName} <${senderEmail}>`,
        to: [receiverEmail],
        reply_to: email,
        subject: `Pesan baru dari ${visitorName}`,
        text: `Nama: ${name}\nEmail: ${email}\nDiterima: ${receivedAt}\n\nPesan:\n${message}`,
        html: `
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Pesan Baru</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
      font-family: Arial, Helvetica, sans-serif;
      color: #222222;
    "
  >
    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="
        width: 100%;
        background-color: #f5f5f5;
      "
    >
      <tr>
        <td
          align="center"
          style="
            padding: 32px 16px;
          "
        >
          <table
            role="presentation"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
              width: 100%;
              max-width: 600px;
              background-color: #ffffff;
              border: 1px solid #e5e5e5;
              border-radius: 10px;
            "
          >
            <tr>
              <td
                style="
                  padding: 28px 32px 20px;
                "
              >
                <div
                  style="
                    margin-bottom: 6px;
                    font-size: 13px;
                    font-weight: 600;
                    color: #666666;
                  "
                >
                  Rifqi Portfolio
                </div>

                <h1
                  style="
                    margin: 0;
                    font-size: 24px;
                    line-height: 1.4;
                    font-weight: 700;
                    color: #111111;
                  "
                >
                  Pesan baru dari ${safeName}
                </h1>

                <div
                  style="
                    margin-top: 8px;
                    font-size: 13px;
                    line-height: 1.5;
                    color: #888888;
                  "
                >
                  ${receivedAt} WIB
                </div>
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 0 32px;
                "
              >
                <div
                  style="
                    height: 1px;
                    background-color: #eeeeee;
                  "
                ></div>
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 24px 32px 8px;
                "
              >
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                >
                  <tr>
                    <td
                      style="
                        width: 80px;
                        padding: 0 0 14px;
                        vertical-align: top;
                        font-size: 14px;
                        color: #777777;
                      "
                    >
                      Nama
                    </td>

                    <td
                      style="
                        padding: 0 0 14px;
                        font-size: 14px;
                        font-weight: 600;
                        color: #222222;
                      "
                    >
                      ${safeName}
                    </td>
                  </tr>

                  <tr>
                    <td
                      style="
                        width: 80px;
                        padding: 0 0 14px;
                        vertical-align: top;
                        font-size: 14px;
                        color: #777777;
                      "
                    >
                      Email
                    </td>

                    <td
                      style="
                        padding: 0 0 14px;
                        font-size: 14px;
                      "
                    >
                      <a
                        href="mailto:${safeEmail}"
                        style="
                          color: #2563eb;
                          text-decoration: none;
                        "
                      >
                        ${safeEmail}
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 8px 32px 24px;
                "
              >
                <div
                  style="
                    margin-bottom: 10px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #222222;
                  "
                >
                  Pesan
                </div>

                <div
                  style="
                    padding: 16px;
                    background-color: #f7f7f7;
                    border-radius: 6px;
                    font-size: 14px;
                    line-height: 1.7;
                    color: #333333;
                    word-break: break-word;
                  "
                >
                  ${safeMessage}
                </div>
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 0 32px 28px;
                "
              >
                <a
                  href="${replyMailto}"
                  style="
                    display: inline-block;
                    padding: 11px 18px;
                    background-color: #111111;
                    border-radius: 6px;
                    color: #ffffff;
                    font-size: 14px;
                    font-weight: 600;
                    text-decoration: none;
                  "
                >
                  Balas pesan
                </a>
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 18px 32px;
                  border-top: 1px solid #eeeeee;
                  font-size: 12px;
                  line-height: 1.6;
                  color: #999999;
                "
              >
                Pesan ini dikirim melalui form kontak di
                <a
                  href="https://www.rifqii.com"
                  style="
                    color: #666666;
                    text-decoration: underline;
                  "
                >
                  rifqii.com
                </a>.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
          `,
      }),
      signal: AbortSignal.timeout(10000),
    });

    const resendResult = await resendResponse.json().catch(() => null);

    if (!resendResponse.ok) {
      console.error("RESEND_EMAIL_ERROR:", {
        status: resendResponse.status,
        message:
          resendResult?.message ||
          resendResult?.error ||
          "Unknown Resend error",
      });

      return jsonError(
        "Pesan belum dapat dikirim. Silakan coba lagi nanti.",
        502,
      );
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
    if (error?.name === "TimeoutError") {
      console.error("CONTACT_EMAIL_TIMEOUT");

      return jsonError(
        "Layanan email membutuhkan waktu terlalu lama. Silakan coba lagi.",
        504,
      );
    }

    console.error("CONTACT_EMAIL_ERROR:", error);

    return jsonError("Pesan gagal dikirim. Silakan coba lagi nanti.", 500);
  }
}
