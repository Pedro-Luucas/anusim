export function SynagogueSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Synagogue",
    "@id": "https://anussimbrasil.com.br/#synagogue",
    name: "Anussim Brasil Criciúma",
    alternateName: "Sinagoga Anussim Brasil",
    description:
      "Comunidade judaica Bnei Anusim em Criciúma, Santa Catarina. Serviços de Shabat, estudo de Torá e eventos comunitários.",
    url: "https://anussimbrasil.com.br",
    telephone: "+554899231358",
    address: {
      "@type": "PostalAddress",
      streetAddress: "R. Joaquim Nabuco, 140",
      addressLocality: "Criciúma",
      addressRegion: "SC",
      postalCode: "88802-200",
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -28.6773,
      longitude: -49.3699,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Friday",
        opens: "19:00",
        closes: "21:00",
        description: "Kabalat Shabat",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "12:00",
        description: "Shacharit",
      },
    ],
    sameAs: [
      "https://www.instagram.com/anussimbrasilcriciuma/",
      "https://www.youtube.com/channel/UCCdlGqSr1iLFvxQ3jKxE0gA",
      "https://www.youtube.com/@anussimbrasilcriciuma5648/streams",
    ],
    founder: {
      "@type": "Person",
      name: "Rabino Malachy Ben Israel",
      jobTitle: "Rabino",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
