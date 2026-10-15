import pg from "pg"

const { Client } = pg
const client = new Client({ connectionString: process.env.DATABASE_URL })

const query = async (text, values = []) => (await client.query(text, values)).rows

try {
  await client.connect()

  const requiredColumns = await query(`
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = ANY($1)
      AND column_name = 'storeId'
  `, [["catalog_products", "catalog_categories", "catalog_brands", "catalog_banners"]])

  const requiredTables = new Set(requiredColumns.map((row) => row.table_name))
  const expectedTables = ["catalog_products", "catalog_categories", "catalog_brands", "catalog_banners"]
  const missingTables = expectedTables.filter((table) => !requiredTables.has(table))
  if (missingTables.length) throw new Error(`Faltan columnas storeId en: ${missingTables.join(", ")}`)

  const nullCounts = await query(`
    SELECT table_name, COUNT(*)::int AS count
    FROM (
      SELECT 'catalog_products' AS table_name FROM public.catalog_products WHERE "storeId" IS NULL
      UNION ALL SELECT 'catalog_categories' FROM public.catalog_categories WHERE "storeId" IS NULL
      UNION ALL SELECT 'catalog_brands' FROM public.catalog_brands WHERE "storeId" IS NULL
      UNION ALL SELECT 'catalog_banners' FROM public.catalog_banners WHERE "storeId" IS NULL
    ) missing
    GROUP BY table_name
  `)
  if (nullCounts.length) throw new Error(`Hay registros sin tenant: ${JSON.stringify(nullCounts)}`)

  const duplicateProducts = await query(`
    SELECT "storeId", slug, COUNT(*)::int AS count
    FROM public.catalog_products
    GROUP BY "storeId", slug
    HAVING COUNT(*) > 1
  `)
  if (duplicateProducts.length) throw new Error(`Hay slugs duplicados por tienda: ${JSON.stringify(duplicateProducts)}`)

  const duplicateStores = await query(`
    SELECT slug, COUNT(*)::int AS count
    FROM public.stores
    GROUP BY slug
    HAVING COUNT(*) > 1
  `)
  if (duplicateStores.length) throw new Error(`Hay slugs de tiendas duplicados: ${JSON.stringify(duplicateStores)}`)

  console.log("Tenant isolation audit passed")
} finally {
  await client.end().catch(() => {})
}

