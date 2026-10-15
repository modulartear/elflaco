import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { sql } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { ensureTenantForUser, TenantError, tenantErrorResponse } from "@/lib/tenant"

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.id) throw new TenantError("UNAUTHORIZED")

    const body = await request.json().catch(() => ({}))
    const storeId = await ensureTenantForUser({ id: session.user.id, name: typeof body.name === "string" ? body.name : session.user.name, email: session.user.email })
    const store = await db.execute(sql`SELECT slug FROM stores WHERE id = ${storeId} LIMIT 1`)
    const slug = (store.rows[0] as { slug?: string } | undefined)?.slug ?? ""

    const response = NextResponse.json({ storeId, slug }, { status: 201 })
    response.cookies.set("active-store-id", storeId, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 })
    return response
  } catch (error) {
    return tenantErrorResponse(error)
  }
}

export const dynamic = "force-dynamic"
