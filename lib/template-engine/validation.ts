import type { PageDocument, RegisteredComponent, Section, SettingSchema, SettingValue, Template } from "./types";

export type ValidationIssue = { path: string; message: string };
export type ValidationResult<T> = { success: true; data: T; issues: [] } | { success: false; data: null; issues: ValidationIssue[] };

function isSettingValue(value: unknown): value is SettingValue {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean" || Array.isArray(value) || (!!value && typeof value === "object");
}

function validateSetting(value: unknown, schema: SettingSchema, path: string, issues: ValidationIssue[]) {
  if (value === undefined) {
    if (schema.required) issues.push({ path, message: `${schema.label} es obligatorio` });
    return;
  }
  if (!isSettingValue(value)) { issues.push({ path, message: "El valor no es válido" }); return; }
  if (schema.type === "number" && typeof value !== "number") issues.push({ path, message: "Debe ser un número" });
  if (["text", "textarea", "color", "image", "url", "select"].includes(schema.type) && typeof value !== "string") issues.push({ path, message: "Debe ser texto" });
  if (schema.type === "boolean" && typeof value !== "boolean") issues.push({ path, message: "Debe ser booleano" });
  if (schema.type === "number" && typeof value === "number" && schema.min !== undefined && value < schema.min) issues.push({ path, message: `Debe ser mayor o igual a ${schema.min}` });
  if (schema.type === "number" && typeof value === "number" && schema.max !== undefined && value > schema.max) issues.push({ path, message: `Debe ser menor o igual a ${schema.max}` });
  if (schema.options && typeof value === "string" && !schema.options.some((option) => option.value === value)) issues.push({ path, message: "La opción no está permitida" });
}

export function validateSection(section: unknown, registry: Map<string, RegisteredComponent>, path = "sections[0]"): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!section || typeof section !== "object") return [{ path, message: "La sección debe ser un objeto" }];
  const candidate = section as Partial<Section>;
  if (typeof candidate.id !== "string" || !candidate.id) issues.push({ path: `${path}.id`, message: "El identificador es obligatorio" });
  if (typeof candidate.type !== "string") return [...issues, { path: `${path}.type`, message: "El tipo es obligatorio" }];
  const component = registry.get(candidate.type);
  if (!component) issues.push({ path: `${path}.type`, message: `Componente desconocido: ${candidate.type}` });
  if (typeof candidate.visible !== "boolean") issues.push({ path: `${path}.visible`, message: "visible debe ser booleano" });
  if (!candidate.settings || typeof candidate.settings !== "object") issues.push({ path: `${path}.settings`, message: "settings debe ser un objeto" });
  if (component && candidate.settings) Object.entries(component.settings).forEach(([key, schema]) => validateSetting((candidate.settings as Record<string, unknown>)[key], schema, `${path}.settings.${key}`, issues));
  if (candidate.blocks && candidate.blocks.length > 0) {
    if (!component?.allowsBlocks) issues.push({ path: `${path}.blocks`, message: "Este componente no admite bloques" });
    candidate.blocks.forEach((block, index) => {
      if (!block.id || !block.type) issues.push({ path: `${path}.blocks[${index}]`, message: "Cada bloque necesita id y type" });
    });
  }
  return issues;
}

export function validatePageDocument(document: unknown, registry: Map<string, RegisteredComponent>, template?: Template): ValidationResult<PageDocument> {
  const issues: ValidationIssue[] = [];
  if (!document || typeof document !== "object") return { success: false, data: null, issues: [{ path: "document", message: "El documento debe ser un objeto" }] };
  const candidate = document as Partial<PageDocument>;
  for (const field of ["slug", "title", "templateId", "themeId"] as const) if (typeof candidate[field] !== "string" || !candidate[field]) issues.push({ path: field, message: "El campo es obligatorio" });
  if (!Array.isArray(candidate.sections)) issues.push({ path: "sections", message: "sections debe ser un array" });
  else {
    const ids = new Set<string>();
    candidate.sections.forEach((section, index) => {
      const sectionIssues = validateSection(section, registry, `sections[${index}]`);
      issues.push(...sectionIssues);
      const id = (section as Section).id;
      if (id && ids.has(id)) issues.push({ path: `sections[${index}].id`, message: "El id de sección debe ser único" });
      if (id) ids.add(id);
      if (template && !template.allowedSections.includes((section as Section).type)) issues.push({ path: `sections[${index}].type`, message: "La sección no está permitida por la plantilla" });
    });
    if (template?.maxSections && candidate.sections.length > template.maxSections) issues.push({ path: "sections", message: "La plantilla alcanzó su máximo de secciones" });
  }
  return issues.length ? { success: false, data: null, issues } : { success: true, data: candidate as PageDocument, issues: [] };
}
