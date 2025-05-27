import { pages } from "./ranqueamento.js"
import { searchTerms } from "./ranqueamento.js"
import fs from 'fs'
import { calculateScores } from "./ranqueamento.js"

const { scores, linkMap, authorityMap } = calculateScores(pages, searchTerms)

const finalResults = pages.map(page => {
  const content = fs.readFileSync(page, 'utf-8')

  // Contar termos buscados
  let termCount = 0
  searchTerms.forEach(term => {
    const normalizedTerm = term.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    const normalizedContent = content.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

    const regex = new RegExp(`\\w*${normalizedTerm}\\w*`, 'gi')
    const matches = normalizedContent.match(regex)
    if (matches) termCount += matches.length
  });

  // Verificar autoreferência
  const hasSelfRef = linkMap[page]?.includes(page)

  return {
    page,
    score: scores[page],
    linksReceived: authorityMap[page],
    termCount,
    hasSelfRef
  }
})

// Aplicar ordenação com critérios de desempate
finalResults.sort((a, b) => {
  if (b.score !== a.score) return b.score - a.score
  if (b.linksReceived !== a.linksReceived) return b.linksReceived - a.linksReceived
  if (b.termCount !== a.termCount) return b.termCount - a.termCount
  if (a.hasSelfRef !== b.hasSelfRef) return a.hasSelfRef ? 1 : -1
  return 0
})

// 🔍 Mostrar apenas páginas com pelo menos uma ocorrência de termo
const filteredResults = finalResults.filter(result => result.termCount > 0)

console.log("> Resultados para o termo : "  + searchTerms + "\n")
console.table(filteredResults, ['page', 'termCount', 'linksReceived', 'hasSelfRef', 'score'])
