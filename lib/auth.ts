import { betterAuth } from "better-auth"
import { Pool } from "pg"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const resendFrom = process.env.RESEND_EMAIL_DOMAIN
  ? `SHOPIA <no-reply@${process.env.RESEND_EMAIL_DOMAIN}>`
  : "SHOPIA <onboarding@resend.dev>"

const baseURL = process.env.BETTER_AUTH_URL
  ? process.env.BETTER_AUTH_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.V0_RUNTIME_URL

const trustedOrigins = [
  "http://localhost:3000",
  process.env.V0_RUNTIME_URL,
  process.env.V0_DEV_APP_URL,
  process.env.V0_BUILD_URL,
  process.env.V0_SANDBOX_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined,
].filter((origin): origin is string => Boolean(origin))

export const auth = betterAuth({
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  baseURL,
  trustedOrigins,
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      const { error } = await resend.emails.send(
        {
          from: resendFrom,
          to: [user.email],
          subject: "Restablecé tu contraseña de SHOPIA",
          html: `<p>Hola ${user.name || ""},</p><p>Recibimos una solicitud para restablecer tu contraseña.</p><p><a href="${url}">Elegí una nueva contraseña</a></p><p>Este enlace vence en una hora. Si no realizaste esta solicitud, podés ignorar este correo.</p>`,
        },
        { idempotencyKey: `password-reset/${user.id}/${url}` },
      )
      if (error) {
        console.error("[v0] Password reset email failed:", error.message)
        throw error
      }
    },
  },
  ...(process.env.NODE_ENV === "development"
    ? {
        advanced: {
          defaultCookieAttributes: {
            sameSite: "none" as const,
            secure: true,
          },
        },
      }
    : {}),
})
