import { renderPageDocument } from "@/lib/template-engine/renderer";
import { demoPage, themePresets } from "@/lib/template-engine/templates";
import "./template-demo.css";

export default function TemplateDemoPage() {
  const theme = themePresets[0];
  return <main className="template-demo" style={{ "--template-primary": theme.styles.colors.primary, "--template-secondary": theme.styles.colors.secondary } as React.CSSProperties}>{renderPageDocument(demoPage, theme)}</main>;
}
