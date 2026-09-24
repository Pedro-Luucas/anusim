# CLAUDE.md — Anussim Brasil Criciúma

> Projeto: site/landing page da Sinagoga Anussim Brasil Criciúma (SC).
> Usuário: Pedro Lucas (pedro-luucas). Mantém o site da comunidade.

## Stack

- **Next.js 16.1.6** com App Router e Turbopack
- **React 19.2**
- **TypeScript 5**
- **Tailwind CSS 4** (config via `@theme` em `globals.css`, não tem `tailwind.config.js`)
- Fontes via `next/font/google`: Cormorant Garamond (display), Frank Ruhl Libre (hebraico), Inter (corpo)
- Sem dependências extras (zero libs de UI/animação) — tudo é React + Tailwind + SVG inline

## Estrutura de pastas

```
src/
├── app/
│   ├── layout.tsx              # root: fontes + metadata SEO
│   ├── globals.css             # @theme tokens (paleta dourado/cream), animações
│   ├── page.tsx                # HOME landing (visual-first)
│   ├── bnei-anusim/page.tsx    # O que são os Bnei Anusim (text-heavy editorial)
│   ├── fotos/page.tsx          # Galeria interativa (3 álbuns)
│   ├── pontos-de-fe/page.tsx   # 6 pilares da fé
│   ├── contato/page.tsx        # WhatsApp rabino + endereço + mapa + YouTube
│   ├── pages/
│   │   ├── calendario/page.tsx # calendário judaico (mantido intacto)
│   │   ├── login/page.tsx
│   │   └── sample/page.tsx
│   └── api/sample/route.ts
├── components/
│   ├── header.tsx              # header original (página calendário) — INTACTO
│   ├── zmanim-section.tsx      # INTACTO
│   ├── landing/                # NOVO: componentes da landing
│   │   ├── site-header.tsx     # header sticky com nav completa + WhatsApp CTA
│   │   ├── site-footer.tsx     # footer editorial
│   │   └── judaic-symbols.tsx  # SVGs: Estrela de Davi, Menorá, Shofar, Romã, Selo
│   ├── lib/
│   │   ├── hebcal.ts           # integração Hebcal API (calendário judaico)
│   │   └── quotes.ts           # frases do dia
└── ...

public/
├── logo.jpg                    # logo Anussim Brasil
├── shulphotos/                 # 30 fotos reais (comunidade, pessach, rabino)
│   ├── comunidade0..9.jpg
│   ├── pessach0..9.jpg
│   └── rabino0..6.jpg
```

## Identidade visual (paleta + tipografia)

**Paleta — branca + dourado champagne, SEM dark mode, SEM preto de fundo.**

| Token | Hex | Uso |
|---|---|---|
| `cream-50` | `#fdfbf5` | cards |
| `cream-100` | `#faf6ef` | **fundo da página** |
| `cream-200` | `#f3ead7` | hover suave |
| `gold-100` | `#faedc3` | highlights claros |
| `gold-300` | `#ecc660` | bordas hover |
| `gold-500` | `#c9a253` | **dourado principal (brand)** |
| `gold-600` | `#a8842f` | dourado profundo |
| `gold-700` | `#806323` | hover/texto sobre cream |
| `ink-500` | `#6b5a3a` | texto secundário |
| `ink-700` | `#3a2f1c` | texto terciário |
| `ink-900` | `#2a2418` | **texto principal** |
| `wine-500` | `#8b2742` | raramente, só pra destaques |

Único uso de preto/preto-escuro é em CTAs específicos (`bg-ink-900` no botão WhatsApp da home).

**Tipografia:**
- **Display:** Cormorant Garamond 400/500/600/700 + italic. Variável CSS `--font-cormorant`. Use classe `font-display`.
- **Hebraico:** Frank Ruhl Libre 400/500/700/900 (subsets hebrew + latin). Variável `--font-frank-ruhl`. Use `font-hebrew` + `dir="rtl"`.
- **Corpo:** Inter 400. Variável `--font-inter`. Default do `<body>`.

**Classes utilitárias importantes** (definidas em `globals.css`):
- `text-gold-shimmer` — gradient text dourado
- `divider-gold` — linha fina com fade nas pontas
- `bg-parchment` — fundo creme com radial gradients dourados sutis
- `bg-judaic-pattern` — padrão geométrico judaico sutil (losangos)
- `eyebrow` — label editorial (`uppercase tracking-[0.32em]`)
- `display-xl` — heading display gigante
- `hebrew-ornament` — caractere hebraico grande decorativo
- `reveal` + `.is-visible` — animação de scroll reveal
- `stagger > *` — animação escalonada (8 filhos)
- `animate-fade-up`, `animate-float`, `animate-glow`

