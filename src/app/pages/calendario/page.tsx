"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/header"

// ─── Types ────────────────────────────────────────────────────────────────────

type HebcalEvent = {
  title: string
  date: string
  category: string
  hebrew?: string
  yomtov?: boolean
  memo?: string
  link?: string
}

type HebrewDate = {
  gy: number
  gm: number
  gd: number
  hd: number
  hm: string
  hy: number
  hebrew: string
}

type HolidayType =
  | "yomtov"
  | "cholhamoed"
  | "roshchodesh"
  | "fast"
  | "minor"
  | "shabbat_special"
  | "shabbat"
  | "omer"
  | "modern"
  | "parashat"

type HolidayInfo = {
  shortName: string
  description: string
  type: HolidayType
  priority: number
}

// ─── Holiday Database ─────────────────────────────────────────────────────────
// Keys are lowercase normalized event titles from the Hebcal API.

const HOLIDAY_DB: Record<string, HolidayInfo> = {
  // ── Rosh Hashana ────────────────────────────────────────────────────────
  "rosh hashana i": {
    shortName: "Rosh Hashana I",
    description:
      "Rosh Hashana (ראש השנה) — Ano Novo judaico, 1º de Tishrei. Primeiro dos Yamim Noraim (Dias Temíveis). É um dia de julgamento e profunda introspecção: rezamos para ser inscritos no Livro da Vida. Toca-se o shofar durante a oração de Musaf (exceto quando cai em Shabat). A saudação tradicional é 'Shana Tova' ou 'Gmar Chatimá Tova'. Trabalho é proibido.",
    type: "yomtov",
    priority: 100,
  },
  "rosh hashana ii": {
    shortName: "Rosh Hashana II",
    description:
      "Rosh Hashana (ראש השנה) — 2º de Tishrei. Os dois dias de Rosh Hashana são considerados um único dia longo ('Yoma Arichta'). Toca-se o shofar novamente. Trabalho é proibido.",
    type: "yomtov",
    priority: 100,
  },
  // ── Tzom Gedaliah ────────────────────────────────────────────────────────
  "tzom gedaliah": {
    shortName: "Jejum de Gedaliah",
    description:
      "Tzom Gedaliah (צום גדליה) — Jejum do 3º de Tishrei (ou 4º quando o 3º cai em Shabat). Comemora o assassinato de Gedaliah ben Achikam, último governador judeu após a destruição do Primeiro Templo, que extinguiu a última centelha de autonomia judaica naquele período. Jejum do amanhecer ao anoitecer.",
    type: "fast",
    priority: 75,
  },
  // ── Yom Kippur ───────────────────────────────────────────────────────────
  "yom kippur": {
    shortName: "Yom Kippur",
    description:
      "Yom Kippur (יום כיפור) — O Dia do Perdão, 10 de Tishrei. O dia mais sagrado do calendário judaico. Jejum completo de 25 horas, do pôr do sol ao anoitecer. Proibições: comer, beber, banhar-se, usar perfumes, calçar sapatos de couro e relações conjugais. O serviço de Kol Nidrei abre a véspera, e o dia encerra com a Tekiá Guedolá — o toque longo do shofar. Trabalho é proibido.",
    type: "yomtov",
    priority: 100,
  },
  // ── Sukkot ──────────────────────────────────────────────────────────────
  "sukkot i": {
    shortName: "Sukkot I",
    description:
      "Sukkot (סוכות) — Festa dos Tabernáculos, 15 de Tishrei. Comemora os 40 anos no deserto, quando Israel habitou em tendas (sucot) sob a proteção divina (Ananei HaKavod). Cumprimos as quatro espécies: etrog, lulav, hadassim e aravot. Fazemos refeições (e alguns dormem) na sucá. Trabalho é proibido.",
    type: "yomtov",
    priority: 100,
  },
  "sukkot ii": {
    shortName: "Sukkot II",
    description:
      "Sukkot (סוכות) — 2º dia, 16 de Tishrei (na Diáspora). Continuamos a usar as quatro espécies e a sentar na sucá. Trabalho é proibido.",
    type: "yomtov",
    priority: 100,
  },
  "hoshana raba": {
    shortName: "Hoshana Raba",
    description:
      "Hoshana Raba (הושענא רבה) — 7º dia de Sukkot, 21 de Tishrei. O último dia em que o julgamento divino iniciado em Rosh Hashana é definitivamente 'selado'. A sinagoga é iluminada, usam-se vestes brancas. Circundamos o bimá sete vezes com o lulav. Ao final, batemos galhos de salgueiro (aravá) no chão cinco vezes.",
    type: "cholhamoed",
    priority: 90,
  },
  // ── Shemini Atzeret / Simchat Torah ─────────────────────────────────────
  "shemini atzeret": {
    shortName: "Shemini Atzeret",
    description:
      "Shemini Atzeret (שמיני עצרת) — 'Oitava Reunião', 22 de Tishrei. Yom Tov independente que segue Sukkot. A Torá o descreve como uma 'retenção' — Deus pede ao povo que fique mais um dia após a festa. Rezamos pela chuva (Tefilat Geshem). Trabalho é proibido.",
    type: "yomtov",
    priority: 100,
  },
  "simchat torah": {
    shortName: "Simchat Torá",
    description:
      "Simchat Torá (שמחת תורה) — 'Alegria da Torá', 23 de Tishrei (fora de Israel). Celebra a conclusão e o recomeço do ciclo anual de leitura da Torá. Dançamos com os rolos da Torá — as hakafot — com grande alegria. Lemos juntos o último e o primeiro capítulo da Torá. Trabalho é proibido.",
    type: "yomtov",
    priority: 100,
  },
  // ── Chanukah ─────────────────────────────────────────────────────────────
  "chanukah: 1 candle": {
    shortName: "Chanucá — 1ª vela",
    description:
      "Chanucá (חנוכה) — Festa das Luzes, 25 de Kislev. Comemora o milagre do azeite que durou 8 dias no Beit haMikdash após a vitória dos Macabeus sobre os gregos. Acende-se uma vela na chanuquiá mais a shamash. Recitam-se três bênçãos (incluindo Shehecheyanu) na 1ª noite.",
    type: "minor",
    priority: 70,
  },
  "chanukah: 2 candles": {
    shortName: "Chanucá — 2ª vela",
    description:
      "Chanucá (חנוכה) — 2ª noite. Acendem-se duas velas mais a shamash. A luz da chanuquiá deve ser visível para publicar o milagre (pirsumei nisa).",
    type: "minor",
    priority: 70,
  },
  "chanukah: 3 candles": {
    shortName: "Chanucá — 3ª vela",
    description: "Chanucá (חנוכה) — 3ª noite. Acendem-se três velas mais a shamash.",
    type: "minor",
    priority: 70,
  },
  "chanukah: 4 candles": {
    shortName: "Chanucá — 4ª vela",
    description: "Chanucá (חנוכה) — 4ª noite. Acendem-se quatro velas mais a shamash.",
    type: "minor",
    priority: 70,
  },
  "chanukah: 5 candles": {
    shortName: "Chanucá — 5ª vela",
    description: "Chanucá (חנוכה) — 5ª noite. Acendem-se cinco velas mais a shamash.",
    type: "minor",
    priority: 70,
  },
  "chanukah: 6 candles": {
    shortName: "Chanucá — 6ª vela",
    description: "Chanucá (חנוכה) — 6ª noite. Acendem-se seis velas mais a shamash.",
    type: "minor",
    priority: 70,
  },
  "chanukah: 7 candles": {
    shortName: "Chanucá — 7ª vela",
    description: "Chanucá (חנוכה) — 7ª noite. Acendem-se sete velas mais a shamash.",
    type: "minor",
    priority: 70,
  },
  "chanukah: 8 candles": {
    shortName: "Chanucá — 8ª vela",
    description:
      "Chanucá (חנוכה) — 8ª e última noite (Zot Chanucá). Toda a chanuquiá está iluminada — oito velas mais a shamash. Encerramos a festa contemplando a luz completa.",
    type: "minor",
    priority: 70,
  },
  // ── Asara B'Tevet ────────────────────────────────────────────────────────
  "asara b'tevet": {
    shortName: "Jejum de 10 Tevet",
    description:
      "Asara B'Tevet (עשרה בטבת) — Jejum do 10 de Tevet. Comemora o início do cerco de Nabucodonosor a Jerusalém, que culminou na destruição do Primeiro Templo. Jejum do amanhecer ao anoitecer.",
    type: "fast",
    priority: 75,
  },
  // ── Tu BiShvat ────────────────────────────────────────────────────────────
  "tu bishvat": {
    shortName: "Tu BiShvat",
    description:
      "Tu BiShvat (ט\"ו בשבט) — Rosh Hashana LaIlanot, o Ano Novo das Árvores, 15 de Shevat. Marca o início do novo ciclo de crescimento das árvores em Israel. Costuma-se comer as sete espécies de Israel (trigo, cevada, uva, figo, romã, azeitona e tâmara) e fazer um Seder especial. É dia de alegria — não se faz Tahanun.",
    type: "minor",
    priority: 60,
  },
  // ── Purim ─────────────────────────────────────────────────────────────────
  "ta'anit esther": {
    shortName: "Jejum de Ester",
    description:
      "Ta'anit Ester (תענית אסתר) — Jejum de Ester, véspera de Purim (ou antecipado quando Purim cai em domingo). Relembra o jejum de três dias que Ester convocou antes de ir ao rei Achashverosh pedir a salvação do povo judeu. Jejum do amanhecer ao anoitecer.",
    type: "fast",
    priority: 75,
  },
  "purim": {
    shortName: "Purim",
    description:
      "Purim (פורים) — 14 de Adar. Celebra a salvação dos judeus da Pérsia relatada no Livro de Ester. Quatro mitsvot: (1) ouvir a Meguilá à noite e de manhã; (2) seudá — refeição festiva; (3) mishloach manot — envio de alimentos a amigos; (4) matanot laevyonim — doações aos pobres. Costume de usar fantasias e de alegria abundante.",
    type: "minor",
    priority: 80,
  },
  "shushan purim": {
    shortName: "Shushan Purim",
    description:
      "Shushan Purim (שושן פורים) — 15 de Adar. Purim celebrado nas cidades muradas desde os tempos de Josué (como Jerusalém). Para a maioria das comunidades da Diáspora, é um dia de alegria menor, sem as quatro mitsvot completas.",
    type: "minor",
    priority: 60,
  },
  // ── Pessach ───────────────────────────────────────────────────────────────
  "ta'anit bechorot": {
    shortName: "Jejum dos Primogênitos",
    description:
      "Ta'anit Bechorot (תענית בכורות) — Jejum dos Primogênitos, Erev Pessach (13 de Nisan). Comemora o milagre de que os primogênitos judeus foram poupados na décima praga. É costume realizar um siyum (conclusão de tractato talmúdico) para ser dispensado do jejum.",
    type: "fast",
    priority: 75,
  },
  "pesach i": {
    shortName: "Pessach I",
    description:
      "Pessach (פסח) — 1º dia, 15 de Nisan. A Páscoa judaica celebra a saída do Egito (Yetziat Mitzraim). Realiza-se o Seder na noite anterior: lemos a Hagadá, comemos matzá, maror e os demais símbolos do prato do Seder. Durante toda a festa, é proibido possuir ou comer chametz (levedura). Trabalho é proibido.",
    type: "yomtov",
    priority: 100,
  },
  "pesach ii": {
    shortName: "Pessach II",
    description:
      "Pessach (פסח) — 2º dia, 16 de Nisan (na Diáspora). Realiza-se o segundo Seder nesta noite. Trabalho é proibido.",
    type: "yomtov",
    priority: 100,
  },
  "pesach vii": {
    shortName: "Pessach VII",
    description:
      "Pessach (פסח) — 7º dia, 21 de Nisan. Comemora a travessia do Mar Vermelho (Kri'at Yam Suf), o último grande milagre da saída do Egito. Em Israel, este é o último dia. Trabalho é proibido.",
    type: "yomtov",
    priority: 100,
  },
  "pesach viii": {
    shortName: "Pessach VIII",
    description:
      "Pessach (פסח) — 8º e último dia, 22 de Nisan (na Diáspora). Yom Tov: trabalho é proibido. É tradição ashkenazita rezar Yizkor. A noite seguinte encerra a proibição do chametz.",
    type: "yomtov",
    priority: 100,
  },
  // ── Yom HaShoah ──────────────────────────────────────────────────────────
  "yom hashoah": {
    shortName: "Yom haShoá",
    description:
      "Yom HaShoah VeHaGvurah (יום השואה והגבורה) — Dia de Memória do Holocausto e Heroísmo, 27 de Nisan. Lembramos os seis milhões de judeus assassinados pelo nazismo e honramos os heróis da resistência. Em Israel, sirenes soam e o país para em silêncio.",
    type: "modern",
    priority: 65,
  },
  // ── Yom HaZikaron / Yom HaAtzma'ut ──────────────────────────────────────
  "yom hazikaron": {
    shortName: "Yom haZicarón",
    description:
      "Yom HaZikaron (יום הזיכרון) — Dia da Memória pelos Soldados Caídos e Vítimas do Terrorismo, 4 de Iyar. Dia nacional de luto em Israel. Sirenes soam duas vezes; cerimônias solenes ocorrem em cemitérios militares.",
    type: "modern",
    priority: 65,
  },
  "yom haatzmaut": {
    shortName: "Yom haAtzmaut",
    description:
      "Yom HaAtzma'ut (יום העצמאות) — Dia da Independência de Israel, 5 de Iyar. Celebra a proclamação do Estado de Israel em 1948. Recitam-se orações especiais de Hallel e há festividades em todo o mundo judaico.",
    type: "modern",
    priority: 65,
  },
  // ── Lag BaOmer ────────────────────────────────────────────────────────────
  "lag b'omer": {
    shortName: "Lag baOmer",
    description:
      "Lag BaOmer (ל\"ג בעומר) — 33º dia da contagem do Omer, 18 de Iyar. Marca o fim da praga que vitimou os alunos de Rabi Akiva e também o Hilulá (aniversário de falecimento) de Rabi Shimon bar Yochai. As restrições do Omer (proibição de casamentos, cortes de cabelo, música) são levantadas neste dia. Acendem-se fogueiras.",
    type: "minor",
    priority: 70,
  },
  // ── Yom Yerushalayim ──────────────────────────────────────────────────────
  "yom yerushalayim": {
    shortName: "Yom Yerushalayim",
    description:
      "Yom Yerushalayim (יום ירושלים) — Dia de Jerusalém, 28 de Iyar. Comemora a reunificação de Jerusalém durante a Guerra dos Seis Dias em 1967. Alguns recitam Hallel completo.",
    type: "modern",
    priority: 60,
  },
  // ── Shavuot ───────────────────────────────────────────────────────────────
  "shavuot i": {
    shortName: "Shavuot I",
    description:
      "Shavuot (שבועות) — 1º dia, 6 de Sivan. Comemora a entrega da Torá no Monte Sinai. Costuma-se estudar Torá a noite toda (Tikkun Leil Shavuot), comer alimentos lácteos e ler o Livro de Rute. É tradição enfeitar a sinagoga com flores e ramos. Trabalho é proibido.",
    type: "yomtov",
    priority: 100,
  },
  "shavuot ii": {
    shortName: "Shavuot II",
    description:
      "Shavuot (שבועות) — 2º dia, 7 de Sivan (na Diáspora). É tradição ashkenazita rezar Yizkor. Trabalho é proibido.",
    type: "yomtov",
    priority: 100,
  },
  // ── Summer fasts ──────────────────────────────────────────────────────────
  "shiva asar b'tamuz": {
    shortName: "Jejum de 17 Tamuz",
    description:
      "Shivá Asár B'Tamuz (שבעה עשר בתמוז) — Jejum do 17 de Tamuz. Inicia o período de luto chamado 'Os Três Semanas' (Bein HaMetzarim), que culmina em Tisha B'Av. Comemora cinco tragédias, entre elas a brecha nas muralhas de Jerusalém pelos romanos. Jejum do amanhecer ao anoitecer.",
    type: "fast",
    priority: 75,
  },
  "tisha b'av": {
    shortName: "Tisha B'Av",
    description:
      "Tisha B'Av (תשעה באב) — 9 de Av. O dia mais sombrio do calendário judaico. Jejum de 25 horas (como Yom Kippur). Comemora a destruição do Primeiro e do Segundo Templo, além de outras tragédias nacionais. Lemos o Livro de Lamentações (Eicha). As mesmas cinco proibições de Yom Kippur se aplicam. O Templo terá de ser reconstruído — \"Que seja o último Tisha B'Av de luto\".",
    type: "fast",
    priority: 95,
  },
  // ── Tu B'Av ───────────────────────────────────────────────────────────────
  "tu b'av": {
    shortName: "Tu B'Av",
    description:
      "Tu B'Av (ט\"ו באב) — 15 de Av. Dia festivo, considerado o 'Dia do Amor' judaico. Historicamente, as jovens de Jerusalém dançavam nos vinhedos para encontrar maridos. Marca o início do período de consolação após Tisha B'Av e o retorno ao estudo intensivo da Torá.",
    type: "minor",
    priority: 60,
  },
  // ── Special Shabbatot ─────────────────────────────────────────────────────
  "shabbat shuva": {
    shortName: "Shabat Shuvá",
    description:
      "Shabat Shuva (שבת שובה) — 'Shabat do Retorno'. O Shabat entre Rosh Hashana e Yom Kippur. Recebe este nome da haftará que começa com 'Shuva Yisrael — Retorna, ó Israel' (Oseias 14:2). O rabino costuma discursar sobre teshuvá (arrependimento). Um dos Shabatot mais solenes do ano.",
    type: "shabbat_special",
    priority: 72,
  },
  "shabbat hagadol": {
    shortName: "Shabat haGadol",
    description:
      "Shabat HaGadol (שבת הגדול) — 'O Grande Shabat', imediatamente antes de Pessach. Comemora o milagre no Egito em que os israelitas separaram os cordeiros para o sacrifício pascal sem serem atacados pelos egípcios. O rabino costuma dar uma longa derashah sobre as leis de Pessach.",
    type: "shabbat_special",
    priority: 72,
  },
  "shabbat shekalim": {
    shortName: "Shabat Shekalim",
    description:
      "Shabat Shekalim (שבת שקלים) — Primeira das quatro parashiot especiais antes de Pessach. Lemos sobre a mitsvá de dar meio siclo ao Beit haMikdash (Êxodo 30:11–16). A leitura especial era um chamado para que todos participassem dos sacrifícios coletivos do novo ano.",
    type: "shabbat_special",
    priority: 72,
  },
  "shabbat zachor": {
    shortName: "Shabat Zachor",
    description:
      "Shabat Zachor (שבת זכור) — 'Shabat da Lembrança', imediatamente antes de Purim. Lemos a parashá especial ordenando lembrar o que Amalek fez a Israel (Deuteronômio 25:17–19). Esta leitura é considerada uma mitsvá bíblica; todos os homens são obrigados a ouvi-la.",
    type: "shabbat_special",
    priority: 72,
  },
  "shabbat parah": {
    shortName: "Shabat Pará",
    description:
      "Shabat Pará (שבת פרה) — 'Shabat da Vaca Vermelha'. Lemos sobre a purificação ritual com as cinzas da vaca vermelha (Números 19:1–22). Historicamente, os judeus precisavam ser purificados antes de trazer o sacrifício pascal em Pessach.",
    type: "shabbat_special",
    priority: 72,
  },
  "shabbat hachodesh": {
    shortName: "Shabat haChodesh",
    description:
      "Shabat HaChodesh (שבת החודש) — O Shabat quando Rosh Chodesh Nisan cai, ou o imediatamente anterior. Lemos sobre a primeira mitsvá coletiva dada a Israel: santificar o mês de Nisan (Êxodo 12:1–20), que foi a preparação para a saída do Egito.",
    type: "shabbat_special",
    priority: 72,
  },
  "shabbat nachamu": {
    shortName: "Shabat Nachamu",
    description:
      "Shabat Nachamu (שבת נחמו) — 'Shabat do Consolo', o primeiro Shabat após Tisha B'Av. A haftará começa com 'Nachamu, Nachamu Ami — Consolai, consolai meu povo' (Isaías 40:1). Inicia as 'Sete Semanas de Consolo' em que lemos haftarot de esperança e redenção.",
    type: "shabbat_special",
    priority: 72,
  },
  // ── Rosh Chodesh ──────────────────────────────────────────────────────────
  "rosh chodesh nisan": {
    shortName: "Rosh Chodesh Nissan",
    description:
      "Rosh Chodesh Nisan (ראש חודש ניסן) — 1º de Nisan, o primeiro mês do calendário judaico, 'mês da redenção'. Pessach cai neste mês. Não se recita Tahanun durante todo Nisan. Rezamos Hallel e Musaf.",
    type: "roshchodesh",
    priority: 65,
  },
  "rosh chodesh iyyar": {
    shortName: "Rosh Chodesh Iyar",
    description:
      "Rosh Chodesh Iyar (ראש חודש אייר) — 1º de Iyar. Mês da cura: as letras do nome formam o acrônimo 'Ani Hashem Rofecha — Eu sou o Eterno, teu curador'. Contém Lag BaOmer e Yom HaAtzma'ut. Continuamos a contar o Omer.",
    type: "roshchodesh",
    priority: 65,
  },
  "rosh chodesh sivan": {
    shortName: "Rosh Chodesh Siván",
    description:
      "Rosh Chodesh Sivan (ראש חודש סיון) — 1º de Sivan. Mês em que a Torá foi dada no Sinai. Shavuot cai no 6 de Sivan. Os três primeiros dias de Sivan são chamados 'Sloshet Yemei Hagbalah' (Três Dias de Limitação).",
    type: "roshchodesh",
    priority: 65,
  },
  "rosh chodesh tamuz": {
    shortName: "Rosh Chodesh Tamuz",
    description:
      "Rosh Chodesh Tamuz (ראש חודש תמוז) — 1º de Tamuz. Um mês difícil na história judaica: o 17 de Tamuz marca o início dos 'Três Semanas' de luto, culminando em Tisha B'Av.",
    type: "roshchodesh",
    priority: 65,
  },
  "rosh chodesh av": {
    shortName: "Rosh Chodesh Av",
    description:
      "Rosh Chodesh Av (ראש חודש אב) — 1º de Av. Com a chegada de Av, diminuímos a alegria (início dos 'Nove Dias'). Evitamos carne e vinho, banhos de prazer, lavagem de roupas e compras de itens novos. O 9 de Av é o ponto mais sombrio.",
    type: "roshchodesh",
    priority: 65,
  },
  "rosh chodesh elul": {
    shortName: "Rosh Chodesh Elul",
    description:
      "Rosh Chodesh Elul (ראש חודש אלול) — 1º de Elul. O último mês antes do Ano Novo, dedicado à teshuvá (arrependimento). Tocamos o shofar todos os dias (exceto Shabat). Lemos o Salmo 27 pela manhã e à tarde. O acrônimo 'Ani LeDodi VeDodi Li — Eu sou do meu amado e meu amado é meu' expressa o amor especial entre Israel e Deus neste mês.",
    type: "roshchodesh",
    priority: 65,
  },
  "rosh chodesh cheshvan": {
    shortName: "Rosh Chodesh Marcheshvan",
    description:
      "Rosh Chodesh Marcheshvan (ראש חודש מרחשון) — 1º de Marcheshvan (Cheshvan). O único mês sem nenhum feriado judaico — aguardamos pacientemente o próximo ciclo. Começamos a rezar pela chuva em Israel (Barechenu). Na Diáspora, adicionamos 'Vetein Tal Umatar' a partir de 4 ou 5 de dezembro.",
    type: "roshchodesh",
    priority: 65,
  },
  "rosh chodesh kislev": {
    shortName: "Rosh Chodesh Kislev",
    description:
      "Rosh Chodesh Kislev (ראש חודש כסלו) — 1º de Kislev. Mês da luz: Chanucá começa no 25 de Kislev. Mês associado a alegria, milagres e esperança.",
    type: "roshchodesh",
    priority: 65,
  },
  "rosh chodesh tevet": {
    shortName: "Rosh Chodesh Tevet",
    description:
      "Rosh Chodesh Tevet (ראש חודש טבת) — 1º de Tevet. Cai durante Chanucá (6ª ou 7ª vela, dependendo do ano). O 10 de Tevet é um dia de jejum.",
    type: "roshchodesh",
    priority: 65,
  },
  "rosh chodesh shvat": {
    shortName: "Rosh Chodesh Shevat",
    description:
      "Rosh Chodesh Shevat (ראש חודש שבט) — 1º de Shevat. O 15 de Shevat é Tu BiShvat, o Ano Novo das Árvores.",
    type: "roshchodesh",
    priority: 65,
  },
  "rosh chodesh adar": {
    shortName: "Rosh Chodesh Adar",
    description:
      "Rosh Chodesh Adar (ראש חודש אדר) — 1º de Adar. 'Quando entra Adar, aumenta a alegria!' Purim cai no 14 de Adar. Em anos com Adar duplo, este é Adar II.",
    type: "roshchodesh",
    priority: 65,
  },
  "rosh chodesh adar i": {
    shortName: "Rosh Chodesh Adar I",
    description:
      "Rosh Chodesh Adar I (ראש חודש אדר א) — 1º do primeiro Adar em ano bissexto (Shanah Me'uberet). Purim será celebrado em Adar II. Em Adar I, seguimos as leis de alegria de Adar normalmente.",
    type: "roshchodesh",
    priority: 65,
  },
  "rosh chodesh adar ii": {
    shortName: "Rosh Chodesh Adar II",
    description:
      "Rosh Chodesh Adar II (ראש חודש אדר ב) — 1º do segundo Adar em ano bissexto. 'Quando entra Adar, aumenta a alegria!' Purim cai no 14 deste mês.",
    type: "roshchodesh",
    priority: 65,
  },
  // ── Yom Kippur Katan ──────────────────────────────────────────────────────
  "yom kippur katan": {
    shortName: "Yom Kipur Katán",
    description:
      "Yom Kippur Katan (יום כיפור קטן) — 'Pequeno Yom Kippur', véspera de Rosh Chodesh (em certos meses). Costume de jejuar meio dia e fazer introspecção antes do novo mês, como uma mini-preparação espiritual.",
    type: "minor",
    priority: 50,
  },
  // ── Sefirat HaOmer ────────────────────────────────────────────────────────
  "sefirat haomer": {
    shortName: "Sefirat haOmer",
    description:
      "Sefirat HaOmer (ספירת העומר) — Contagem do Omer. Os 49 dias entre a 2ª noite de Pessach e Shavuot. Durante este período, contamos cada dia em memória dos alunos de Rabi Akiva que morreram. É um tempo de semi-luto: evitamos casamentos, cortes de cabelo e música (com exceções). A contagem culimna com Shavuot, o recebimento da Torá.",
    type: "omer",
    priority: 40,
  },
  // ── Shabat genérico ───────────────────────────────────────────────────────
  "shabbat": {
    shortName: "Shabat",
    description:
      "Shabat (שבת) — O sétimo dia, do anoitecer de sexta-feira ao anoitecer de sábado. O dia do descanso consagrado por Deus na Criação. Abstemo-nos de trabalho (melachá) e nos dedicamos à Torá, à oração e à família. Recebemos o Shabat com o acendimento de velas e o Kidush sobre o vinho. O Shabat termina com a Havdalá.",
    type: "shabbat",
    priority: 50,
  },
}

