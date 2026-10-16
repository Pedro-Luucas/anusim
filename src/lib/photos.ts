export const ALBUM_KEYS = [
  "comunidade",
  "pessach",
  "rabino",
  "chanukah",
  "simchat",
  "purim",
] as const

export type AlbumKey = (typeof ALBUM_KEYS)[number]

export type AlbumMeta = {
  key: AlbumKey
  title: string
  subtitle: string
  he: string
}

export const ALBUMS: AlbumMeta[] = [
  { key: "comunidade", title: "Comunidade", subtitle: "O cotidiano da nossa casa", he: "קְהִלָּה" },
  { key: "pessach", title: "Pessach", subtitle: "A noite em que voltamos a contar", he: "פֶּסַח" },
  { key: "rabino", title: "O Rabino", subtitle: "Malachy Ben Israel", he: "מָלְכִי" },
  { key: "chanukah", title: "Chanukah", subtitle: "A luz que persiste", he: "חֲנוּכָּה" },
  { key: "simchat", title: "Simchat Torah", subtitle: "A alegria da Torá", he: "שִׂמְחַת תּוֹרָה" },
  { key: "purim", title: "Purim", subtitle: "Celebrando a salvação", he: "פּוּרִים" },
]

export const PHOTOS: Record<AlbumKey, string[]> = {
  comunidade: [
    ...Array.from({ length: 10 }, (_, i) => `/shulphotos/comunidade${i}.jpg`),
    "/shulphotos/comunidade10.jpeg",
    "/shulphotos/comunidade11.jpeg",
    "/shulphotos/comunidade12.jpeg",
    "/shulphotos/comunidade13.jpeg",
    "/shulphotos/comunidade14.jpeg",
    "/shulphotos/comunidade15.jpg",
  ],
  pessach: Array.from({ length: 16 }, (_, i) => `/shulphotos/pessach${i}.jpg`),
  rabino: Array.from({ length: 11 }, (_, i) => `/shulphotos/rabino${i}.jpg`),
  chanukah: ["/shulphotos/chanukah0.jpg", "/shulphotos/chanukah1.jpg"],
  simchat: Array.from({ length: 5 }, (_, i) => `/shulphotos/simchat${i}.jpg`),
  purim: [
    "/shulphotos/purim0.jpeg",
    ...Array.from({ length: 9 }, (_, i) => `/shulphotos/purim${i + 1}.jpg`),
  ],
}
