import { put } from "@vercel/blob"
import { NextRequest, NextResponse } from "next/server"

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"])

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get("file")
  if (!(file instanceof File) || !allowedTypes.has(file.type)) {
    return NextResponse.json({ error: "Formato de imagen no válido" }, { status: 400 })
  }
  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: "La imagen no puede superar los 2 MB" }, { status: 400 })
  }
  const kind = formData.get("kind") === "favicon" ? "favicon" : "logo"
  const blob = await put(`store-assets/${kind}-${crypto.randomUUID()}-${file.name}`, file, { access: "private", addRandomSuffix: false })
  return NextResponse.json({ pathname: blob.pathname })
}
