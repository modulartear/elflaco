import type { PageDocument, Template, Theme } from "./types";

export const starterTemplate: Template = { id: "starter-store", name: "Tienda inicial", description: "Encabezado, banner, categorías, productos y pie de página.", allowedSections: ["header", "hero", "categories", "featured-products", "footer"], maxSections: 12, initialSections: [
  { id: "header-main", type: "header", visible: true, settings: {}, blocks: [] },
  { id: "hero-main", type: "hero", visible: true, settings: {}, blocks: [] },
  { id: "categories-main", type: "categories", visible: true, settings: {}, blocks: [{ id: "cat-1", type: "category", props: { label: "Repuestos" } }, { id: "cat-2", type: "category", props: { label: "Indumentaria" } }, { id: "cat-3", type: "category", props: { label: "Cascos" } }] },
  { id: "products-main", type: "featured-products", visible: true, settings: {}, blocks: [] },
  { id: "footer-main", type: "footer", visible: true, settings: {}, blocks: [] },
] };

export const editorialTemplate: Template = { id: "editorial-store", name: "Editorial", description: "Una portada enfocada en campañas y productos.", allowedSections: ["header", "hero", "featured-products", "footer"], maxSections: 8, initialSections: [
  { id: "editorial-header", type: "header", visible: true, settings: { brand: "EL FLACO / EDITORIAL" }, blocks: [] },
  { id: "editorial-hero", type: "hero", visible: true, settings: { title: "Equipá tu próxima aventura" }, blocks: [] },
  { id: "editorial-products", type: "featured-products", visible: true, settings: { title: "Selección de temporada" }, blocks: [] },
  { id: "editorial-footer", type: "footer", visible: true, settings: {}, blocks: [] },
] };

export const themePresets: Theme[] = [{ id: "elflaco-default", name: "El Flaco", styles: { colors: { primary: "#42b85a", secondary: "#f4c400", surface: "#ffffff", text: "#20252a", muted: "#8a9098" }, typography: { headingFont: "Arial", bodyFont: "Arial", baseSize: 16 }, buttons: { radius: 5, textTransform: "none", style: "solid" }, contentWidth: 1180, spacing: { section: 64, block: 24 } }, templates: [starterTemplate, editorialTemplate] }];

export const demoPage: PageDocument = { slug: "home", title: "Inicio", templateId: starterTemplate.id, themeId: "elflaco-default", sections: starterTemplate.initialSections };
