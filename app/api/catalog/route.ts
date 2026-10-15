import { NextResponse } from "next/server"
import { sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { requireTenantAccess, tenantErrorResponse } from "@/lib/tenant"

export async function GET() {
  try {
    const { storeId } = await requireTenantAccess()
    const products = await db.execute(sql`SELECT id, name, slug, sku, description, price::text, transfer_price::text AS "transferPrice", stock, image_url AS "imageUrl", category_id AS "categoryId", brand_id AS "brandId", featured, active FROM catalog_products WHERE "storeId" = ${storeId} AND active = true ORDER BY featured DESC, created_at DESC`)
    return NextResponse.json(products.rows)
  } catch (error) {
    return tenantErrorResponse(error)
  }
}

export async function POST(request: Request) {
  try {
    const { storeId } = await requireTenantAccess(["owner", "admin", "editor"])
    const body = await request.json()
  const name = typeof body.name === "string" ? body.name.trim() : ""
  const price = Number(body.price)
  if (!name || !Number.isFinite(price) || price < 0) return NextResponse.json({ error: "Nombre y precio son obligatorios" }, { status: 400 })
  const slug = (typeof body.slug === "string" && body.slug.trim() ? body.slug : name).toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  const result = await db.execute(sql`INSERT INTO catalog_products (name, slug, sku, description, price, transfer_price, stock, image_url, category_id, brand_id, featured, active, "storeId") VALUES (${name}, ${slug}, ${body.sku || null}, ${body.description || null}, ${price}, ${body.transferPrice ? Number(body.transferPrice) : null}, ${Number(body.stock) || 0}, ${body.imageUrl || null}, ${body.categoryId || null}, ${body.brandId || null}, ${Boolean(body.featured)}, true, ${storeId}) RETURNING id, name, slug, price::text, stock, active`)
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    return tenantErrorResponse(error)
  }
}
