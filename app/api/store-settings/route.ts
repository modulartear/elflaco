import { NextResponse } from "next/server"
import { sql } from "drizzle-orm"
import { db } from "@/lib/db"

const STORE_ID = "default-store"

export async function GET() {
  const result = await db.execute(sql`SELECT settings FROM store_settings WHERE "storeId" = ${STORE_ID} LIMIT 1`)
  return NextResponse.json(result.rows[0]?.settings ?? {})
}

export async function PUT(request: Request) {
  const body = await request.json()
  const settings = {
    storeName: typeof body.storeName === "string" ? body.storeName.trim().slice(0, 120) : "",
    storeEmail: typeof body.storeEmail === "string" ? body.storeEmail.trim().slice(0, 160) : "",
    storePhone: typeof body.storePhone === "string" ? body.storePhone.trim().slice(0, 80) : "",
    storeVisible: Boolean(body.storeVisible),
    orderNotifications: Boolean(body.orderNotifications),
  }
  const result = await db.execute(sql`INSERT INTO store_settings (id, "storeId", settings, "updatedAt") VALUES (gen_random_uuid()::text, ${STORE_ID}, ${JSON.stringify(settings)}::jsonb, NOW()) ON CONFLICT ("storeId") DO UPDATE SET settings = EXCLUDED.settings, "updatedAt" = NOW() RETURNING settings`)
  return NextResponse.json(result.rows[0]?.settings ?? settings)
}
