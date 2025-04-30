import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

const visitadas = new Set(); // Para evitar visitas repetidas
const paginas = {};          // Objeto para armazenar os dados indexados

async function crawlPagina(url) {
  if (visitadas.has(url)) return;
  visitadas.add(url);

  try {
    console.log(`Visitando: ${url}`);
    const resposta = await axios.get(url);
    const $ = cheerio.load(resposta.data);

    const texto = $('body').text(); // Conteúdo bruto da página
    const links = [];

    $('a').each((_, el) => {
      const href = $(el).attr('href');
      if (href) {
        const absoluto = new URL(href, url).href;
        links.push(absoluto);
      }
    });

    paginas[url] = {
      texto,
      links
    };

    // Recursivamente rastrear os links
    for (const link of links) {
      await crawlPagina(link);
    }

  } catch (erro) {
    console.error(`Erro ao acessar ${url}:`, erro.message);
  }
}

// Executa o crawler a partir de uma URL
(async () => {
  const urlInicial = 'https://jose-vitorr.github.io/buscador/blade_runner.html'; // Troque pelo seu link
  await crawlPagina(urlInicial);

  // Salvar os dados em JSON
  fs.writeFileSync('paginas.json', JSON.stringify(paginas, null, 2));
  console.log('Indexação concluída.');
})();