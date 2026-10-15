"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!token) { setError("El enlace de recuperación no es válido o ya venció."); return }
    setPending(true)
    setError("")
    const result = await authClient.resetPassword({ newPassword: password, token })
    if (result.error) setError("El enlace no es válido o ya venció. Solicitá uno nuevo.")
    else setMessage("Tu contraseña fue actualizada correctamente.")
    setPending(false)
  }

  return <main className="auth-page"><form className="auth-card" onSubmit={submit}><div className="auth-brand"><div className="shopia-logo">SHOPIA</div></div><p className="auth-eyebrow">Recuperación de acceso</p><h1>Nueva contraseña</h1><p className="auth-subtitle">Elegí una contraseña segura para tu cuenta.</p><label>Contraseña<input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>{error && <p className="auth-error" role="alert">{error}</p>}{message && <p className="auth-success" role="status">{message}</p>}{message ? <Link className="auth-switch" href="/sign-in">Ingresar a mi cuenta</Link> : <button className="auth-submit" disabled={pending}>{pending ? "Guardando..." : "Guardar contraseña"}</button>}<p className="auth-powered">Creado y potenciado por <strong>Disearte</strong></p></form></main>
}
