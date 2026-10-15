import { cookies, headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { sql } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { TenantError, tenantErrorResponse } from "@/lib/tenant"

const ACTIVE_STORE_COOKIE = "active-store-id"

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.id) throw new TenantError("UNAUTHORIZED")
    const result = await db.execute(sql`SELECT s.id, s.name, s.slug, sm.role FROM stores s INNER JOIN store_memberships sm ON sm."storeId" = s.id WHERE sm."userId" = ${session.user.id} ORDER BY s.name ASC`)
    const activeStoreId = (await cookies()).get(ACTIVE_STORE_COOKIE)?.value ?? result.rows[0]?.id ?? null
    return NextResponse.json({ stores: result.rows, activeStoreId })
  } catch (error) {
    return tenantErrorResponse(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.id) throw new TenantError("UNAUTHORIZED")
    const body = await request.json()
    const storeId = typeof body.storeId === "string" ? body.storeId : ""
    const result = await db.execute(sql`SELECT 1 FROM store_memberships WHERE "userId" = ${session.user.id} AND "storeId" = ${storeId} LIMIT 1`)
    if (!result.rows[0]) throw new TenantError("FORBIDDEN")
    const response = NextResponse.json({ activeStoreId: storeId })
    response.cookies.set(ACTIVE_STORE_COOKIE, storeId, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 })
    return response
  } catch (error) {
    return tenantErrorResponse(error)
  }
}

export const dynamic = "force-dynamic"
