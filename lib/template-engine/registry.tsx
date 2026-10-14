import type { Block, RegisteredComponent, SettingValue } from "./types";

const text = (label: string, defaultValue: string) => ({ type: "text" as const, label, defaultValue });

const component = (type: string, settings: RegisteredComponent["settings"], render: RegisteredComponent["render"], allowsBlocks = false): RegisteredComponent => ({ type, settings, render, allowsBlocks });

export const componentRegistry = new Map<string, RegisteredComponent>([
  ["header", component("header", { brand: text("Marca", "EL FLACO MOTOS"), navLabel: text("Navegación", "Productos · Ofertas · Contacto") }, (props) => <header className="template-header"><strong>{String(props.brand)}</strong><nav>{String(props.navLabel)}</nav></header>)],
  ["hero", component("hero", { eyebrow: text("Etiqueta", "EL FLACO MOTOS"), title: text("Título", "ENCONTRÁ TODO PARA TU MOTO"), cta: text("Botón", "Ver productos"), background: { type: "color", label: "Fondo", defaultValue: "#252a2d" } }, (props) => <section className="template-hero" style={{ background: String(props.background) }}><span>{String(props.eyebrow)}</span><h1>{String(props.title)}</h1><button>{String(props.cta)}</button></section>)],
  ["categories", component("categories", { title: text("Título", "Categorías") }, (props, blocks) => <section className="template-section"><h2>{String(props.title)}</h2><div className="template-category-grid">{blocks.map((block) => <article key={block.id}><strong>{String(block.props.label || "Categoría")}</strong></article>)}</div></section>, true)],
  ["featured-products", component("featured-products", { title: text("Título", "Productos destacados"), source: { type: "select", label: "Fuente", defaultValue: "featured", options: [{ label: "Destacados", value: "featured" }, { label: "Novedades", value: "new" }] } }, (props) => <section className="template-section"><h2>{String(props.title)}</h2><div className="template-product-grid"><article /><article /><article /></div></section>)],
  ["footer", component("footer", { brand: text("Marca", "El Flaco Motos"), text: text("Descripción", "Calidad y confianza para tu moto") }, (props) => <footer className="template-footer"><strong>{String(props.brand)}</strong><span>{String(props.text)}</span></footer>)],
]);

export function getComponent(type: string) { return componentRegistry.get(type); }
export function defaultProps(type: string): Record<string, SettingValue> { const item = componentRegistry.get(type); return item ? Object.fromEntries(Object.entries(item.settings).map(([key, schema]) => [key, schema.defaultValue])) : {}; }
