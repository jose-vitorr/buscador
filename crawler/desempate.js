import { pages, searchTerms, calculateScores } from "./ranqueamento.js"
import fs from 'fs'
import { normalizeText } from "./ranqueamento.js"

const { scores, linkMap, authorityMap } = calculateScores(pages, searchTerms)

const finalResults = pages.map(page => {
  const content = fs.readFileSync(page, 'utf-8')
  const normalized = normalizeText(content)

  // Contar ocorrências com correspondência parcial
  let termCount = 0
  searchTerms.forEach(term => {
    const normTerm = normalizeText(term)
    const regex = new RegExp(`\\w*${normTerm}\\w*`, 'gi')
    const matches = normalized.match(regex)
    if (matches) termCount += matches.length
  })

  const hasSelfRef = linkMap[page].includes(page)

  return {
    page,
    score: scores[page],
    linksReceived: authorityMap[page],
    termCount,
    hasSelfRef
  }
})

// Ordenação com critérios de desempate
finalResults.sort((a, b) => {
  if (b.score !== a.score) return b.score - a.score;
  if (b.linksReceived !== a.linksReceived) return b.linksReceived - a.linksReceived
  if (b.termCount !== a.termCount) return b.termCount - a.termCount
  if (a.hasSelfRef !== b.hasSelfRef) return a.hasSelfRef ? 1 : -1
  return 0 // Empate final, ordem definida pela equipe
})

// Mostrar resultado final
finalResults.forEach(result => {
  console.log(`${result.page}: ${result.score} pontos`);
});