// Chol haMoed Pessach (days 3–6 of Pessach, labeled with CH''M in Hebcal)
const CHOL_HAMOED_PESACH: HolidayInfo = {
  shortName: "Chol haMoed Pessach",
  description:
    "Chol haMoed Pessach (חול המועד פסח) — Dias intermediários da Páscoa. Continuamos a não comer chametz e a observar o espírito da festa. Algumas formas de trabalho são permitidas. Recitamos Hallel parcial e há leituras especiais da Torá. Cumprimos a mitsvá de se alegrar no feriado.",
  type: "cholhamoed",
  priority: 80,
}

const CHOL_HAMOED_SUKKOT: HolidayInfo = {
  shortName: "Chol haMoed Sukkot",
  description:
    "Chol haMoed Sukkot (חול המועד סוכות) — Dias intermediários da Festa dos Tabernáculos. Continuamos a sentar na sucá, agitar o lulav e recitar Hallel. Algumas formas de trabalho são permitidas.",
  type: "cholhamoed",
  priority: 80,
}

// ─── Lookup helpers ───────────────────────────────────────────────────────────

function normalizeTitle(t: string): string {
  return t.toLowerCase().trim().replace(/\s+/g, " ").replace(/['']/g, "'").replace(/[""]/g, '"')
}

