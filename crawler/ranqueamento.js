import fs from 'fs'
import * as cheerio from 'cheerio'

// Lista de páginas HTML
export const pages = ['blade_runner.html', 'duna.html', 'interestelar.html', 'matrix.html', 'mochileiro.html']

const paginas = {}

// Inicializar estrutura com valores padrão
pages.forEach(pagina => {
  paginas[pagina] = {
    pontuacao: 0,
    linksRecebidos: 0,
    ocorrenciasTermo: 0,
    autoreferencia: false,
    linksApontados: []
  };
});

// Termos buscados
export const searchTerms = ['Matrix', 'busca']

// Função para calcular a pontuação de cada página
export function calculateScores(pages, searchTerms) {
  const linkMap = {}
  const authorityMap = {}
  const scores = {}

  // Inicializar mapas
  pages.forEach(page => {
    linkMap[page] = []
    authorityMap[page] = 0
    scores[page] = 0
  });

  // Construir o grafo de links e contar autoridade
  pages.forEach(page => {
    const content = fs.readFileSync(page, 'utf-8')
    const $ = cheerio.load(content)
    const links = $('a')
    links.each((i, link) => {
      const href = $(link).attr('href')
      if (pages.includes(href)) {
        linkMap[page].push(href)
        authorityMap[href]++
      }
    })
  })

  // Calcular pontuação para cada página
  pages.forEach(page => {
    let score = 0
    const content = fs.readFileSync(page, 'utf-8')

    // Autoridade
    score += (authorityMap[page] || 0) * 10

    // Frequência dos termos buscados
    searchTerms.forEach(term => {
      const regex = new RegExp(term, 'gi')
      const matches = content.match(regex)
      if (matches) {
        score += matches.length * 10
      }
    })

    // Penalização por autoreferência
    if (linkMap[page].includes(page)) {
      score -= 15
    }

    scores[page] = score
  })

  return { scores, linkMap, authorityMap }

}

const finalScores = calculateScores(pages, searchTerms);
console.log(finalScores)
