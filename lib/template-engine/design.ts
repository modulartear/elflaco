export const DEFAULT_DESIGN = {
  brandColor: "#42b85a",
  headingFont: "Open Sans",
  bodyFont: "Open Sans",
  borderStyle: "Recto",
  headerMessage: "",
  headerLink: "",
  logoPath: "",
  faviconPath: "",
  heroTitle: "ENCONTRÁ TODO PARA TU MOTO",
  headerTitle: "Mi tienda",
  productsTitle: "Productos destacados",
  footerText: "Calidad y confianza para tu moto",
  sectionOrder: ["header", "hero", "products", "footer"],
  addedWidgets: [],
} as const

export type StoreDesign = {
  [K in keyof typeof DEFAULT_DESIGN]: typeof DEFAULT_DESIGN[K]
}

export function normalizeDesign(value: unknown): StoreDesign {
  const input = value && typeof value === "object" ? value as Record<string, unknown> : {}
  return {
    ...DEFAULT_DESIGN,
    ...input,
    sectionOrder: Array.isArray(input.sectionOrder) ? input.sectionOrder.filter((item): item is string => typeof item === "string") : [...DEFAULT_DESIGN.sectionOrder],
    addedWidgets: Array.isArray(input.addedWidgets) ? input.addedWidgets : [],
  }
}