function lookupHoliday(title: string, category: string, yomtov?: boolean): HolidayInfo | null {
  const norm = normalizeTitle(title)

  // Chol haMoed detection (Hebcal uses "ch''m" in parentheses)
  if (norm.includes("ch''m") || norm.includes("chol ha-moed")) {
    if (norm.includes("pesach") || norm.includes("sukkot")) {
      return norm.includes("pesach") ? CHOL_HAMOED_PESACH : CHOL_HAMOED_SUKKOT
    }
  }

  // Omer counting entries (e.g., "1st of Omer", "33rd of Omer")
  if (norm.includes("of omer") || norm.endsWith("b'omer") || category === "omer") {
    return HOLIDAY_DB["sefirat haomer"]
  }

  // Rosh Hashana with year appended (e.g., "Rosh Hashana 5786")
  if (norm.startsWith("rosh hashana")) {
    return HOLIDAY_DB["rosh hashana i"] ?? null
  }

  // Exact match
  if (HOLIDAY_DB[norm]) return HOLIDAY_DB[norm]

  // Category fallbacks
  if (category === "roshchodesh") {
    return {
      shortName: "Rosh Chodesh",
      description: "Rosh Chodesh — início do novo mês judaico. Rezamos Hallel parcial e Musaf. É um dia de semi-alegria.",
      type: "roshchodesh",
      priority: 65,
    }
  }
  if (yomtov || (category === "holiday" && !norm.startsWith("parashat"))) {
    return {
      shortName: title,
      description: title,
      type: "yomtov",
      priority: 100,
    }
  }
  if (category === "parashat") {
    return { shortName: "Parashá", description: title, type: "parashat", priority: 30 }
  }

  return null
}

