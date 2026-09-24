import Link from "next/link"
import Image from "next/image"

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative mt-32 border-t border-gold-200/60 bg-cream-50">
      <div className="absolute inset-x-0 top-0 h-px divider-gold" />
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-20">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.jpg"
                alt="Anussim Brasil"
                width={56}
                height={56}
                className="h-14 w-14 rounded-full ring-1 ring-gold-500/40 object-cover"
              />
              <div>
                <p className="font-display text-2xl font-medium text-ink-900">
                  Anussim <span className="text-gold-600">Brasil</span>
                </p>
                <p className="text-xs uppercase tracking-[0.32em] text-ink-500">
                  Criciúma · SC
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-md font-display text-lg italic leading-relaxed text-ink-700">
              &ldquo;A casa dos Bnei Anusim no Sul do Brasil: onde a chama que
              sobreviveu em silêncio voltou a queimar abertamente.&rdquo;
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://www.instagram.com/anussimbrasilcriciuma/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-gold-300 bg-cream-50 text-gold-700 transition-all hover:border-gold-500 hover:bg-gold-500 hover:text-cream-50"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/channel/UCCdlGqSr1iLFvxQ3jKxE0gA"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-gold-300 bg-cream-50 text-gold-700 transition-all hover:border-gold-500 hover:bg-gold-500 hover:text-cream-50"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M23 7.3a3 3 0 0 0-2.1-2.1C19 4.7 12 4.7 12 4.7s-7 0-8.9.5A3 3 0 0 0 1 7.3 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.7a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23.5 12 31 31 0 0 0 23 7.3zM9.8 15.5v-7l5.8 3.5-5.8 3.5z" />
                </svg>
              </a>
              <a
                href="https://wa.me/554899231358"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-gold-300 bg-cream-50 text-gold-700 transition-all hover:border-gold-500 hover:bg-gold-500 hover:text-cream-50"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="eyebrow">Navegar</h4>
            <ul className="mt-5 space-y-3 text-sm text-ink-700">
              <li><Link href="/bnei-anusim" className="hover:text-gold-700 transition-colors">O que são os Bnei Anusim</Link></li>
              <li><Link href="/agenda" className="hover:text-gold-700 transition-colors">Agenda de serviços</Link></li>
              <li><Link href="/fotos" className="hover:text-gold-700 transition-colors">Fotos da comunidade</Link></li>
              <li><Link href="/pontos-de-fe" className="hover:text-gold-700 transition-colors">Pontos de fé</Link></li>
              <li><Link href="/contato" className="hover:text-gold-700 transition-colors">Contato e serviços</Link></li>
              <li><Link href="/calendario" className="hover:text-gold-700 transition-colors">Calendário judaico</Link></li>
              <li><Link href="/doacoes" className="hover:text-gold-700 transition-colors">Doações</Link></li>
              <li><Link href="/perguntas-frequentes" className="hover:text-gold-700 transition-colors">Perguntas frequentes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="eyebrow">Endereço</h4>
            <p className="mt-5 text-sm leading-relaxed text-ink-700">
              R. Joaquim Nabuco, 140<br />
              Centro, Criciúma, SC<br />
              88802-200
            </p>
            <p className="mt-5 text-sm leading-relaxed text-ink-700">
              <a href="tel:+554899231358" className="hover:text-gold-700 transition-colors">+55 48 9923-1358</a>
              <br />
              <span className="text-xs text-ink-500">Rabino Malachy Ben Israel</span>
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-gold-200/60 pt-8 text-xs text-ink-500 md:flex-row md:items-center">
          <p>© {year} Anussim Brasil Criciúma. Todos os direitos reservados.</p>
          <p className="font-hebrew text-base text-gold-600" dir="rtl">
            שָׁלוֹם עֲלֵיכֶם
          </p>
        </div>
      </div>
    </footer>
  )
}