# 🔍 Buscador Web de Páginas HTML - Projeto Crawler e Ranqueamento

> Projeto desenvolvido para a disciplina de **Programação para a Internet** — Curso de **Análise e Desenvolvimento de Sistemas**, IFPI

---

## 📚 Descrição do Projeto

Este projeto consiste em um sistema de **rastreamento automático de páginas web (crawler)** e um **mecanismo de busca ranqueado**, construído com JavaScript (Node.js) e hospedado no [GitHub Pages](https://jose-vitorr.github.io/buscador/).

A proposta foi implementar, de forma simplificada, como os **mecanismos de busca** da internet funcionam:

- Rastreamos páginas HTML interligadas
- Extraímos e indexamos o conteúdo textual
- Armazenamos os dados em JSON
- Permite realizar buscas com critérios de ranqueamento

---

## 🧠 Funcionalidades

✔️ Rastreamento recursivo de páginas a partir de uma URL inicial  
✔️ Indexação do conteúdo textual de cada página  
✔️ Armazenamento de links e ocorrências em um arquivo JSON  
✔️ Ranqueamento por:
- Frequência do termo buscado
- Autoridade da página (número de links recebidos)
- Penalidade por autoreferência

✔️ Exibição dos resultados de forma organizada  
✔️ Interface pronta para testes com termos como: `Matrix`, `Universo`, `Viagem`, etc.

---

## ⚙️ Como Funciona

1. O usuário fornece a URL inicial
2. O sistema visita a página, extrai o texto e os links
3. Para cada link encontrado, repete o processo
4. As páginas são indexadas em `paginas.json`
5. O mecanismo de busca percorre as páginas indexadas e aplica os critérios de ranqueamento

---

## 📁 Estrutura do projeto

📁 buscador/
├── 📁 crawler/
│   ├── 📄 index.js             # Script principal (crawler)
│   └── 📄 paginas.json         # Arquivo com as páginas indexadas
├── 📁 node_modules/            # Dependências do projeto (gerado pelo npm)
├── 📄 blade_runner.html        # Página de conteúdo
├── 📄 duna.html
├── 📄 interestelar.html
├── 📄 matrix.html
├── 📄 mochileiro.html
├── 📄 package.json             # Configuração do projeto Node.js
├── 📄 package-lock.json        # Arquivo de bloqueio de dependências

---

## 🔎 Casos de Teste

| Termo Buscado        | Páginas onde aparece                     |
|----------------------|------------------------------------------|
| `Matrix`             | Blade Runner, Interestellar, Matrix, Mochileiro |
| `Ficção Científica`  | Blade Runner, Matrix, Mochileiro, Interestellar |
| `Realidade`          | Blade Runner, Matrix, Interestellar      |
| `Universo`           | Duna, Mochileiro                         |
| `Viagem`             | Mochileiro, Interestellar                |

---

## 👨‍💻 Tecnologias Utilizadas

- Node.js (ESModules)
- [Axios](https://axios-http.com) para requisições HTTP
- [Cheerio](https://cheerio.js.org) para parsear HTML
- GitHub Pages para hospedagem
- HTML/CSS nativo

---

## 🧑‍🤝‍🧑 Equipe

- Ayrlon Assunção  
- José Vitor  
- Paulo Cesar  
- Riquelme Lustosa

---

## 🚀 Como Executar Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/jose-vitorr/buscador

2. Instale as dependências:
   ```bash
   npm install axios cheerio

3. Execute o script crawler:
   ```bash
   node crawler.js

4. O arquivo "paginas.json" será criado com os dados indexados.

📌 Observações
Certifique-se de que o repositório tenha "type": "module" no package.json para suporte a ESModules.

A hospedagem está disponível em:
[Hospedagem do site no GitHub Pages](https://jose-vitorr.github.io/buscador/blade_runner.html)