/** Returns the best holiday to show in the cell (highest priority, not omer/parashat/shabbat unless Shabbat is the fallback) */
function bestCellHoliday(events: HebcalEvent[], isShabat: boolean): HolidayInfo | null {
  let best: HolidayInfo | null = null

  for (const ev of events) {
    const info = lookupHoliday(ev.title, ev.category, ev.yomtov)
    if (!info) continue
    if (info.type === "omer" || info.type === "parashat") continue
    if (!best || info.priority > best.priority) best = info
  }

  // If it's Saturday and no higher event, show Shabat
  if (isShabat && (!best || best.priority < HOLIDAY_DB["shabbat"].priority)) {
    return HOLIDAY_DB["shabbat"]
  }

  return best
}

// ─── Type colors ──────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<HolidayType, { bg: string; text: string; border: string; cell: string }> = {
  yomtov:         { bg: "bg-accent-50",   text: "text-accent-700",   border: "border-accent-200",   cell: "bg-accent-50 border-accent-300" },
  cholhamoed:     { bg: "bg-amber-50",     text: "text-amber-700",    border: "border-amber-200",    cell: "bg-amber-50 border-amber-200" },
  roshchodesh:    { bg: "bg-emerald-50",   text: "text-emerald-700",  border: "border-emerald-200",  cell: "bg-emerald-50 border-emerald-200" },
  fast:           { bg: "bg-red-50",       text: "text-red-700",      border: "border-red-200",      cell: "bg-red-50 border-red-200" },
  minor:          { bg: "bg-sky-50",       text: "text-sky-700",      border: "border-sky-200",      cell: "bg-sky-50 border-sky-200" },
  shabbat_special:{ bg: "bg-violet-50",    text: "text-violet-700",   border: "border-violet-200",   cell: "bg-violet-50 border-violet-200" },
  shabbat:        { bg: "bg-primary-50",   text: "text-primary-600",  border: "border-primary-100",  cell: "bg-[#f0f5fb] border-primary-100" },
  omer:           { bg: "bg-neutral-50",   text: "text-neutral-600",  border: "border-neutral-200",  cell: "bg-neutral-50 border-neutral-100" },
  modern:         { bg: "bg-slate-50",     text: "text-slate-700",    border: "border-slate-200",    cell: "bg-slate-50 border-slate-200" },
  parashat:       { bg: "bg-primary-50",   text: "text-primary-600",  border: "border-primary-100",  cell: "bg-primary-50 border-primary-100" },
}

