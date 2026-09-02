import { contactEmailStyles as styles } from "@/lib/email/contact-email-styles";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createGmailReplyUrl(name, email) {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: email,
    su: `Re: Pesan dari ${name}`,
  });

  return `https://mail.google.com/mail/?${params.toString()}`;
}

export function buildContactEmail({ name, email, message, receivedAt }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");
  const safeReceivedAt = escapeHtml(receivedAt);

  const gmailReplyUrl = createGmailReplyUrl(name, email);

  const safeGmailReplyUrl = escapeHtml(gmailReplyUrl);

  const html = `
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

  <body style="${styles.body}">
    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="${styles.outerTable}"
    >
      <tr>
        <td
          align="center"
          style="${styles.outerCell}"
        >
          <table
            role="presentation"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="${styles.card}"
          >
            <tr>
              <td style="${styles.headerCell}">
                <div style="${styles.brand}">
                  Rifqi Portfolio
                </div>

                <h1 style="${styles.title}">
                  Pesan baru dari ${safeName}
                </h1>

                <div style="${styles.date}">
                  ${safeReceivedAt} WIB
                </div>
              </td>
            </tr>

            <tr>
              <td style="${styles.dividerCell}">
                <div style="${styles.divider}"></div>
              </td>
            </tr>

            <tr>
              <td style="${styles.infoCell}">
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="${styles.infoTable}"
                >
                  <tr>
                    <td style="${styles.labelCell}">
                      Nama
                    </td>

                    <td style="${styles.nameValueCell}">
                      ${safeName}
                    </td>
                  </tr>

                  <tr>
                    <td style="${styles.labelCell}">
                      Email
                    </td>

                    <td style="${styles.emailValueCell}">
                      <a
                        href="${safeGmailReplyUrl}"
                        target="_blank"
                        style="${styles.emailLink}"
                      >
                        ${safeEmail}
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="${styles.messageCell}">
                <div style="${styles.messageLabel}">
                  Pesan
                </div>

                <div style="${styles.messageBox}">
                  ${safeMessage}
                </div>
              </td>
            </tr>

            <tr>
              <td style="${styles.actionCell}">
                <a
                  href="${safeGmailReplyUrl}"
                  target="_blank"
                  style="${styles.replyButton}"
                >
                  Balas pesan
                </a>
              </td>
            </tr>

            <tr>
              <td style="${styles.footerCell}">
                Pesan ini dikirim melalui form kontak di
                <a
                  href="https://www.rifqii.com"
                  style="${styles.footerLink}"
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
  `.trim();

  const text = [
    `Nama: ${name}`,
    `Email: ${email}`,
    `Diterima: ${receivedAt} WIB`,
    "",
    "Pesan:",
    message,
  ].join("\n");

  return {
    html,
    text,
  };
}
