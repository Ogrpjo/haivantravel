import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/lib/apiBaseUrl";

const API_URL = process.env.API_URL?.trim() || getApiBaseUrl();

export async function POST(req: NextRequest) {
  try {
    if (API_URL) {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }).catch(() => {});
    }

    const res = NextResponse.json({ success: true });

    res.cookies.set("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return res;
  } catch (error) {
    console.error("Logout error:", error);

    const res = NextResponse.json(
      { success: false },
      { status: 500 }
    );
    res.cookies.set("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return res;
  }
}

