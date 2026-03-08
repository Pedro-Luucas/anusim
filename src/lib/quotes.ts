type Quote = {
  text: string
  source: string
}

const QUOTES: Quote[] = [
  {
    text: "O mundo se sustenta por três coisas: pela Torá, pelo serviço divino e por atos de bondade.",
    source: "Pirkei Avot 1:2",
  },
  {
    text: "Em um lugar onde não há homens, esforce-se para ser um homem.",
    source: "Pirkei Avot 2:5",
  },
  {
    text: "Não é sua obrigação completar o trabalho, mas também não é livre para desistir dele.",
    source: "Pirkei Avot 2:16",
  },
  {
    text: "Quem é sábio? Aquele que aprende de todas as pessoas.",
    source: "Pirkei Avot 4:1",
  },
  {
    text: "Quem é forte? Aquele que domina suas inclinações.",
    source: "Pirkei Avot 4:1",
  },
  {
    text: "Quem é rico? Aquele que se alegra com sua porção.",
    source: "Pirkei Avot 4:1",
  },
  {
    text: "Se eu não for por mim, quem será? E se eu for só por mim, o que sou? E se não agora, quando?",
    source: "Hillel — Pirkei Avot 1:14",
  },
  {
    text: "Ama a paz e busca a paz, ama as criaturas e aproxima-as da Torá.",
    source: "Hillel — Pirkei Avot 1:12",
  },
  {
    text: "Todo Israel é responsável um pelo outro.",
    source: "Talmud, Shevuot 39a",
  },
  {
    text: "Não julgue o seu próximo até que esteja no lugar dele.",
    source: "Pirkei Avot 2:4",
  },
  {
    text: "O silêncio é uma cerca para a sabedoria.",
    source: "Pirkei Avot 3:13",
  },
  {
    text: "Trate cada pessoa com um semblante agradável.",
    source: "Pirkei Avot 1:15",
  },
  {
    text: "O estudo da Torá é equivalente a todos os outros mandamentos.",
    source: "Talmud, Shabat 127a",
  },
  {
    text: "Quem salva uma vida, é como se salvasse o mundo inteiro.",
    source: "Talmud, Sanhedrin 37a",
  },
  {
    text: "A inveja, a cobiça e a busca por honras tiram o homem do mundo.",
    source: "Pirkei Avot 4:21",
  },
  {
    text: "Não olhe para o recipiente, mas para o que ele contém.",
    source: "Pirkei Avot 4:20",
  },
  {
    text: "Um bom coração é o melhor caminho ao qual uma pessoa deve se apegar.",
    source: "Pirkei Avot 2:9",
  },
  {
    text: "Onde há Torá, há sabedoria.",
    source: "Pirkei Avot 3:17",
  },
  {
    text: "O dia é curto, o trabalho é grande, os trabalhadores são preguiçosos, a recompensa é abundante e o Mestre é insistente.",
    source: "Pirkei Avot 2:15",
  },
  {
    text: "A compaixão pelos outros demonstra que somos descendentes de Avraham, nosso pai.",
    source: "Talmud, Betza 32b",
  },
  {
    text: "Faça da Sua vontade a vontade d'Ele, para que Ele faça da Sua vontade a sua vontade.",
    source: "Pirkei Avot 2:4",
  },
  {
    text: "A honra verdadeira pertence àquele que honra os outros.",
    source: "Pirkei Avot 4:1",
  },
  {
    text: "Assim como a água desce para o nível mais baixo, a Torá só permanece naquele que é humilde.",
    source: "Talmud, Taanit 7a",
  },
  {
    text: "Arrependimento e boas ações são como um escudo contra a punição.",
    source: "Pirkei Avot 4:11",
  },
  {
    text: "Começa com uma boa ação e terminarás com muitas.",
    source: "Talmud, Sotá 21a",
  },
  {
    text: "O segredo do sucesso é a constância no propósito.",
    source: "Rabi Nachman de Breslov",
  },
  {
    text: "Todo o mundo é uma ponte muito estreita. O principal é não ter medo.",
    source: "Rabi Nachman de Breslov",
  },
  {
    text: "Quando você acredita que pode destruir, acredite que pode reconstruir.",
    source: "Rabi Nachman de Breslov",
  },
  {
    text: "Cada pessoa deve saber que existe um raio de luz que brilha especialmente para ela.",
    source: "Rabi Nachman de Breslov",
  },
  {
    text: "Tsedaká — a caridade — salva da morte.",
    source: "Provérbios 10:2",
  },
]

export function getDailyQuote(): Quote {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  const dayOfYear = Math.floor(diff / 86_400_000)
  return QUOTES[dayOfYear % QUOTES.length]
}
