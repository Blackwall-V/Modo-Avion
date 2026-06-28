export default function Contacto() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/40">Contacto</span>
      <h1 className="mt-2 font-display text-5xl font-extrabold leading-[0.95] tracking-tightest text-ink">
        Estamos en la <span className="text-modo-orange">torre de control.</span>
      </h1>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Card title="WhatsApp" value="+56 9 9595 0692" href="https://wa.me/56995950692" />
        <Card title="Email" value="contacto@modoavion.cl" href="mailto:contacto@modoavion.cl" />
        <Card title="Despachos" value="Envíos a todo Chile" />
        <Card title="Tiempo de respuesta" value="Menos de 24h hábiles" />
      </div>
    </div>
  )
}

function Card({ title, value, href }) {
  const Body = (
    <>
      <span className="font-mono text-[10px] uppercase tracking-wider text-ink/40">{title}</span>
      <p className="mt-1 font-display text-2xl font-bold tracking-tightest text-ink">{value}</p>
    </>
  )
  return href ? (
    <a href={href} className="rounded-2xl border border-ink/10 bg-white p-6 transition-colors hover:border-ink">{Body}</a>
  ) : (
    <div className="rounded-2xl border border-ink/10 bg-white p-6">{Body}</div>
  )
}
