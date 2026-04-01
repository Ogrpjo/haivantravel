import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/lib/apiBaseUrl";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://api.haivanevent.vn";

    const backendRes = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await backendRes.json().catch(() => ({}));

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: data.message ?? "Đăng nhập thất bại" },
        { status: backendRes.status }
      );
    }
    const token =
      data.token ?? data.accessToken ?? data.authToken ?? data.user?.id;

    if (!token) {
      return NextResponse.json(
        { message: "Token không hợp lệ" },
        { status: 500 }
      );
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}