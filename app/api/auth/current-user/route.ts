import { cookies } from "next/headers"
import { NextResponse } from "next/server"

/**
 * 浏览器只访问本站；拉用户信息时服务端转发：GET + Authorization Bearer。
 */
const UPSTREAM_URL = "http://43.136.21.87:8888/admin/current/user"
const BROWSER_COOKIE = "token"

const OK_CODE = new Set(["0", "200"])

function upstreamFailed(body: unknown): string | null {
  if (!body || typeof body !== "object" || !("code" in body)) return null
  const o = body as Record<string, unknown>
  if (OK_CODE.has(String(o.code))) return null
  const m = o.message ?? o.msg
  return typeof m === "string" ? m : "Unauthorized"
}

type ProxyResult = { data: unknown } | { error: string }

/** GET /admin/current/user，仅带 Bearer */
async function proxyUser(token: string): Promise<ProxyResult> {
  let res: Response
  try {
    res = await fetch(UPSTREAM_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json, text/plain, */*",
      },
      cache: "no-store",
    })
  } catch {
    return { error: "Upstream unreachable" }
  }

  let body: unknown
  try {
    body = await res.json()
  } catch {
    return { error: "Bad upstream response" }
  }

  const msg = upstreamFailed(body)
  if (msg) return { error: msg }
  if (!res.ok) return { error: "Unauthorized" }
  return { data: body }
}

function err(msg: string, status = 401) {
  return NextResponse.json({ error: msg }, { status })
}

export async function GET() {
  const token = (await cookies()).get(BROWSER_COOKIE)?.value
  if (!token) return err("Unauthorized")

  const r = await proxyUser(token)
  if ("error" in r) return err(r.error)
  return NextResponse.json(r.data)
}

function tokenFromBearer(req: Request): string {
  const m = req.headers.get("authorization")?.match(/^Bearer\s+(\S+)/i)
  return m?.[1]?.trim() ?? ""
}

export async function POST(req: Request) {
  let token = tokenFromBearer(req)

  if (!token) {
    let form: FormData
    try {
      form = await req.formData()
    } catch {
      return err("Invalid body", 400)
    }
    const v = form.get("token")
    token = typeof v === "string" ? v.trim() : ""
  }

  if (!token) return err("Missing token", 400)

  const r = await proxyUser(token)
  if ("error" in r) return err(r.error)

  ;(await cookies()).set(BROWSER_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: false,
    maxAge: 60 * 60 * 24 * 7,
  })
  return NextResponse.json(r.data)
}
