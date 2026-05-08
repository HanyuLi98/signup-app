"use client";

import { useEffect, useState, type ReactNode } from "react";

/** 生产门户；本地联调改成 http://localhost:5173/login */
// const PORTAL_LOGIN = "https://portal.dobot-robots.com/login"
const PORTAL_LOGIN = "http://localhost:5173/login";

function readTokenFromSearch(params: URLSearchParams): string | null {
  const keys = ["token", "access_token", "accessToken"];
  for (const k of keys) {
    const v = params.get(k)?.trim();
    if (v) return v;
  }
  return null;
}

function stripAuthParams(url: URL) {
  const keys = ["token", "access_token", "accessToken"];
  for (const k of keys) url.searchParams.delete(k);
  const q = url.searchParams.toString();
  return url.pathname + (q ? `?${q}` : "") + url.hash;
}

async function runAuthFlow(setLoading: (v: boolean) => void) {
  const hrefUrl = new URL(window.location.href);
  const urlToken = readTokenFromSearch(hrefUrl.searchParams);

  const goPortal = () => {
    const redirectUrl = encodeURIComponent(window.location.origin);
    window.location.href = `${PORTAL_LOGIN}?redirect_url=${redirectUrl}`;
  };

  if (urlToken) {
    const form = new URLSearchParams();
    form.set("token", urlToken);
    const res = await fetch("/api/auth/current-user", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${urlToken}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: form.toString(),
      credentials: "include",
    });

    if (res.ok) {
      window.history.replaceState({}, "", stripAuthParams(hrefUrl));
      setLoading(false);
      return;
    }
    goPortal();
    return;
  }

  const res = await fetch("/api/auth/current-user", { credentials: "include" });

  if (res.ok) {
    setLoading(false);
    return;
  }

  goPortal();
}

export function AuthGate({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void runAuthFlow(setLoading);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-zinc-50 text-zinc-600">
        <div
          className="size-[120px] shrink-0 rounded-full border-[8px] border-zinc-200 border-t-blue-600 animate-spin"
          aria-hidden
        />
        <p className="text-sm font-medium tracking-wide animate-pulse">loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
