import { NextResponse } from "next/server"
import { sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { requireTenantAccess, tenantErrorResponse } from "@/lib/tenant"

export async function GET() {
  try {
    const { storeId } = await requireTenantAccess()
    const result = await db.execute(sql`SELECT settings FROM store_settings WHERE "storeId" = ${storeId} LIMIT 1`)
    return NextResponse.json(result.rows[0]?.settings ?? {})
  } catch (error) {
    return tenantErrorResponse(error)
  }
}

export async function PUT(request: Request) {
  try {
    const { storeId } = await requireTenantAccess(["owner", "admin", "editor"])
    const body = await request.json()
  const settings = {
    storeName: typeof body.storeName === "string" ? body.storeName.trim().slice(0, 120) : "",
    storeEmail: typeof body.storeEmail === "string" ? body.storeEmail.trim().slice(0, 160) : "",
    storePhone: typeof body.storePhone === "string" ? body.storePhone.trim().slice(0, 80) : "",
    storeVisible: Boolean(body.storeVisible),
    orderNotifications: Boolean(body.orderNotifications),
  }
  const result = await db.execute(sql`INSERT INTO store_settings (id, "storeId", settings, "updatedAt") VALUES (gen_random_uuid()::text, ${storeId}, ${JSON.stringify(settings)}::jsonb, NOW()) ON CONFLICT ("storeId") DO UPDATE SET settings = EXCLUDED.settings, "updatedAt" = NOW() RETURNING settings`)
    return NextResponse.json(result.rows[0]?.settings ?? settings)
  } catch (error) {
    return tenantErrorResponse(error)
  }
}
