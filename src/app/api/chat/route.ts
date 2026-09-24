import { streamText } from "ai"
import { google } from "@ai-sdk/google"
import { openai } from "@ai-sdk/openai"
import { searchForQuery } from "@/lib/rag/search"
import { chunksToCitations } from "@/lib/rag/citations"

const MAX_MESSAGE_LENGTH = 500
const MAX_MESSAGES_PER_REQUEST = 10

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 10
const RATE_LIMIT_WINDOW = 60 * 1000

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  return forwarded ? forwarded.split(",")[0].trim() : "unknown"
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT) {
    return false
  }

  record.count++
  return true
}

function getChatModel() {
  const modelName = process.env.CHAT_MODEL || "gemini-2.0-flash-exp"

  if (modelName.startsWith("gpt-")) {
    return openai(modelName)
  }

  return google(modelName)
}

const SYSTEM_PROMPT = `Você é um assistente de estudos judaicos para a Sinagoga Anussim Brasil em Criciúma, Santa Catarina. Sua função é responder perguntas baseando-se EXCLUSIVAMENTE nos textos sagrados e fontes judaicas fornecidas.

REGRAS IMPORTANTES:

1. Responda APENAS com base nas passagens fornecidas no contexto. NUNCA invente citações ou fontes.

2. Toda afirmação deve ser fundamentada em pelo menos uma fonte. Cite SEMPRE usando o formato exato da referência fornecida.

3. Quando múltiplas fontes relevantes existirem, priorize autoridades sefarditas: Shulchan Aruch (Rav Yosef Karo), Rambam (Maimônides), Kaf HaChaim, Ben Ish Chai, além da Torá, Talmud, Mishná e comentaristas clássicos como Rashi.

4. Se o contexto não contiver informação suficiente para responder, diga claramente: "Não encontrei informação suficiente nas fontes disponíveis para responder essa pergunta. Recomendo consultar o Rabino Malachy Ben Israel da sinagoga."

5. Para questões halácicas (lei judaica) práticas, SEMPRE finalize com: "Para aplicação prática desta lei, consulte o rabino da sinagoga."

6. Seja acolhedor e compreensivo. Muitos leitores estão descobrindo suas raízes Bnei Anusim (cripto-judaicas).

7. Formato das citações:
   - Nome da fonte (ex: "Gênesis 1:1", "Talmud Berakhot 2a", "Shulchan Aruch, Orach Chayim 1:1")
   - Trecho relevante em hebraico/aramaico (se fornecido)
   - Tradução do trecho
   - Breve explicação de como se aplica à pergunta

8. Sempre responda em português brasileiro claro e acessível.`

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)

    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({
          error: "Muitas requisições. Aguarde um momento antes de tentar novamente.",
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    const body = await request.json()
    const { messages } = body

    if (
      !Array.isArray(messages) ||
      messages.length === 0 ||
      messages.length > MAX_MESSAGES_PER_REQUEST
    ) {
      return new Response(
        JSON.stringify({ error: "Mensagens inválidas" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    const lastMessage = messages[messages.length - 1]

    if (
      !lastMessage ||
      lastMessage.role !== "user" ||
      typeof lastMessage.content !== "string"
    ) {
      return new Response(
        JSON.stringify({ error: "Última mensagem deve ser do usuário" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    if (lastMessage.content.length > MAX_MESSAGE_LENGTH) {
      return new Response(
        JSON.stringify({
          error: `Mensagem muito longa (máximo ${MAX_MESSAGE_LENGTH} caracteres)`,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    const searchResult = await searchForQuery(lastMessage.content, {
      matchCount: 8,
    })

    const citations = chunksToCitations(searchResult.chunks)

    const context =
      citations.length > 0
        ? citations
            .map(
              (c, idx) =>
                `[Fonte ${idx + 1}] ${c.ref}\nTexto: ${c.text}\nVersão: ${c.versionTitle}${c.license ? ` (${c.license})` : ""}`
            )
            .join("\n\n")
        : "Nenhuma fonte encontrada. Informe o usuário que não há informação suficiente."

    const enhancedMessages = [
      {
        role: "system" as const,
        content: SYSTEM_PROMPT,
      },
      {
        role: "system" as const,
        content: `CONTEXTO (fontes judaicas relevantes para a pergunta):\n\n${context}`,
      },
      ...messages.slice(-5),
    ]

    const model = getChatModel()

    const result = streamText({
      model,
      messages: enhancedMessages,
      temperature: 0.3,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("[Chat API] Error:", error)

    return new Response(
      JSON.stringify({
        error: "Erro ao processar sua pergunta. Tente novamente.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
