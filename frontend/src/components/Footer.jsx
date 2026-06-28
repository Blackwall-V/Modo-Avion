export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-24 border-t border-ink/10 bg-modo-charcoal text-modo-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tightest">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-modo-orange text-modo-paper">M</span>
            MODO AVIÓN
          </div>
          <p className="mt-3 max-w-md text-sm text-modo-paper/60">
            Tu mejor compañero de aventuras. Equipaje inteligente para quienes
            prefieren la libertad a la fila de embarque.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-modo-paper/40">
            <span className="rounded border border-modo-paper/15 px-2 py-1">Visa</span>
            <span className="rounded border border-modo-paper/15 px-2 py-1">Mastercard</span>
            <span className="rounded border border-modo-paper/15 px-2 py-1">Amex</span>
            <span className="rounded border border-modo-paper/15 px-2 py-1">Webpay</span>
            <span className="rounded border border-modo-paper/15 px-2 py-1">Mercado Pago</span>
            <span className="rounded border border-modo-paper/15 px-2 py-1">Transferencia</span>
          </div>
        </div>

        <div>
          <h4 className="font-mono text-[10px] uppercase tracking-[0.22em] text-modo-paper/40">Contacto</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href="tel:+56995950692" className="text-modo-paper/80 hover:text-modo-orange">
                +56 9 9595 0692
              </a>
            </li>
            <li>
              <a href="mailto:contacto@modoavion.cl" className="text-modo-paper/80 hover:text-modo-orange">
                contacto@modoavion.cl
              </a>
            </li>
            <li className="text-modo-paper/60">Envíos a todo Chile</li>
            <li className="text-modo-paper/60">Despacho 24-48h RM</li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-[10px] uppercase tracking-[0.22em] text-modo-paper/40">Información</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="#" className="text-modo-paper/80 hover:text-modo-orange">Política de envío</a></li>
            <li><a href="#" className="text-modo-paper/80 hover:text-modo-orange">Devoluciones</a></li>
            <li><a href="#" className="text-modo-paper/80 hover:text-modo-orange">Términos y condiciones</a></li>
            <li><a href="#" className="text-modo-paper/80 hover:text-modo-orange">Preguntas frecuentes</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-modo-paper/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-modo-paper/40 sm:flex-row sm:px-6 lg:px-8">
          <p>© {year} MODO AVIÓN. Todos los derechos reservados.</p>
          <p className="font-mono uppercase tracking-wider">Made in Chile · CLT → SCL</p>
        </div>
      </div>
    </footer>
  )
}
