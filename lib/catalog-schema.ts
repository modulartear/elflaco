export type CatalogProduct = {
  id: string
  name: string
  slug: string
  sku: string | null
  description: string | null
  price: string
  transferPrice: string | null
  stock: number
  imageUrl: string | null
  categoryId: string | null
  brandId: string | null
  featured: boolean
  active: boolean
}

export type CatalogCategory = { id: string; name: string; slug: string; active: boolean }
export type CatalogBrand = { id: string; name: string; slug: string; logoUrl: string | null; active: boolean }
