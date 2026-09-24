import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://anussimbrasil.com.br"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/perguntas-frequentes"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
