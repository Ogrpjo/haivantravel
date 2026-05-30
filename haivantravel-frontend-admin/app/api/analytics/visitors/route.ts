import { NextResponse } from "next/server";
import crypto from "crypto";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_ANALYTICS_DATA_API_URL =
  "https://analyticsdata.googleapis.com/v1beta/properties";

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type AnalyticsReportResponse = {
  rowCount?: number;
  rows?: Array<{
    metricValues?: Array<{
      value?: string;
    }>;
  }>;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function getPrivateKey() {
  const rawKey = getRequiredEnv("GA_PRIVATE_KEY");
  return rawKey.replace(/\\n/g, "\n");
}

function base64UrlEncode(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function createSignedJwt(assertion: {
  clientEmail: string;
  privateKey: string;
}) {
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: "RS256",
    typ: "JWT",
  };
  const payload = {
    iss: assertion.clientEmail,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    aud: GOOGLE_TOKEN_URL,
    exp: now + 60 * 60,
    iat: now,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(data);
  signer.end();
  const signature = signer.sign(assertion.privateKey);

  return `${data}.${base64UrlEncode(signature)}`;
}

async function getAccessToken() {
  const clientEmail = getRequiredEnv("GA_CLIENT_EMAIL");
  const privateKey = getPrivateKey();
  const assertion = createSignedJwt({ clientEmail, privateKey });

  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  });

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  const data = (await response.json()) as GoogleTokenResponse;

  if (!response.ok || !data.access_token) {
    throw new Error(
      data.error_description || data.error || "Không thể lấy access token Google Analytics."
    );
  }

  return data.access_token;
}

async function fetchVisitorCount(propertyId: string, accessToken: string) {
  const response = await fetch(`${GOOGLE_ANALYTICS_DATA_API_URL}/${propertyId}:runReport`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dateRanges: [{ startDate: "2020-01-01", endDate: "today" }],
      metrics: [{ name: "totalUsers" }],
    }),
    cache: "no-store",
  });

  const data = (await response.json()) as AnalyticsReportResponse & {
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(
      data.error?.message || "Không thể lấy dữ liệu truy cập từ Google Analytics."
    );
  }

  const totalUsers = Number(data.rows?.[0]?.metricValues?.[0]?.value ?? 0);

  return Number.isNaN(totalUsers) ? 0 : totalUsers;
}

export async function GET() {
  try {
    const propertyId = getRequiredEnv("GA_ID");
    const accessToken = await getAccessToken();
    const totalVisitors = await fetchVisitorCount(propertyId, accessToken);

    return NextResponse.json({
      totalVisitors,
      propertyId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Có lỗi xảy ra.",
      },
      { status: 500 }
    );
  }
}
