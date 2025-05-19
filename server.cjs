// server.js (Node.js + Express)
const express = require('express');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const app = express();
const PORT = 3001;
const pagesDir = path.join(__dirname, 'public');

function extractLinksFromHtml(htmlContent) {
  const $ = cheerio.load(htmlContent);
  const links = [];
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (href && href.endsWith('.html')) links.push(href);
  });
  return links;
}

app.get('/api/search/:term', (req, res) => {
  const term = req.params.term.toLowerCase();
  const pageFiles = fs.readdirSync(pagesDir).filter(file => file.endsWith('.html'));
  const linkMap = {};
  const pageContents = {};

  for (const file of pageFiles) {
    const fullPath = path.join(pagesDir, file);
    const content = fs.readFileSync(fullPath, 'utf8').toLowerCase();
    const links = extractLinksFromHtml(content);
    linkMap[file] = links;
    pageContents[file] = content;
  }

  const results = pageFiles.map((file) => {
    const content = pageContents[file];
    const termOccurrences = (content.match(new RegExp(term, 'g')) || []).length;
    const receivedLinks = Object.values(linkMap).filter(links => links.includes(file)).length;
    const selfReference = linkMap[file].includes(file);

    return {
      pagina: file,
      ocorrencias: termOccurrences,
      linksRecebidos: receivedLinks,
      autorreferencia: selfReference,
      total: termOccurrences * 5 + receivedLinks * 10 + (selfReference ? -15 : 0)
    };
  });

  results.sort((a, b) => b.total - a.total);
  res.json(results);
});

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
