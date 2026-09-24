# Sistema de Membros — Anussim Brasil

Sistema completo de gerenciamento de membros, avisos, materiais, agenda semanal e eventos para a Sinagoga Anussim Brasil Criciúma.

## 🏗️ Stack

- **Next.js 16** com App Router
- **Supabase** para autenticação e banco de dados PostgreSQL
- **TypeScript** com types gerados do schema
- **Tailwind CSS v4** para estilização

## 📦 Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Anote a **URL do projeto** e as chaves **anon** e **service_role** (em Settings → API)

### 3. Configurar variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://seuprojetoaqui.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Importante:** A chave `SUPABASE_SERVICE_ROLE_KEY` é sensível e nunca deve ser exposta no cliente. Ela é usada apenas no servidor para operações administrativas.

### 4. Rodar migrations no Supabase

No painel do Supabase, vá em **SQL Editor** e execute **cada migration** na ordem:

1. `supabase/migrations/20260924000001_create_profiles.sql`
2. `supabase/migrations/20260924000002_create_announcements.sql`
3. `supabase/migrations/20260924000003_create_materials.sql`
4. `supabase/migrations/20260924000004_create_weekly_agenda.sql`
5. `supabase/migrations/20260924000005_create_events.sql`

Ou use a [CLI do Supabase](https://supabase.com/docs/guides/cli):

```bash
npx supabase db push
```

### 5. Configurar Authentication no Supabase

1. No painel do Supabase, vá em **Authentication → URL Configuration**
2. Adicione a URL do seu site em **Redirect URLs**:
   - Desenvolvimento: `http://localhost:3000/auth/callback`
   - Produção: `https://seudominio.com/auth/callback`

3. Habilite provedores de autenticação desejados:
   - **Email/Password**: já habilitado por padrão
   - **Magic Link**: configure em **Authentication → Providers → Email**

### 6. Definir o primeiro admin

Execute este SQL no **SQL Editor** do Supabase, substituindo `email@do-admin.com` pelo e-mail do primeiro administrador:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'email@do-admin.com';
```

## 🚀 Rodar localmente

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 🏗️ Build

O projeto **deve buildar sem erros mesmo sem variáveis de ambiente** configuradas. As páginas públicas permanecerão estáticas:

```bash
npm run build
```

## 📁 Estrutura do projeto

```
src/
├── app/
│   ├── entrar/           # Página de login
│   ├── auth/callback/    # Callback OAuth/magic link
│   ├── membro/           # Dashboard do membro
│   ├── admin/            # Dashboard administrativo
│   └── api/
│       ├── profile/      # API de perfil do usuário
│       └── admin/        # APIs administrativas
│           ├── members/
│           ├── announcements/
│           ├── materials/
│           ├── weekly-agenda/
│           └── events/
├── components/
│   ├── member/           # Componentes da área do membro
│   └── admin/            # Componentes administrativos
├── lib/
│   ├── supabase/
│   │   ├── client.ts     # Cliente browser
│   │   ├── server.ts     # Cliente server (SSR)
│   │   ├── admin.ts      # Cliente admin (service role)
│   │   └── middleware.ts # Helper de autenticação
│   └── data/
│       └── agenda-events.ts  # Funções de leitura pública
├── types/
│   └── supabase.ts       # Types do banco de dados
└── middleware.ts         # Proteção de rotas autenticadas
```

## 🗄️ Schema do banco

### `profiles`
- `id` (UUID, PK, ref `auth.users`)
- `email` (text)
- `name` (text, nullable)
- `role` (text: `'membro'` | `'admin'`, default `'membro'`)
- `created_at`, `updated_at`

**RLS:** usuários leem/editam próprio perfil (exceto role); admins leem/editam todos.

### `announcements`
- `id` (UUID, PK)
- `title`, `content` (text)
- `author_id` (UUID, nullable, ref `profiles`)
- `created_at`, `updated_at`

**RLS:** autenticados leem; só admins criam/editam/excluem.

### `materials`
- `id` (UUID, PK)
- `title`, `description` (text)
- `url` (text)
- `type` (text: `'link'` | `'file'`)
- `author_id` (UUID, nullable, ref `profiles`)
- `created_at`, `updated_at`

**RLS:** autenticados leem; só admins criam/editam/excluem.

### `weekly_agenda`
- `id` (UUID, PK)
- `day_of_week` (text: dias da semana em português)
- `time` (text: formato "19:00")
- `title`, `description` (text)
- `link` (text, nullable)
- `display_order` (integer)
- `created_at`, `updated_at`

**RLS:** **público** (qualquer um pode ler); só admins criam/editam/excluem.

### `events`
- `id` (UUID, PK)
- `title`, `description` (text)
- `start_date`, `end_date` (timestamptz)
- `location`, `link` (text, nullable)
- `created_at`, `updated_at`

**RLS:** **público** (qualquer um pode ler); só admins criam/editam/excluem.

## 🔐 Autenticação

- **Email/senha** e **magic link** suportados
- Sessions gerenciadas via cookies (SSR-compatible)
- Middleware protege rotas `/entrar`, `/auth/*`, `/membro/*`, `/admin/*`
- Páginas públicas **não são afetadas** pelo middleware

## 👥 Roles

- **`membro`**: acesso ao próprio dashboard, leitura de avisos e materiais
- **`admin`**: acesso total (gerenciar membros, publicar avisos/materiais, editar agenda/eventos)

Para promover um membro a admin, use SQL diretamente no Supabase.

## 📊 Integração com páginas públicas

As funções em `src/lib/data/agenda-events.ts` permitem ler a agenda semanal e eventos do Supabase para exibir nas páginas públicas:

```typescript
import { getWeeklyAgenda, getUpcomingEvents } from "@/lib/data/agenda-events"

// Retorna array de itens da agenda
const agenda = await getWeeklyAgenda()

// Retorna próximos N eventos
const events = await getUpcomingEvents(10)
```

**Nota:** outro agente está criando uma página de agenda estática com dados locais. Quando esse PR for mergeado, a página será atualizada para consultar o Supabase usando essas funções.

## 🎨 UI

- Segue o padrão visual do site (paleta gold/cream/ink, `SiteHeader`/`SiteFooter`)
- Textos em português
- Touch targets >= 44px
- Estado "sistema não configurado" quando variáveis não estão definidas

## 🔧 Deploy (Vercel)

1. Conecte o repositório à Vercel
2. Adicione as variáveis de ambiente em **Settings → Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Deploy!

## 🐛 Troubleshooting

### Build falha sem variáveis
✅ **Esperado**: o build deve passar sem variáveis. As páginas mostram estado "não configurado".

### Magic link não funciona
1. Verifique `NEXT_PUBLIC_SUPABASE_URL` (deve ser `https://`)
2. Adicione redirect URL correto no painel do Supabase
3. Confira logs do email no painel **Authentication → Logs**

### Middleware redireciona páginas públicas
❌ O matcher no `src/middleware.ts` deve incluir **apenas** rotas autenticadas:
```typescript
export const config = {
  matcher: ["/entrar", "/auth/:path*", "/membro/:path*", "/admin/:path*"],
}
```

## 📝 Pendências / Melhorias futuras

- [ ] Upload de arquivos para materiais (atualmente apenas URLs)
- [ ] Notificações por email ao publicar avisos
- [ ] Histórico de alterações (audit log)
- [ ] Filtros e busca nas listagens
- [ ] Paginação nas tabelas
- [ ] Página de recuperação de senha
- [ ] Confirmação de email no signup
- [ ] Integração com sistema de doações (outro PR)
- [ ] Chat RAG com pgvector (outro agente vai implementar usando o mesmo client Supabase)

## 🤝 Coordenação com outros PRs

- **Outro agente está criando `src/data/agenda.ts`**: quando esse arquivo entrar, será substituído pelas queries do Supabase. O mapeamento de campos será alinhado posteriormente.
- **PR #2 está modificando `SiteHeader`**: mudanças aqui foram mínimas (apenas adicionar link "Entrar") para facilitar merge.
- **`next.config.ts` não foi editado**: outro PR adiciona `redirects()` nele.
- **Chat RAG vai reaproveitar `src/lib/supabase/`**: o código está documentado e com exports claros.

---

Desenvolvido para **Sinagoga Anussim Brasil — Criciúma, SC** 🕎
