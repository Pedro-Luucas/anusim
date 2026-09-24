"use client"

import { useState } from "react"
import Image from "next/image"
import { SiteHeader } from "@/components/landing/site-header"
import { SiteFooter } from "@/components/landing/site-footer"
import { generatePixPayload } from "@/lib/pix"

const PIX_KEY = "criciuma@anussimbrasil.com.br"
const MERCHANT_NAME = "ANUSSIM BRASIL CRICIUMA"
const MERCHANT_CITY = "CRICIUMA"

const PIX_PAYLOAD = generatePixPayload({
  pixKey: PIX_KEY,
  merchantName: MERCHANT_NAME,
  merchantCity: MERCHANT_CITY,
})

export default function DoacoesPage() {
  const [copiedKey, setCopiedKey] = useState(false)
  const [copiedPayload, setCopiedPayload] = useState(false)

  const copyToClipboard = async (text: string, setter: (value: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text)
      setter(true)
      setTimeout(() => setter(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream-100 pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-5 md:px-10">
          <div className="text-center">
            <p className="eyebrow text-gold-700">Apoiar a comunidade</p>
            <h1 className="mt-3 font-display text-4xl md:text-5xl font-semibold text-ink-900">
              Doações via Pix
            </h1>
            <p className="mt-4 text-lg text-ink-600 max-w-2xl mx-auto">
              Sua contribuição ajuda a manter os serviços da sinagoga, as
              transmissões ao vivo, o estudo de Torá e as atividades comunitárias.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-gold-300/60 bg-cream-50 p-8">
              <h2 className="text-xl font-semibold text-ink-900">
                Chave Pix (E-mail)
              </h2>
              <div className="mt-6 rounded-xl bg-white border border-gold-200 p-4">
                <p className="font-mono text-sm text-ink-700 break-all">
                  {PIX_KEY}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(PIX_KEY, setCopiedKey)}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full border border-gold-500 bg-gold-500 px-5 py-3 text-sm font-semibold text-ink-900 transition-all hover:bg-gold-600 hover:border-gold-600"
              >
                {copiedKey ? (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Copiado!
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                    Copiar Chave
                  </>
                )}
              </button>
            </div>

            <div className="rounded-2xl border border-gold-300/60 bg-cream-50 p-8">
              <h2 className="text-xl font-semibold text-ink-900">
                Pix Copia e Cola
              </h2>
              <div className="mt-6 rounded-xl bg-white border border-gold-200 p-4">
                <p className="font-mono text-xs text-ink-700 break-all leading-relaxed">
                  {PIX_PAYLOAD}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(PIX_PAYLOAD, setCopiedPayload)}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full border border-gold-500 bg-gold-500 px-5 py-3 text-sm font-semibold text-ink-900 transition-all hover:bg-gold-600 hover:border-gold-600"
              >
                {copiedPayload ? (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Copiado!
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                    Copiar Código
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="rounded-2xl border border-gold-300/60 bg-white p-8 inline-block">
              <p className="text-center text-sm font-semibold text-ink-700 mb-4">
                QR Code Pix
              </p>
              <div className="bg-white p-4 rounded-xl">
                <Image
                  src="/pix-qrcode.svg"
                  alt="QR Code Pix para doação"
                  width={256}
                  height={256}
                  className="w-64 h-64"
                />
              </div>
              <p className="mt-4 text-center text-xs text-ink-500">
                Escaneie com seu app bancário
              </p>
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-gold-300/60 bg-gradient-to-br from-gold-50 to-cream-50 p-6 md:p-8">
            <h3 className="text-lg font-semibold text-ink-900">
              Para que servem as doações?
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-700">
              <p>
                As contribuições recebidas ajudam a cobrir os custos operacionais da
                sinagoga, incluindo:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Manutenção do espaço físico e aluguel</li>
                <li>Equipamentos para transmissão ao vivo dos serviços</li>
                <li>Materiais para estudo de Torá e recursos educacionais</li>
                <li>Celebração de festas e eventos comunitários</li>
                <li>Apoio a membros da comunidade em necessidade</li>
              </ul>
              <p className="mt-4 text-ink-600">
                Cada doação, independente do valor, faz diferença na continuidade
                das atividades da comunidade Anussim Brasil em Criciúma.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-ink-500">
              Dúvidas sobre doações? Entre em contato com o Rabino Malachy pelo{" "}
              <a
                href="https://wa.me/554899231358?text=Shalom%20Rabino%20Malachy!%20Tenho%20uma%20d%C3%BAvida%20sobre%20doa%C3%A7%C3%B5es."
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-gold-700 hover:underline"
              >
                WhatsApp
              </a>
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
