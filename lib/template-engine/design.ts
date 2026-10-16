export const DESIGN_SECTION_IDS = ["header", "hero", "products", "categories", "footer"] as const

export type DesignSectionId = (typeof DESIGN_SECTION_IDS)[number]

export type DesignWidget = {
  id?: string
  type?: string
  title?: string
  text?: string
  visible?: boolean
}

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
  sectionOrder: ["header", "hero", "products", "footer"] as string[],
  addedWidgets: [] as DesignWidget[],
} as const

export type StoreDesign = {
  brandColor: string
  headingFont: string
  bodyFont: string
  borderStyle: string
  headerMessage: string
  headerLink: string
  logoPath: string
  faviconPath: string
  heroTitle: string
  headerTitle: string
  productsTitle: string
  footerText: string
  sectionOrder: string[]
  addedWidgets: DesignWidget[]
}

export function normalizeDesign(value: unknown): StoreDesign {
  const input = value && typeof value === "object" ? value as Record<string, unknown> : {}
  const sectionOrder = Array.isArray(input.sectionOrder)
    ? input.sectionOrder.filter((item): item is string => typeof item === "string")
    : [...DEFAULT_DESIGN.sectionOrder]
  const addedWidgets = Array.isArray(input.addedWidgets)
    ? input.addedWidgets.filter((item): item is DesignWidget => Boolean(item && typeof item === "object"))
    : []

  return {
    brandColor: typeof input.brandColor === "string" ? input.brandColor : DEFAULT_DESIGN.brandColor,
    headingFont: typeof input.headingFont === "string" ? input.headingFont : DEFAULT_DESIGN.headingFont,
    bodyFont: typeof input.bodyFont === "string" ? input.bodyFont : DEFAULT_DESIGN.bodyFont,
    borderStyle: typeof input.borderStyle === "string" ? input.borderStyle : DEFAULT_DESIGN.borderStyle,
    headerMessage: typeof input.headerMessage === "string" ? input.headerMessage : DEFAULT_DESIGN.headerMessage,
    headerLink: typeof input.headerLink === "string" ? input.headerLink : DEFAULT_DESIGN.headerLink,
    logoPath: typeof input.logoPath === "string" ? input.logoPath : DEFAULT_DESIGN.logoPath,
    faviconPath: typeof input.faviconPath === "string" ? input.faviconPath : DEFAULT_DESIGN.faviconPath,
    heroTitle: typeof input.heroTitle === "string" ? input.heroTitle : DEFAULT_DESIGN.heroTitle,
    headerTitle: typeof input.headerTitle === "string" ? input.headerTitle : DEFAULT_DESIGN.headerTitle,
    productsTitle: typeof input.productsTitle === "string" ? input.productsTitle : DEFAULT_DESIGN.productsTitle,
    footerText: typeof input.footerText === "string" ? input.footerText : DEFAULT_DESIGN.footerText,
    sectionOrder,
    addedWidgets,
  }
}

export function isSectionVisible(design: StoreDesign, sectionId: string) {
  return design.sectionOrder.includes(sectionId)
}

export function getSectionOrder(design: StoreDesign, sectionId: string) {
  const index = design.sectionOrder.indexOf(sectionId)
  return index === -1 ? design.sectionOrder.length : index
}
