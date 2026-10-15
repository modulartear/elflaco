import { cookies, headers } from "next/headers"
import { sql } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

const ACTIVE_STORE_COOKIE = "active-store-id"

type TenantAccess = {
  userId: string
  storeId: string
  role: string
}

export async function ensureTenantForUser(user: { id: string; name?: string | null; email?: string | null }) {
  const existing = await db.execute(sql`SELECT "storeId" FROM store_memberships WHERE "userId" = ${user.id} ORDER BY "createdAt" ASC LIMIT 1`)
  const existingStoreId = (existing.rows[0] as { storeId?: string } | undefined)?.storeId
  if (existingStoreId) return existingStoreId

  const storeId = crypto.randomUUID()
  const storeName = user.name?.trim() || "Mi tienda"
  const baseSlug = storeName.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "mi-tienda"
  const slug = `${baseSlug}-${storeId.slice(0, 8)}`
  await db.transaction(async (tx) => {
    await tx.execute(sql`INSERT INTO stores (id, name, slug, email, "ownerId") VALUES (${storeId}, ${storeName}, ${slug}, ${user.email ?? null}, ${user.id}) ON CONFLICT (id) DO NOTHING`)
    await tx.execute(sql`INSERT INTO store_memberships (id, "userId", "storeId", role) VALUES (${crypto.randomUUID()}, ${user.id}, ${storeId}, 'owner') ON CONFLICT ("storeId", "userId") DO NOTHING`)
  })
  return storeId
}

export async function requireTenantAccess(allowedRoles?: string[]): Promise<TenantAccess> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) throw new TenantError("UNAUTHORIZED")

  const cookieStore = await cookies()
  const requestedStoreId = cookieStore.get(ACTIVE_STORE_COOKIE)?.value
  const membership = await db.execute(
    requestedStoreId
      ? sqlMembership(session.user.id, requestedStoreId)
      : sqlFirstMembership(session.user.id),
  )
  const row = membership.rows[0] as { storeId?: string; role?: string } | undefined
  if (!row?.storeId || !row.role) throw new TenantError("FORBIDDEN")
  if (allowedRoles && !allowedRoles.includes(row.role)) throw new TenantError("FORBIDDEN")
  return { userId: session.user.id, storeId: row.storeId, role: row.role }
}

function sqlMembership(userId: string, storeId: string) {
  return db.execute(sql`SELECT "storeId", role FROM store_memberships WHERE "userId" = ${userId} AND "storeId" = ${storeId} LIMIT 1`)
}

export async function getPublicTenantId(storeSlug?: string) {
  if (storeSlug) {
    const result = await db.execute(sql`SELECT id FROM stores WHERE slug = ${storeSlug} LIMIT 1`)
    const storeId = (result.rows[0] as { id?: string } | undefined)?.id
    if (storeId) return storeId
  }
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user?.id) {
    try {
      return (await requireTenantAccess()).storeId
    } catch {
      return "default-store"
    }
  }
  return "default-store"
}

function sqlFirstMembership(userId: string) {
  return db.execute(sql`SELECT "storeId", role FROM store_memberships WHERE "userId" = ${userId} ORDER BY CASE WHEN role = 'owner' THEN 0 ELSE 1 END, "createdAt" ASC LIMIT 1`)
}


export class TenantError extends Error {
  constructor(public code: "UNAUTHORIZED" | "FORBIDDEN") {
    super(code)
  }
}

export function tenantErrorResponse(error: unknown) {
  if (error instanceof TenantError) return Response.json({ error: error.message }, { status: error.code === "UNAUTHORIZED" ? 401 : 403 })
  return Response.json({ error: "Error interno" }, { status: 500 })
}