## Conteúdo editorial — pontos críticos

**Sinagoga (Anussim Brasil Criciúma):**
- Rabino: **Malachy Ben Israel**
- WhatsApp/telefone: **+55 48 9923-1358**
- Endereço: **R. Joaquim Nabuco, 140 — Centro, Criciúma, SC — 88802-200**
- Instagram: https://www.instagram.com/anussimbrasilcriciuma/
- YouTube principal: https://www.youtube.com/channel/UCCdlGqSr1iLFvxQ3jKxE0gA
- YouTube streams: https://www.youtube.com/@anussimbrasilcriciuma5648/streams
- Google Maps: `https://www.google.com/maps?q=R.+Joaquim+Nabuco,+140+-+Centro,+Crici%C3%BAma+-+SC,+88802-200`

**Horários:**
- Kabalat Shabat: sexta 19h
- Shacharit: sábado 9h

**Diretrizes editoriais:**
- O WhatsApp é o canal **oficial** para agendar visita — sempre pré-preencher a mensagem com "Shalom Rabino Malachy!..."
- Hebraico deve ser renderizado com Frank Ruhl Libre em `dir="rtl"` (ex: שָׁלוֹם, שַׁבָּת, תּוֹרָה, פֶּסַח, קְהִלָּה)
- A comunidade é Bnei Anusim (não conversos) — preservar isso no texto
- Fotos em `public/shulphotos/` são reais da comunidade — usar com parcimônia, sempre com `alt` descritivo

## Comandos

```bash
npm run dev      # dev server (Turbopack)
npm run build    # build de produção (Turbopack)
npm run start    # serve produção na porta 3000
npm run lint     # ESLint
```

## Padrões que devem ser mantidos

1. **Componentes da landing** ficam em `src/components/landing/`. Componentes originais do calendário ficam em `src/components/`.
2. **Header da landing é separado do header do calendário** — não mesclar. `Header` (em `src/components/header.tsx`) é usado SÓ na página `/pages/calendario/`. Páginas da landing usam `SiteHeader` (de `src/components/landing/site-header.tsx`).
3. **Footer da landing** também é separado. Cada landing tem `SiteHeader` + `SiteFooter`.
4. **Página `/pages/calendario/` NÃO PODE ser quebrada** — integração Hebcal funciona, é sensível. Em mudanças no `layout.tsx` global, sempre testar build pra garantir.
5. **Estética: branco + dourado, NUNCA dark mode** — usuário foi explícito sobre isso.
6. **Backgrounds:** usar `bg-parchment` na home, `bg-cream-50` em seções/cards. Não usar `bg-white` puro (quebra o calor).
7. **Hebreu sempre com `dir="rtl"` + `font-hebrew`.**
8. **CTA WhatsApp** sempre presente no header sticky E em seção dedicada.
9. **Imagens:** sempre `<Image>` do Next, com `alt` descritivo. Para fotos do shul, usar `priority` só na hero.
10. **Animações:** preferir CSS-only (já temos `stagger`, `animate-fade-up`, etc). Não adicionar libs.

## Onde mexer vs. não mexer

**MEXA LIVRE:**
- `src/app/page.tsx`, `bnei-anusim/`, `fotos/`, `pontos-de-fe/`, `contato/`
- `src/components/landing/`
- `src/app/globals.css` (mas mantenha tokens compatíveis)

**NÃO MEXA sem necessidade explícita:**
- `src/components/header.tsx` (header do calendário)
- `src/components/zmanim-section.tsx`
- `src/app/pages/calendario/page.tsx`
- `src/lib/hebcal.ts`
- `src/lib/quotes.ts`
- `src/app/api/sample/route.ts`
- `public/logo.jpg` e `public/shulphotos/*`

## Tasks concluídas nesta sessão

- Landing page 5 rotas (home, bnei-anusim, fotos, pontos-de-fe, contato)
- Paleta branca + dourado champagne + tipografia Cormorant/Frank Ruhl/Inter
- Embed YouTube (live + canal), mapa Google Maps, CTA WhatsApp pré-preenchido
- Galeria interativa com switcher de álbuns
- Build limpo (23.1s, 11 páginas estáticas, zero erros TS)
- Smoke test 200 OK em todas as 5 rotas da landing