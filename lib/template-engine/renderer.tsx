import type { Block, ComponentRenderContext, PageDocument, Theme } from "./types";
import { getComponent } from "./registry";
import { validatePageDocument } from "./validation";

export function renderPageDocument(document: PageDocument, theme: Theme) {
  const template = theme.templates.find((item) => item.id === document.templateId);
  const validation = validatePageDocument(document, new Map(Array.from(["header", "hero", "categories", "featured-products", "footer"].map((type) => [type, getComponent(type)!]))), template);
  if (!validation.success) throw new Error(`Página inválida: ${validation.issues.map((issue) => `${issue.path}: ${issue.message}`).join("; ")}`);
  const context: ComponentRenderContext = { theme: theme.styles };
  return document.sections.filter((section) => section.visible).map((section) => {
    const registered = getComponent(section.type);
    if (!registered) return null;
    const props = { ...Object.fromEntries(Object.entries(registered.settings).map(([key, schema]) => [key, schema.defaultValue])), ...section.settings };
    return <div key={section.id} data-section-id={section.id} data-section-type={section.type}>{registered.render(props, (section.blocks || []) as Block[], context)}</div>;
  });
}
