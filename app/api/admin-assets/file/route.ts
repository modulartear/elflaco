import { get } from "@vercel/blob"
import { NextRequest, NextResponse } from "next/server"
import { requireTenantAccess, tenantErrorResponse } from "@/lib/tenant"

export async function GET(request: NextRequest) {
  try {
    const { storeId } = await requireTenantAccess()
    const pathname = request.nextUrl.searchParams.get("pathname")
    if (!pathname || !pathname.startsWith(`store-assets/${storeId}/`)) return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 })
  const result = await get(pathname, { access: "private", ifNoneMatch: request.headers.get("if-none-match") ?? undefined })
  if (!result) return new NextResponse("Not found", { status: 404 })
  if (result.statusCode === 304) return new NextResponse(null, { status: 304, headers: { ETag: result.blob.etag, "Cache-Control": "private, no-cache" } })
    return new NextResponse(result.stream, { headers: { "Content-Type": result.blob.contentType, ETag: result.blob.etag, "Cache-Control": "private, no-cache" } })
  } catch (error) {
    return tenantErrorResponse(error)
  }
}