// ─── Static data ──────────────────────────────────────────────────────────────

const HEBREW_MONTHS_PT: Record<string, string> = {
  Nisan: "Nissan", Iyyar: "Iyar", Sivan: "Siván", Tamuz: "Tamuz",
  Av: "Av", Elul: "Elul", Tishrei: "Tishrei", Cheshvan: "Marcheshvan",
  Kislev: "Kislev", Tevet: "Tevet", Shvat: "Shevat",
  Adar: "Adar", "Adar I": "Adar I", "Adar II": "Adar II",
}

const HEBREW_MONTHS_ABBR: Record<string, string> = {
  Nisan: "Nis", Iyyar: "Iya", Sivan: "Siv", Tamuz: "Tam",
  Av: "Av", Elul: "Elu", Tishrei: "Tis", Cheshvan: "Mar",
  Kislev: "Kis", Tevet: "Tet", Shvat: "Shv",
  Adar: "Adr", "Adar I": "AI", "Adar II": "AII",
}

const CIVIL_MONTHS_PT = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]

const WEEKDAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

// ─── API functions ────────────────────────────────────────────────────────────

async function fetchMonthEvents(year: number, month: number): Promise<HebcalEvent[]> {
  try {
    const url = `https://www.hebcal.com/hebcal?v=1&cfg=json&year=${year}&month=${month}&maj=on&min=on&nx=on&ss=on&mf=on&omer=on&c=off`
    const res = await fetch(url)
    if (!res.ok) return []
    const data: { items?: HebcalEvent[] } = await res.json()
    return data.items ?? []
  } catch {
    return []
  }
}

