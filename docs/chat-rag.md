# Assistente de Estudos Judaicos: RAG com Sefaria

Sistema de perguntas e respostas (Q&A) em português baseado em textos sagrados judaicos da [Sefaria](https://www.sefaria.org). Usa RAG (Retrieval-Augmented Generation) com busca vetorial (pgvector) e LLMs via Vercel AI SDK.

## Arquitetura

```
Usuário → Chat UI → API Route → RAG Search → LLM com contexto → Resposta citada
                                    ↓
                              Supabase pgvector
                                    ↓
                              Sefaria API (fallback)
```

### Componentes

- **Frontend**: `/chat`, interface React com streaming de respostas
- **API**: `/api/chat`, endpoint Next.js com rate limiting e verificação de citações
- **RAG**: `src/lib/rag/`, busca híbrida (vetor + texto), embeddings, integração Sefaria
- **Database**: Supabase Postgres com pgvector (tabela `sefaria_chunks`)
- **LLM**: Vercel AI SDK + AI Gateway (Gemini ou GPT configurável)
- **Ingestion**: `scripts/ingest-sefaria.ts`, popula banco com textos da Sefaria

## Setup

### 1. Criar projeto Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. Anote a **Project URL** e a **service_role key** (Settings → API)

### 2. Rodar migração do banco

Execute a migração para criar a tabela de chunks e índices:

```bash
# Via Supabase CLI (recomendado)
supabase db push

# OU via SQL Editor no dashboard Supabase
# Copie e execute o conteúdo de: supabase/migrations/20260924000000_rag_pgvector.sql
```

A migração cria:
- Extension `vector` (pgvector)
- Tabela `sefaria_chunks` com colunas para ref, texto, embedding (768 dims), full-text
- Índice HNSW para busca vetorial
- Índice GIN para busca full-text
- Função RPC `search_sefaria_chunks` para busca híbrida

### 3. Configurar variáveis de ambiente

Copie `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Preencha as variáveis:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui

# Modelo de chat (Gemini ou GPT)
CHAT_MODEL=gemini-2.0-flash-exp

# Modelo de embeddings (recomendado para hebraico)
EMBEDDING_MODEL=gemini-embedding-001

# Google AI API Key (se usar Gemini)
GOOGLE_GENERATIVE_AI_API_KEY=sua-chave-google-ai

# Ou OpenAI (se usar GPT)
# OPENAI_API_KEY=sua-chave-openai
```

**Atenção**: `gemini-embedding-001` tem melhor desempenho em textos hebraicos/aramaicos segundo benchmark da própria Sefaria. OpenAI `text-embedding-3-small` teve resultado pobre neste domínio.

### 4. Configurar no Vercel (produção)

Adicione as mesmas variáveis em **Project Settings → Environment Variables**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CHAT_MODEL`
- `EMBEDDING_MODEL`
- `GOOGLE_GENERATIVE_AI_API_KEY` (ou `OPENAI_API_KEY`)

### 5. Ingerir textos da Sefaria

O script `scripts/ingest-sefaria.ts` puxa textos da API da Sefaria, chunka por segmento, gera embeddings e insere no banco.

#### Dry-run (sem escrever no banco)

Teste primeiro sem escrever:

```bash
npm run ingest:dry
```

Isso vai:
- Buscar textos dos títulos configurados
- Chunkar segmentos muito curtos
- Filtrar por licenças permitidas (Public Domain, CC0, CC-BY, CC-BY-SA, CC-BY-NC)
- Imprimir contagens e amostras
- **NÃO** escrever no banco nem chamar API de embeddings

#### Ingestão real

Quando confirmar que está funcionando:

```bash
npm run ingest
```

**Atenção**: Este processo:
- Faz centenas de requests à API da Sefaria (com throttling de 1s entre batches)
- Gera embeddings via Google AI ou OpenAI (custo de API)
- Insere no Supabase
- Pode levar **10-30 minutos** dependendo dos títulos configurados

#### Títulos padrão

O script ingere por padrão (definido em `scripts/ingest-sefaria.ts`):

- **Torá**: Genesis, Exodus, Leviticus, Numbers, Deuteronomy
- **Rashi na Torá**: Rashi on Genesis, Exodus, Leviticus, Numbers, Deuteronomy
- **Mishná**: Pirkei Avot, Mishnah Berakhot
- **Talmud**: Berakhot
- **Mishneh Torah**: Laws of Repentance, Foundations of the Torah
- **Shulchan Arukh**: Orach Chayim
- **Midrash**: Bereshit Rabbah

Para adicionar mais títulos, edite a constante `SEFARIA_TITLES` no script.

#### Expandir para corpus completo

Para ingerir centenas de livros, use o **Sefaria-Export bulk dump** em vez de crawl via API:

- Bucket público: `gs://sefaria-export` (Google Cloud Storage)
- Download manual ou via `gsutil`
- Adapte o script para ler JSONs locais em vez de API

### 6. Testar localmente

```bash
npm run dev
```

Acesse `http://localhost:3000/chat` e faça uma pergunta. Exemplos:

- "O que é Shabat?"
- "Como acender velas de Shabat?"
- "O que a Torá diz sobre caridade?"

## Como funciona

### Fluxo de pergunta

1. Usuário digita pergunta em português no `/chat`
2. UI envia POST para `/api/chat` com histórico de mensagens
3. API faz rate limiting (10 req/min por IP)
4. Pergunta é traduzida para termos de busca em inglês/hebraico (`translateQueryToSearchTerms`)
5. Sistema gera embedding da query e faz busca híbrida:
   - **Vetorial**: similaridade de cosseno via HNSW
   - **Full-text**: PostgreSQL `ts_rank`
   - **Score combinado**: 70% vetor + 30% texto
6. Se nada encontrado no banco, faz fallback para API da Sefaria
7. Fontes relevantes são injetadas no prompt do sistema
8. LLM responde **somente** com base nas fontes fornecidas
9. Resposta é transmitida via streaming (Server-Sent Events)
10. UI renderiza resposta com citações

### Verificação de citações

O sistema inclui guard contra alucinação:

- `extractRefsFromText()` detecta referências na resposta gerada
- `verifyCitations()` valida se cada ref estava no conjunto recuperado
- Refs alucinadas podem ser descartadas ou sinalizadas

**Nota**: Guard ainda não está ativo no fluxo atual (pode ser adicionado no streaming).

### Prompt do sistema

O prompt instrui o LLM a:

- Responder **apenas** com base em passagens fornecidas
- Sempre citar fonte com formato: ref + trecho hebraico + tradução + explicação
- Priorizar autoridades sefarditas (Shulchan Aruch, Rambam, Kaf HaChaim, Ben Ish Chai)
- Para questões halácicas práticas, encaminhar ao rabino
- Ser acolhedor (público Bnei Anusim descobrindo raízes)

Ver `src/app/api/chat/route.ts` para o prompt completo.

## Testes

### Build sem env vars

O sistema deve buildar limpo mesmo sem configuração:

```bash
unset NEXT_PUBLIC_SUPABASE_URL
unset SUPABASE_SERVICE_ROLE_KEY
unset CHAT_MODEL
npm run build
```

Comportamento esperado:
- Build com sucesso (páginas estáticas pré-renderizadas)
- `/chat` renderiza estado "assistente ainda não configurado"
- API retorna JSON 503 com erro claro

### Unit tests

Adicione testes para:

- `buildSefariaUrl()` - conversão de ref para URL
- `verifyCitations()` - detecção de refs alucinadas
- `translateQueryToSearchTerms()` - tradução PT→EN/HE

Exemplo com Vitest:

```bash
npm install -D vitest @testing-library/react
```

```ts
// src/lib/rag/__tests__/sefaria.test.ts
import { describe, test, expect } from 'vitest'
import { buildSefariaUrl } from '../sefaria'

describe('buildSefariaUrl', () => {
  test('converts ref to URL format', () => {
    expect(buildSefariaUrl('Genesis 1:1')).toBe('https://www.sefaria.org/Genesis.1.1')
    expect(buildSefariaUrl('Berakhot 2a')).toBe('https://www.sefaria.org/Berakhot.2a')
  })
})
```

### Manual testing

1. Faça pergunta simples: "O que é Shabat?"
2. Verifique se resposta inclui citações (ex: "Êxodo 20:8")
3. Clique no link de citação → abre Sefaria.org no trecho certo
4. Teste rate limiting: envie 11 perguntas em 1 minuto → 11ª deve retornar 429
5. Teste mensagem longa (>500 chars) → deve retornar 400

## Expansão futura

### Adicionar mais livros

Edite `SEFARIA_TITLES` em `scripts/ingest-sefaria.ts`. Exemplos:

- **Midrash**: Shemot Rabbah, Vayikra Rabbah, Bamidbar Rabbah, Devarim Rabbah
- **Talmud**: Shabbat, Pesachim, Rosh Hashanah, Yoma, Sukkah, etc.
- **Halacá**: Kaf HaChaim, Ben Ish Chai, Aruch HaShulchan
- **Filosofia**: Moreh Nevuchim (Guia dos Perplexos)
- **Poesia**: Tehilim (Salmos), Shir HaShirim (Cântico dos Cânticos)

### Traduções em português

Sefaria tem algumas traduções PT, mas muitas têm licença "unknown". Para priorizar PT:

1. No `fetchAllSegments`, adicione tentativa de fetch com `lang="pt"`
2. Se não encontrar, fallback para `lang="en"`
3. Ajuste chunking para mesclar hebraico + português + inglês no mesmo chunk

### Melhorias no RAG

- **Reranking**: Use Cohere Rerank ou similar antes de enviar ao LLM
- **Filtros por categoria**: Permitir busca só em Torá, Talmud, Halacá, etc.
- **Query expansion**: LLM reescreve pergunta antes da busca
- **Histórico de conversa**: Armazenar no banco e usar em contexto
- **Feedback de citações**: Botão "útil/não útil" para melhorar retrieval

### UI/UX

- **Citações como cards expandíveis**: Ver texto completo + link Sefaria
- **Filtros visuais**: "Apenas Torá", "Apenas Talmud", "Priorizar Sefarditas"
- **Histórico persistente**: Salvar conversas no localStorage ou DB (se auth)
- **Sugestões de follow-up**: LLM gera 3 perguntas relacionadas após resposta
- **Mode "Estudo guiado"**: Fluxo estruturado (ex: "Entender Shabat do zero")

## Licenças e atribuição

### Sefaria

Todo conteúdo da Sefaria é usado conforme suas licenças individuais:

- **Aceitos**: Public Domain, CC0, CC-BY, CC-BY-SA, CC-BY-NC
- **Rejeitados**: "Copyright", "unknown"

Cada chunk armazena `license` e `version_title`. Citações devem sempre mostrar:

- Título da versão (ex: "The William Davidson Talmud")
- Licença (ex: "CC-BY-NC")
- Link para o texto original em sefaria.org

### Código

Este código é parte do site Anussim Brasil Criciúma e segue a licença do projeto.

## Troubleshooting

### Build falha: "Cannot find module '@supabase/supabase-js'"

Instale dependências:

```bash
npm install
```

### Erro: "Missing Supabase credentials"

Variáveis de ambiente não configuradas. Verifique `.env.local` e Vercel.

### Ingestão falha: "Failed to fetch index for ..."

Título não existe na Sefaria ou nome está incorreto. Verifique:

```
https://www.sefaria.org/api/v2/index/{TITLE}
```

### Embeddings retornam erro 400

Modelo não suporta output dimensionality. Para `text-embedding-3-small`, remova `outputDimensionality` ou ajuste para 1536.

### Busca não retorna resultados

1. Verifique se a ingestão rodou com sucesso:

```sql
SELECT COUNT(*) FROM sefaria_chunks;
```

2. Se 0, rode `npm run ingest`
3. Se >0, ajuste `matchThreshold` em `searchForQuery` (padrão: 0.3)

### Rate limit muito agressivo

Aumente `RATE_LIMIT` e `RATE_LIMIT_WINDOW` em `src/app/api/chat/route.ts`.

### LLM inventa citações (alucinação)

Ative guard de verificação. No streaming handler, após gerar resposta:

```ts
const generatedRefs = extractRefsFromText(generatedText)
const { verified, hallucinated } = verifyCitations(generatedRefs, retrievedChunks)

if (hallucinated.length > 0) {
  console.warn("[Chat] Hallucinated refs:", hallucinated)
  // Remova da resposta ou adicione disclaimer
}
```

## Contato

Para dúvidas sobre o assistente ou o site:

**Rabino Malachy Ben Israel**  
Sinagoga Anussim Brasil Criciúma  
WhatsApp: [+55 48 9923-1358](https://wa.me/554899231358)

---

**Nota**: Este assistente é uma ferramenta de estudo e não substitui a orientação do rabino para questões halácicas práticas.
