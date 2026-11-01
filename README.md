# Isaac Koga — Portfolio

Portfólio pessoal feito com **HTML, TailwindCSS e JavaScript puro**. Todo o conteúdo fica em arquivos JSON (`public/data/`) e os projetos são puxados automaticamente da **API do GitHub** (`akog777`), com o README de cada repositório renderizado dentro do site.

> Estrutura inspirada no portfólio [vdidoff](https://github.com/SgT012003/vdidoff) (MPL-2.0), com identidade visual, conteúdo e várias partes do código refeitos.

## Páginas

| Página | Arquivo | Dados |
| --- | --- | --- |
| Home (hero, números, skills, projetos em destaque) | `public/index.html` | `profile.json`, `skills.json`, `projects.json` |
| Experiência (timeline) | `public/experience.html` | `exp.json` |
| Acadêmico (progresso do curso + notas) | `public/academic.html` | `academic.json` |
| Certificados + página de detalhe | `public/certifications.html`, `cert-detail.html` | `certs.json` |
| Projetos (GitHub) + leitura do README | `public/projects.html`, `project-view.html` | `projects.json`, `blacklist.json` |

## Como editar o conteúdo

Só mexa nos JSON de `public/data/` — não precisa tocar no HTML.

- **`profile.json`** — nome, título, links (GitHub, LinkedIn, e-mail), texto do topo e os 3 números de destaque.
- **`exp.json`** — experiências. `highlights` vira a lista de conquistas; `current: true` destaca o cargo atual.
- **`academic.json`** — `start`/`end` calculam a barra de progresso. Em `terms`, cada semestre tem `courses` com `grade` (0–10). Enquanto `grade` for `null`, aparece "In progress" (no semestre com `current: true`) ou "—" (nos anteriores); quando você preencher notas, as médias e o gráfico de desempenho aparecem sozinhos.
- **`certs.json`** — certificados. Opcional: `date` (`"2025-06-10"`), `url` (link de validação, ex.: Credly) e `file` (caminho de um PDF/imagem em `public/assets/certs/`, que é exibido na página do certificado).
- **`projects.json`**
  - `alias`: muda título, descrição, stack e ordem de um repositório do GitHub (`featured: true` coloca na Home).
  - `extra`: projetos que não estão no seu GitHub (ex.: repositório de organização, projetos internos). `url: null` gera um card sem link.
- **`blacklist.json`** — repositórios que não devem aparecer.

## Rodando localmente

```sh
npm install
npm run build      # gera public/assets/style.css
npm run serve      # abre em http://localhost:3000
```

Durante o desenvolvimento, `npm run dev` recompila o CSS a cada alteração. **Sempre rode `npm run build` depois de mudar classes no HTML/JS**, porque o Tailwind só gera as classes que encontra nos arquivos.

> Abrir o `index.html` direto pelo explorador de arquivos não funciona (o navegador bloqueia o `fetch` dos JSON). Use o `npm run serve` ou a extensão *Live Server* do VS Code.

## Publicando no GitHub Pages (grátis)

1. Crie um repositório chamado **`akog777.github.io`** e suba esta pasta inteira (com o `public/assets/style.css` já gerado).
2. Em **Settings → Pages**, escolha *Deploy from a branch*, branch `main`, pasta `/ (root)`.
3. O site fica em `https://akog777.github.io` (o `index.html` da raiz redireciona para `/public/`).

Para usar um domínio próprio, crie um arquivo `CNAME` na raiz com o domínio.

## Detalhes técnicos

- A API pública do GitHub permite 60 requisições/hora por visitante; as respostas ficam em cache no `sessionStorage` por 30 min, e a página de projetos faz **uma** requisição só.
- Se a API falhar, a página de projetos monta os cards a partir do `projects.json` em vez de ficar vazia.
- O README é convertido com `marked` e sanitizado com `DOMPurify`; imagens e links relativos do README são reescritos para apontar ao GitHub.
- Cabeçalho e rodapé são gerados em `public/js/layout.js` — edite em um lugar só.

## Licença

MPL-2.0 — veja `LICENSE`.
