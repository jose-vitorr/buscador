import fs from 'fs'
import * as cheerio from 'cheerio'
import path from 'path'

// Descobre automaticamente as páginas HTML no diretório atual
export const pages = fs.readdirSync('./').filter(file => file.endsWith('.html'))

// Termos buscados
export const searchTerms = ['tem']; // Exemplo: "tem" deve encontrar "tempero", "COMTRATEMPO", etc.

export function normalizeText(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

export function calculateScores(pages, searchTerms) {
  const linkMap = {}
  const authorityMap = {}
  const scores = {}

  // Inicialização
  pages.forEach(page => {
    linkMap[page] = []
    authorityMap[page] = 0
    scores[page] = 0
  })

  // Construir grafo de links e autoridade
  pages.forEach(page => {
    const content = fs.readFileSync(page, 'utf-8')
    const $ = cheerio.load(content)
    const allLinks = $('a')

    allLinks.each((i, link) => {
      const href = $(link).attr('href')
      if (href && pages.includes(href)) {
        linkMap[page].push(href);

        // Penalização por autoreferência: ignora contagem
        if (href !== page) {
          authorityMap[href]++
        }
      }
    })
  })

  // Calcular pontuações
  pages.forEach(page => {
    let score = 0;
    const rawContent = fs.readFileSync(page, 'utf-8')
    const normalizedContent = normalizeText(rawContent)

    // Autoridade (se não for autoreferência)
    score += (authorityMap[page] || 0) * 10

    // Ocorrência dos termos (inclusive dentro de palavras e links)
    searchTerms.forEach(term => {
      const normalizedTerm = normalizeText(term)
      const regex = new RegExp(`\\w*${normalizedTerm}\\w*`, 'gi')
      const matches = normalizedContent.match(regex)
      if (matches) score += matches.length * 10
    })

    // Penalidade por autoreferência
    if (linkMap[page].includes(page)) {
      score -= 15
    }

    scores[page] = score
  })

  return { scores, linkMap, authorityMap }
}
