import { NextRequest, NextResponse } from "next/server";
import { getServerApiBaseUrl } from "@/app/lib/apiBaseUrl";

export async function POST(req: NextRequest) {
  try {
    const apiUrl = getServerApiBaseUrl();
    await fetch(`${apiUrl}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch(() => {});

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

