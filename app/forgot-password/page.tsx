"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError("")
    setMessage("")
    const result = await authClient.requestPasswordReset({ email, redirectTo: `${window.location.origin}/reset-password` })
    if (result.error) setError("No pudimos procesar la solicitud. Revisá el email e intentá nuevamente.")
    else setMessage("Si existe una cuenta con ese email, recibirás un enlace para restablecer la contraseña.")
    setPending(false)
  }

  return <main className="auth-page"><form className="auth-card" onSubmit={submit}><div className="auth-brand"><div className="shopia-logo">SHOPIA</div></div><p className="auth-eyebrow">Recuperación de acceso</p><h1>Restablecé tu contraseña</h1><p className="auth-subtitle">Te enviaremos un enlace seguro a tu correo.</p><label>Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>{error && <p className="auth-error" role="alert">{error}</p>}{message && <p className="auth-success" role="status">{message}</p>}<button className="auth-submit" disabled={pending}>{pending ? "Enviando..." : "Enviar enlace"}</button><Link className="auth-switch" href="/sign-in">Volver al inicio de sesión</Link><p className="auth-powered">Creado y potenciado por <strong>Disearte</strong></p></form></main>
}
