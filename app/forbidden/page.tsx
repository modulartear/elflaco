import Link from "next/link"

export default function ForbiddenPage() {
  return <main className="auth-page"><section className="auth-card"><p className="auth-eyebrow">Acceso restringido</p><h1>No tenés una tienda asignada</h1><p className="auth-subtitle">Tu cuenta existe, pero todavía no pertenece a ninguna tienda. Contactá al administrador para recibir acceso.</p><Link className="auth-submit" href="/sign-in">Volver al inicio de sesión</Link></section></main>
}
