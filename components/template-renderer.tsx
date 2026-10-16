import type { ReactNode } from "react"
import type { StoreDesign, DesignWidget } from "@/lib/template-engine/design"

type TemplateRendererProps = {
  design: StoreDesign
  renderSection: (sectionId: string) => ReactNode
  renderWidget?: (widget: DesignWidget, index: number) => ReactNode
}

export function TemplateRenderer({ design, renderSection, renderWidget }: TemplateRendererProps) {
  const sections = design.sectionOrder.map((sectionId) => {
    if (sectionId.startsWith("widget-") && renderWidget) {
      const index = Number(sectionId.replace("widget-", ""))
      const widget = design.addedWidgets[index]
      return widget ? <div key={sectionId} data-template-section={sectionId}>{renderWidget(widget, index)}</div> : null
    }

    return <div key={sectionId} data-template-section={sectionId}>{renderSection(sectionId)}</div>
  })

  return <>{sections}</>
}
