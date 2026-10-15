import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { sql } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { TenantError, tenantErrorResponse } from "@/lib/tenant"

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.id) throw new TenantError("UNAUTHORIZED")

    const body = await request.json().catch(() => ({}))
    const storeName = typeof body.name === "string" && body.name.trim() ? body.name.trim() : `${session.user.name ?? "Mi"} tienda`
    const baseSlug = storeName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "mi-tienda"
    const storeId = crypto.randomUUID()
    const slug = `${baseSlug}-${storeId.slice(0, 8)}`

    await db.transaction(async (tx) => {
      await tx.execute(sql`INSERT INTO stores (id, name, slug, email, "ownerId") VALUES (${storeId}, ${storeName}, ${slug}, ${session.user.email}, ${session.user.id})`)
      await tx.execute(sql`INSERT INTO store_memberships (id, "userId", "storeId", role) VALUES (${crypto.randomUUID()}, ${session.user.id}, ${storeId}, 'owner')`)
    })

    const response = NextResponse.json({ storeId, slug }, { status: 201 })
    response.cookies.set("active-store-id", storeId, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 })
    return response
  } catch (error) {
    return tenantErrorResponse(error)
  }
}

export const dynamic = "force-dynamic"
