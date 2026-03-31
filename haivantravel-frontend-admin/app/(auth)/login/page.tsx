"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {}, [router]);

  const handleLogin = async () => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.ok) {
        router.push("/dashboard");
      } else {
        alert(data.message ?? "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra. vui lòng thử lại.");
    }
  };

  return (
    <div className="flex flex-row items-center justify-center min-h-[100vh]">
      <div className="flex-1 flex flex-col items-center justify-center h-[90vh] border-r">
        <h1 className="font-bold pb-[10px] text-xl">Login</h1>
        <div className="flex flex-col gap-8 w-full items-center">
          <div className="flex flex-col max-w-[20vw] gap-1 w-full">
            <input
              type="text"
              placeholder="username"
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-[10px] bg-white/10 pl-3 w-full text-start py-3 shadow-[0_14px_34px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/45 focus:border-[#05B9BA]"
            />
          </div>
          <div className="flex flex-col max-w-[20vw] gap-1 w-full">
            <input
              type="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-[10px] bg-white/10 pl-3 w-full text-start py-3 shadow-[0_14px_34px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/45 focus:border-[#05B9BA]"
            />
          </div>
          <button
            onClick={handleLogin}
            className="cursor-pointer bg-[#05B9BA] max-w-[7vw] text-white w-full py-2 rounded-[10px] shadow-[0_10px_24px_rgba(5,185,186,0.45)] hover:shadow-[0_12px_28px_rgba(5,185,186,0.55)] transition-shadow"
          >
            Sign in
          </button>
          <p>Copyrighted © by Z.Tech</p>
        </div>
      </div>
      <div className="flex-1">
        <div className="px-[2vw] flex flex-col">
          <span className="text-2xl font-semibold">HAIVAN EVENT</span>
          <span className="text-sm text-[#E0E0E0]">
            Welcome to Hai Van Event admin!
          </span>
        </div>
      </div>
    </div>
  );
}
