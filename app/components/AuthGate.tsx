"use client";

import { useEffect, useState, type ReactNode } from "react";

/** 生产门户；本地联调改成 http://localhost:5173/login */
const PORTAL_LOGIN = "https://portal.dobot-robots.com/login";
// const PORTAL_LOGIN = "http://localhost:5173/login";
const MAX_AUTO_REDIRECT_ATTEMPTS = 2;
const REDIRECT_FAIL_KEY = "auth_redirect_failures";
/** Token 存浏览器（可脚本清除）；不再用 httpOnly Cookie */
const AUTH_TOKEN_STORAGE_KEY = "signup-app-portal-token";

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  const t = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)?.trim();
  return t || null;
}

function setStoredToken(token: string) {
  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

function clearStoredToken() {
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

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

function goPortal() {
  const redirectUrl = encodeURIComponent(window.location.origin);
  window.location.href = `${PORTAL_LOGIN}?redirect_url=${redirectUrl}`;
}

function getFailCount(): number {
  const raw = window.sessionStorage.getItem(REDIRECT_FAIL_KEY);
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function setFailCount(v: number) {
  window.sessionStorage.setItem(REDIRECT_FAIL_KEY, String(v));
}

function clearFailCount() {
  window.sessionStorage.removeItem(REDIRECT_FAIL_KEY);
}

async function handleAuthFailure(
  setLoading: (v: boolean) => void,
  setShowRedirectMask: (v: boolean) => void,
) {
  const next = getFailCount() + 1;
  setFailCount(next);

  if (next >= MAX_AUTO_REDIRECT_ATTEMPTS) {
    const hrefUrl = new URL(window.location.href);
    window.history.replaceState({}, "", stripAuthParams(hrefUrl));
    clearStoredToken();
    setShowRedirectMask(true);
    setLoading(false);
    return;
  }

  goPortal();
}

async function runAuthFlow(
  setLoading: (v: boolean) => void,
  setShowRedirectMask: (v: boolean) => void,
) {
  const hrefUrl = new URL(window.location.href);
  const urlToken = readTokenFromSearch(hrefUrl.searchParams);

  if (urlToken) {
    const form = new URLSearchParams();
    form.set("token", urlToken);
    let res: Response;
    try {
      res = await fetch("/api/auth/current-user", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${urlToken}`,
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: form.toString(),
      });
    } catch {
      await handleAuthFailure(setLoading, setShowRedirectMask);
      return;
    }

    if (res.ok) {
      clearFailCount();
      setStoredToken(urlToken);
      window.history.replaceState({}, "", stripAuthParams(hrefUrl));
      setLoading(false);
      return;
    }
    clearStoredToken();
    await handleAuthFailure(setLoading, setShowRedirectMask);
    return;
  }

  const stored = getStoredToken();
  if (!stored) {
    await handleAuthFailure(setLoading, setShowRedirectMask);
    return;
  }

  let res: Response;
  try {
    res = await fetch("/api/auth/current-user", {
      headers: { Authorization: `Bearer ${stored}` },
    });
  } catch {
    await handleAuthFailure(setLoading, setShowRedirectMask);
    return;
  }

  if (res.ok) {
    clearFailCount();
    setLoading(false);
    return;
  }

  clearStoredToken();
  await handleAuthFailure(setLoading, setShowRedirectMask);
}

export function AuthGate({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [showRedirectMask, setShowRedirectMask] = useState(false);

  useEffect(() => {
    runAuthFlow(setLoading, setShowRedirectMask);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-zinc-50 text-zinc-600">
        <div
          className="size-[120px] shrink-0 rounded-full border-8 border-zinc-200 border-t-blue-600 animate-spin"
          aria-hidden
        />
        <p className="text-sm font-medium tracking-wide animate-pulse">
          loading...
        </p>
      </div>
    );
  }

  if (showRedirectMask) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-b from-zinc-950/65 via-zinc-900/60 to-zinc-950/70 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-3xl border border-white/15 bg-white/95 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <button
            type="button"
            onClick={goPortal}
            className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold tracking-wide text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-[0.99]"
          >
            To Login Portal
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
