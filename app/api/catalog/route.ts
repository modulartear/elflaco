import { NextResponse } from "next/server"
import { sql } from "drizzle-orm"
import { db } from "@/lib/db"

export async function GET() {
  const products = await db.execute(sql`SELECT id, name, slug, sku, description, price::text, transfer_price::text AS "transferPrice", stock, image_url AS "imageUrl", category_id AS "categoryId", brand_id AS "brandId", featured, active FROM catalog_products WHERE active = true ORDER BY featured DESC, created_at DESC`)
  return NextResponse.json(products.rows)
}

export async function POST(request: Request) {
  const body = await request.json()
  const name = typeof body.name === "string" ? body.name.trim() : ""
  const price = Number(body.price)
  if (!name || !Number.isFinite(price) || price < 0) return NextResponse.json({ error: "Nombre y precio son obligatorios" }, { status: 400 })
  const slug = (typeof body.slug === "string" && body.slug.trim() ? body.slug : name).toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  const result = await db.execute(sql`INSERT INTO catalog_products (name, slug, sku, description, price, transfer_price, stock, image_url, category_id, brand_id, featured, active) VALUES (${name}, ${slug}, ${body.sku || null}, ${body.description || null}, ${price}, ${body.transferPrice ? Number(body.transferPrice) : null}, ${Number(body.stock) || 0}, ${body.imageUrl || null}, ${body.categoryId || null}, ${body.brandId || null}, ${Boolean(body.featured)}, true) RETURNING id, name, slug, price::text, stock, active`)
  return NextResponse.json(result.rows[0], { status: 201 })
}
