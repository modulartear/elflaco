import { NextResponse } from "next/server"
import { sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { getPublicTenantId } from "@/lib/tenant"
import { normalizeDesign } from "@/lib/template-engine/design"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("store")?.trim().toLowerCase()
  const storeId = await getPublicTenantId(slug || undefined)
  const result = await db.execute(sql`
    SELECT s.id, s.name, s.slug, s.email, s.phone, s."ownerId", ss.settings
    FROM stores s
    LEFT JOIN store_settings ss ON ss."storeId" = s.id
    WHERE s.id = ${storeId}
    LIMIT 1
  `)
  const row = result.rows[0] as { id?: string; name?: string; slug?: string; email?: string; phone?: string; settings?: Record<string, unknown> } | undefined
  if (!row?.id) return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })
  return NextResponse.json({
    id: row.id,
    name: row.name ?? "Mi tienda",
    slug: row.slug ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    ...(row.settings ?? {}),
    design: normalizeDesign((row.settings as Record<string, unknown> | undefined)?.design),
  })
}
