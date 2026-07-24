import { NextResponse } from "next/server";

const GITHUB_USERNAME = "ki1bot";
const GITHUB_CONTRIBUTIONS_URL = `https://github.com/users/${GITHUB_USERNAME}/contributions`;

function parseContributionTotalFromHeading(html) {
  const match = html.match(
    /([\d,.]+)\s+contributions?\s+in\s+the\s+last\s+year/i,
  );

  if (!match) {
    return null;
  }

  const total = Number(match[1].replace(/[^\d]/g, ""));

  return Number.isFinite(total) ? total : null;
}

function calculateContributionTotalFromDays(html) {
  const contributionMatches = html.matchAll(/data-count="(\d+)"/g);

  let total = 0;
  let contributionDayFound = false;

  for (const match of contributionMatches) {
    total += Number(match[1]);
    contributionDayFound = true;
  }

  return contributionDayFound ? total : null;
}

export async function GET() {
  try {
    const response = await fetch(GITHUB_CONTRIBUTIONS_URL, {
      headers: {
        Accept: "text/html",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent": "k1bot-portfolio",
      },
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Gagal mengambil data kontribusi GitHub.",
        },
        {
          status: response.status,
        },
      );
    }

    const html = await response.text();

    const totalContributions =
      parseContributionTotalFromHeading(html) ??
      calculateContributionTotalFromDays(html);

    if (!Number.isInteger(totalContributions)) {
      return NextResponse.json(
        {
          error: "Jumlah kontribusi GitHub tidak ditemukan.",
        },
        {
          status: 502,
        },
      );
    }

    return NextResponse.json(
      {
        username: GITHUB_USERNAME,
        totalContributions,
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch {
    return NextResponse.json(
      {
        error: "Terjadi kesalahan saat mengambil kontribusi GitHub.",
      },
      {
        status: 500,
      },
    );
  }
}
