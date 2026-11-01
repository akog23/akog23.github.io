# Isaac Koga — Portfolio v2 (HUD)

Portfólio de página única com visual futurista (interface tipo HUD): fundo animado com grade em perspectiva e rede de partículas, sequência de boot, nome com efeito glitch, painel de status com relógio de São Paulo, contadores animados, linha do tempo, projetos com filtro e efeito 3D, leitor de README dentro do site e um **terminal interativo** na seção de contato.

Site **bilíngue (PT/EN)**: o idioma inicial segue o navegador do visitante e pode ser trocado no botão do topo (ou com `lang en` / `lang pt` no terminal).

Feito com **HTML, CSS e JavaScript puro** — não precisa de build, `npm` nem Tailwind.

## Estrutura

```
index.html            estrutura da página
assets/css/style.css  todo o visual (cores em :root, no topo do arquivo)
assets/js/app.js      renderização, idioma, terminal, projetos, animações
assets/js/bg.js       fundo animado (canvas)
assets/js/github.js   API do GitHub com cache de 30 min
data/content.json     TODO o conteúdo do site
```

## Editando o conteúdo

Tudo fica em `data/content.json`. Textos traduzíveis usam o formato `{ "pt": "...", "en": "..." }`; textos iguais nos dois idiomas podem ser uma string simples.

- `profile` — nome, links, status, frases que são "digitadas" no topo (`roles`) e resumo.
- `metrics` — os 4 números animados. O de repositórios (`"id": "repos"`) é contado ao vivo pelo GitHub.
- `experience` — `current: true` marca o cargo atual com o selo verde.
- `projects` — `repo` é o nome do repositório no GitHub (abre o README no site). Sem `repo`, use `url` para um link externo ou `internal: true` para projeto privado. `cat` define o filtro: `backend`, `web`, `cloud`, `automation`, `mobile`, `game`.
- `skills`, `certifications`, `education`.

Para mudar textos fixos da interface (menu, botões, comandos do terminal), edite o objeto `UI` no início de `assets/js/app.js`.

## Rodar localmente

O navegador bloqueia o carregamento do JSON se você abrir o arquivo direto. Use um servidor simples:

```sh
python -m http.server 8080
# ou: npx serve .
```

e acesse http://localhost:8080.

## Publicação

Está pronto para o GitHub Pages: com o repositório `akog777.github.io` e o Pages apontando para `main` / `(root)`, o site fica em https://akog777.github.io.

## Acessibilidade e desempenho

- Respeita `prefers-reduced-motion` (sem boot, glitch nem animações).
- A animação de fundo pausa quando a aba não está visível.
- Uma única chamada à API do GitHub por visita (com cache), e o site funciona mesmo se ela falhar.
