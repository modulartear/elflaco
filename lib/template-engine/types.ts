import type { ReactNode } from "react";

export type Primitive = string | number | boolean;
export type SettingValue = Primitive | string[] | Record<string, unknown>;

export type SettingType = "text" | "textarea" | "number" | "color" | "image" | "url" | "boolean" | "select" | "spacing";

export type SettingSchema = {
  type: SettingType;
  label: string;
  defaultValue: SettingValue;
  options?: Array<{ label: string; value: string }>;
  min?: number;
  max?: number;
  required?: boolean;
};

export type ThemeStyles = {
  colors: { primary: string; secondary: string; surface: string; text: string; muted: string };
  typography: { headingFont: string; bodyFont: string; baseSize: number };
  buttons: { radius: number; textTransform: "none" | "uppercase"; style: "solid" | "outline" };
  contentWidth: number;
  spacing: { section: number; block: number };
};

export type Widget = { id: string; type: string; props: Record<string, SettingValue>; visible?: boolean };
export type Block = Widget & { blocks?: Block[] };
export type Section = { id: string; type: string; visible: boolean; settings: Record<string, SettingValue>; blocks?: Block[] };
export type Template = { id: string; name: string; description: string; initialSections: Section[]; allowedSections: string[]; maxSections?: number };
export type Theme = { id: string; name: string; styles: ThemeStyles; templates: Template[] };
export type Page = { id: string; storeId: string; slug: string; title: string; templateId: string; themeId: string; sections: Section[]; status: "draft" | "published" };
export type PageRevision = { id: string; pageId: string; version: number; document: Page; createdAt: string; createdBy: string };

export type ComponentRenderContext = { theme: ThemeStyles; resolveData?: (source: string) => unknown };
export type RegisteredComponent = { type: string; settings: Record<string, SettingSchema>; allowsBlocks?: boolean; render: (props: Record<string, SettingValue>, blocks: Block[], context: ComponentRenderContext) => ReactNode };
export type PageDocument = Pick<Page, "slug" | "title" | "templateId" | "themeId" | "sections">;
