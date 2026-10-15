"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export function AuthForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError("")
    const result = mode === "sign-in"
      ? await authClient.signIn.email({ email, password })
      : await authClient.signUp.email({ email, password, name })
    if (result.error) {
      setError("No pudimos validar tus datos. Revisá el email y la contraseña.")
      setPending(false)
      return
    }
    if (mode === "sign-up") {
      const onboarding = await fetch("/api/stores/onboarding", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) })
      if (!onboarding.ok) {
        setError("La cuenta se creó, pero no pudimos preparar tu tienda. Ingresá nuevamente para reintentar.")
        setPending(false)
        return
      }
    }
    router.push("/admin")
    router.refresh()
  }

  return <main className="auth-page"><form className="auth-card" onSubmit={submit}><div className="auth-brand"><div className="shopia-logo" aria-label="SHOPIA">SHOPIA</div></div><p className="auth-eyebrow">Panel de administración</p><h1>{mode === "sign-in" ? "Ingresá a tu cuenta" : "Creá tu cuenta"}</h1><p className="auth-subtitle">Gestioná tu catálogo, pedidos y tienda desde un solo lugar.</p>{mode === "sign-up" && <label>Nombre<input required value={name} onChange={(event) => setName(event.target.value)} /></label>}<label>Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Contraseña<input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>{error && <p className="auth-error" role="alert">{error}</p>}<button className="auth-submit" disabled={pending}>{pending ? "Validando..." : mode === "sign-in" ? "Ingresar" : "Crear cuenta"}</button><button className="auth-switch" type="button" onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}>{mode === "sign-in" ? "Todavía no tengo una cuenta" : "Ya tengo una cuenta"}</button><p className="auth-powered">Creado y potenciado por <strong>Disearte</strong></p></form></main>
}
