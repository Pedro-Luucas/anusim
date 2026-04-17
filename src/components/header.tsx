import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-primary-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-700 text-sm font-bold text-white">
            א
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-tight text-primary-700">
              Anusim Brasil
            </span>
            <span className="text-xs leading-tight text-neutral-500">
              Criciúma
            </span>
          </div>
        </Link>

        <Link
          href="/pages/calendario"
          className="min-h-[44px] rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600 active:bg-primary-800 flex items-center justify-center gap-2"
        >
          <span aria-hidden="true">📅</span>
          Calendário
        </Link>
      </div>
    </header>
  )
}
