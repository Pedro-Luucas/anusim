import { MetadataRoute } from "next"

const IS_FAQ_DRAFT = true

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://anussimbrasil.com.br"

  const routes = [
    "",
    "/bnei-anusim",
    "/fotos",
    "/pontos-de-fe",
    "/contato",
    "/agenda",
    "/doacoes",
    "/calendario",
  ]

  if (!IS_FAQ_DRAFT) {
    routes.push("/perguntas-frequentes")
  }

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }))
}
