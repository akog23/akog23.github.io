# Isaac Koga — Portfolio

Portfólio pessoal de **Isaac Koga Carone**, desenvolvedor full-stack (React · Java · Python) e estudante de Sistemas de Informação no Mackenzie.

🔗 **https://akog777.github.io**

## Destaques

- Página única, bilíngue (**PT/EN**) e com **modo claro e escuro** (segue o sistema do visitante).
- Projetos sincronizados com a **API do GitHub**, com filtro por área e leitura do README dentro do site.
- Grade curricular interativa por semestre e progresso do curso calculado pela carga horária.
- Feito com **HTML, CSS e JavaScript puro** — sem framework e sem etapa de build.
- Leve: animações só com CSS, respeita `prefers-reduced-motion` e faz uma única chamada à API do GitHub por visita (com cache).

## Estrutura

```
index.html            estrutura da página
assets/css/style.css  visual (cores dos temas no topo do arquivo)
assets/js/app.js      renderização, idioma, tema, projetos e interações
assets/js/github.js   API do GitHub com cache de 30 min
data/content.json     todo o conteúdo do site
```

## Editando o conteúdo

Tudo fica em `data/content.json`. Textos traduzíveis usam `{ "pt": "...", "en": "..." }`.

- `profile` — nome, links, título principal (`headline`), resumo e status.
- `metrics` — números do bloco "Visão geral". O de repositórios (`"id": "repos"`) é contado ao vivo pelo GitHub.
- `experience` — `current: true` marca o cargo atual.
- `projects` — `repo` é o nome do repositório no GitHub; sem ele, use `url` (link externo) ou `internal: true` (projeto privado). `cat` define o filtro: `backend`, `web`, `cloud`, `automation`, `mobile`, `game`.
- `skills`, `certifications`, `education` (etapas em `terms` com `status`: `done`, `current` ou `next`).

Textos fixos da interface (menu, botões, títulos) ficam no objeto `UI` no início de `assets/js/app.js`.

## Rodar localmente

```sh
python -m http.server 8080
```

e acesse http://localhost:8080 (abrir o `index.html` direto não carrega o JSON).

---

© Isaac Koga Carone. Todos os direitos reservados.
