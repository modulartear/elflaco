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
  sectionOrder: ["header", "hero", "products", "categories", "footer"] as string[],
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

  const widgetIds = addedWidgets.map((_, index) => `widget-${index}`)
  return {
    ...DEFAULT_DESIGN,
    ...input,
    sectionOrder: [...sectionOrder, ...widgetIds.filter((id) => !sectionOrder.includes(id))],
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