async function fetchHebrewDate(year: number, month: number, day: number): Promise<HebrewDate | null> {
  try {
    const res = await fetch(
      `https://www.hebcal.com/converter?cfg=json&gy=${year}&gm=${month}&gd=${day}&g2h=1`
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

function dateKey(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CalendarioPage() {
  const today = new Date()
  const todayKey = dateKey(today.getFullYear(), today.getMonth() + 1, today.getDate())

  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [mode, setMode] = useState<"civil" | "jewish">("civil")
  const [eventsByDate, setEventsByDate] = useState<Record<string, HebcalEvent[]>>({})
  const [hebrewByDate, setHebrewByDate] = useState<Record<string, HebrewDate>>({})
  const [loading, setLoading] = useState(true)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const loadData = useCallback(async (y: number, m: number) => {
    setLoading(true)
    const daysInMonth = new Date(y, m, 0).getDate()

    const [events, ...hebrewResults] = await Promise.all([
      fetchMonthEvents(y, m),
      ...Array.from({ length: daysInMonth }, (_, i) =>
        fetchHebrewDate(y, m, i + 1).then(hd => ({ day: i + 1, hd }))
      ),
    ])

    const evMap: Record<string, HebcalEvent[]> = {}
    for (const ev of events as HebcalEvent[]) {
      if (!evMap[ev.date]) evMap[ev.date] = []
      evMap[ev.date].push(ev)
    }
    setEventsByDate(evMap)

    const hdMap: Record<string, HebrewDate> = {}
    for (const r of hebrewResults as { day: number; hd: HebrewDate | null }[]) {
      if (r.hd) hdMap[dateKey(y, m, r.day)] = r.hd
    }
    setHebrewByDate(hdMap)
    setLoading(false)
  }, [])

  useEffect(() => { loadData(year, month) }, [year, month, loadData])

  function navigate(delta: number) {
    let nm = month + delta, ny = year
    if (nm > 12) { nm = 1; ny++ }
    if (nm < 1) { nm = 12; ny-- }
    setMonth(nm)
    setYear(ny)
  }

  // Hebrew months visible in this civil month
  const hebrewMonthsVisible = Array.from(
    new Set(Object.values(hebrewByDate).map(h => HEBREW_MONTHS_PT[h.hm] ?? h.hm))
  )
  const hebrewYearVisible = Object.values(hebrewByDate)[0]?.hy
  const hebrewMonthLabel = hebrewMonthsVisible.join(" / ")
  const civilLabel = CIVIL_MONTHS_PT[month - 1]

  // Build calendar grid
  const firstWeekday = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const gridCells: Array<number | null> = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  // Modal data
  const selHD = selectedKey ? hebrewByDate[selectedKey] : null
  const selEvents = selectedKey ? (eventsByDate[selectedKey] ?? []) : []

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header />

      <main className="mx-auto max-w-2xl px-3 py-5 flex flex-col gap-4">

        {/* ── Month header card ── */}
        <section className="rounded-2xl bg-gradient-to-br from-primary-700 to-primary-800 px-5 py-4 text-white shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => navigate(-1)}
              aria-label="Mês anterior"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-lg text-white/80 transition hover:bg-white/20 active:scale-95"
            >
              ‹
            </button>

            <div className="flex-1 text-center">
              {mode === "civil" ? (
                <>
                  <h1 className="text-xl font-bold sm:text-2xl leading-tight">
                    {civilLabel} {year}
                  </h1>
                  <p className="mt-0.5 text-sm text-primary-200">
                    {loading ? "..." : hebrewMonthLabel || "—"}
                    {!loading && hebrewYearVisible
                      ? <span className="text-primary-300"> · {hebrewYearVisible}</span>
                      : null}
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-xl font-bold sm:text-2xl leading-tight text-accent-200">
                    {loading ? "..." : hebrewMonthLabel || "—"}
                    {!loading && hebrewYearVisible
                      ? <span className="text-accent-300 font-normal text-base"> · {hebrewYearVisible}</span>
                      : null}
                  </h1>
                  <p className="mt-0.5 text-sm text-primary-200">{civilLabel} {year}</p>
                </>
              )}
            </div>

            <button
              onClick={() => navigate(1)}
              aria-label="Próximo mês"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-lg text-white/80 transition hover:bg-white/20 active:scale-95"
            >
              ›
            </button>
          </div>

          {/* Toggle */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setMode(m => m === "civil" ? "jewish" : "civil")}
              className="flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/20"
            >
              <span className={mode === "civil" ? "text-white" : "text-white/40"}>Civil</span>
              <span className="mx-1 text-white/30">·</span>
              <span className={mode === "jewish" ? "text-accent-300" : "text-white/40"}>Judaico</span>
              <span
                className={`ml-2 inline-block h-4 w-7 rounded-full transition-colors ${
                  mode === "jewish" ? "bg-accent-400" : "bg-white/20"
                } relative`}
              >
                <span
                  className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-all ${
                    mode === "jewish" ? "left-3.5" : "left-0.5"
                  }`}
                />
              </span>
            </button>
          </div>
        </section>

        {/* ── Calendar grid card ── */}
        <section className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-neutral-100">
            {WEEKDAYS_SHORT.map((wd, i) => (
              <div
                key={wd}
                className={`py-2 text-center text-[10px] font-semibold tracking-wider uppercase ${
                  i === 6 ? "text-accent-600" : "text-neutral-400"
                }`}
              >
                {wd}
              </div>
            ))}
          </div>

          {/* Day grid */}
          {loading ? (
            <div className="grid grid-cols-7 p-2 gap-1">
              {Array.from({ length: 35 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg bg-neutral-100 animate-pulse"
                  style={{ minHeight: 56 }}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 p-2 gap-1">
              {gridCells.map((day, idx) => {
                if (day === null) {
                  return <div key={`e-${idx}`} style={{ minHeight: 56 }} />
                }

                const key = dateKey(year, month, day)
                const hd = hebrewByDate[key]
                const dayEvents = eventsByDate[key] ?? []
                const isShabat = new Date(year, month - 1, day).getDay() === 6
                const isToday = key === todayKey
                const holiday = bestCellHoliday(dayEvents, isShabat)
                const colors = holiday ? TYPE_COLORS[holiday.type] : null

                // Show month abbreviation when Hebrew day is 1 (new month)
                const hebrewDayLabel = hd
                  ? hd.hd === 1
                    ? `1 ${HEBREW_MONTHS_ABBR[hd.hm] ?? ""}`
                    : String(hd.hd)
                  : ""

                return (
                  <button
                    key={key}
                    onClick={() => { setSelectedKey(key); setModalOpen(true) }}
                    aria-label={`${day} de ${civilLabel}${hd ? `, ${hd.hd} de ${HEBREW_MONTHS_PT[hd.hm] ?? hd.hm}` : ""}`}
                    className={[
                      "group flex flex-col items-center rounded-lg border px-0.5 py-1.5 text-center transition-all",
                      "active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
                      isToday
                        ? "bg-primary-700 border-primary-700 text-white shadow-md"
                        : colors
                        ? `${colors.cell} hover:brightness-95`
                        : "border-transparent bg-transparent hover:bg-neutral-50",
                    ].join(" ")}
                    style={{ minHeight: 56 }}
                  >
                    {/* Primary date */}
                    <span
                      className={[
                        "block leading-none font-bold tabular-nums",
                        "text-base sm:text-lg",
                        isToday
                          ? "text-white"
                          : isShabat
                          ? "text-primary-600"
                          : "text-neutral-800",
                      ].join(" ")}
                    >
                      {mode === "civil" ? day : (hd?.hd ?? day)}
                    </span>

                    {/* Secondary date */}
                    <span
                      className={[
                        "block leading-none mt-0.5 tabular-nums",
                        "text-[9px] sm:text-[10px]",
                        isToday ? "text-primary-200" : "text-neutral-400",
                      ].join(" ")}
                    >
                      {mode === "civil"
                        ? hebrewDayLabel
                        : day}
                    </span>

                    {/* Holiday label */}
                    {holiday && holiday.type !== "shabbat" && (
                      <span
                        className={[
                          "mt-1 block w-full truncate px-0.5 leading-tight",
                          "text-[8px] sm:text-[9px] font-semibold",
                          isToday ? "text-primary-100" : colors?.text ?? "text-neutral-500",
                        ].join(" ")}
                      >
                        {holiday.shortName}
                      </span>
                    )}
                    {holiday?.type === "shabbat" && (
                      <span
                        className={[
                          "mt-1 block leading-tight",
                          "text-[8px] sm:text-[9px] font-medium",
                          isToday ? "text-primary-200" : "text-primary-400",
                        ].join(" ")}
                      >
                        Shabat
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </section>

        {/* ── Legend ── */}
        {!loading && (
          <section className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              Legenda
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {(["yomtov", "cholhamoed", "roshchodesh", "fast", "minor", "shabbat_special", "shabbat"] as HolidayType[]).map(type => {
                const c = TYPE_COLORS[type]
                const labels: Record<string, string> = {
                  yomtov: "Yom Tov",
                  cholhamoed: "Chol haMoed",
                  roshchodesh: "Rosh Chodesh",
                  fast: "Jejum",
                  minor: "Feriado menor",
                  shabbat_special: "Shabat especial",
                  shabbat: "Shabat",
                }
                return (
                  <div key={type} className="flex items-center gap-1.5">
                    <span className={`inline-block h-3 w-3 rounded-sm border ${c.bg} ${c.border}`} />
                    <span className="text-[11px] text-neutral-500">{labels[type]}</span>
                  </div>
                )
              })}
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-sm bg-primary-700 border border-primary-700" />
                <span className="text-[11px] text-neutral-500">Hoje</span>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ── Day detail modal (bottom sheet) ── */}
      {modalOpen && selectedKey && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(15,30,55,0.55)", backdropFilter: "blur(4px)" }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-t-2xl bg-white flex flex-col"
            style={{ maxHeight: "82dvh" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-neutral-200 shrink-0" />

            {/* Modal header */}
            <div className="flex items-start justify-between gap-3 border-b border-neutral-100 px-5 py-4 shrink-0">
              <div>
                {(() => {
                  const [dy, dm, dd] = selectedKey.split("-").map(Number)
                  const hd = selHD
                  const civil = `${dd} de ${CIVIL_MONTHS_PT[dm - 1]}, ${dy}`
                  const hebrew = hd
                    ? `${hd.hd} de ${HEBREW_MONTHS_PT[hd.hm] ?? hd.hm}, ${hd.hy}`
                    : null

                  return mode === "civil" ? (
                    <>
                      <h2 className="text-lg font-bold text-neutral-900 sm:text-xl">{civil}</h2>
                      {hebrew && <p className="mt-0.5 text-sm font-medium text-accent-600">{hebrew}</p>}
                    </>
                  ) : (
                    <>
                      <h2 className="text-lg font-bold text-accent-700 sm:text-xl">{hebrew ?? "—"}</h2>
                      <p className="mt-0.5 text-sm text-neutral-500">{civil}</p>
                    </>
                  )
                })()}
              </div>
              <button
                onClick={() => setModalOpen(false)}
                aria-label="Fechar"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition hover:bg-neutral-200"
              >
                ✕
              </button>
            </div>

            {/* Events */}
            <div className="overflow-y-auto px-4 py-4 flex flex-col gap-3 pb-8">
              {selEvents.length === 0 && (
                <div className="py-8 text-center text-sm text-neutral-400">
                  Nenhum evento especial neste dia.
                </div>
              )}

              {selEvents.map((ev, i) => {
                const info = lookupHoliday(ev.title, ev.category, ev.yomtov)
                const colors = info ? TYPE_COLORS[info.type] : TYPE_COLORS.minor

                return (
                  <div
                    key={i}
                    className={`rounded-xl border ${colors.border} ${colors.bg} px-4 py-3`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-neutral-900 text-sm leading-snug">
                          {info?.shortName ?? ev.title}
                        </p>
                        {ev.hebrew && (
                          <p className="mt-0.5 text-base text-accent-600" dir="rtl">
                            {ev.hebrew}
                          </p>
                        )}
                        {info?.description && (
                          <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                            {info.description}
                          </p>
                        )}
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${colors.text} ${colors.bg} border ${colors.border}`}>
                        {info?.type === "yomtov" ? "Yom Tov"
                          : info?.type === "cholhamoed" ? "Chol haMoed"
                          : info?.type === "roshchodesh" ? "Rosh Chodesh"
                          : info?.type === "fast" ? "Jejum"
                          : info?.type === "shabbat" ? "Shabat"
                          : info?.type === "shabbat_special" ? "Shabat Esp."
                          : info?.type === "omer" ? "Omer"
                          : info?.type === "modern" ? "Moderno"
                          : "Feriado"}
                      </span>
                    </div>
                    {ev.link && (
                      <a
                        href={ev.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        Saiba mais →
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
