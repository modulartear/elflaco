import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { ensureTenantForUser, requireTenantAccess, TenantError } from "@/lib/tenant"

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")
  try {
    await ensureTenantForUser(session.user)
    await requireTenantAccess()
  } catch (error) {
    if (error instanceof TenantError && error.code === "FORBIDDEN") redirect("/forbidden")
    redirect("/sign-in")
  }
  return children
}
