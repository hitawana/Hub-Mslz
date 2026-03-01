# Hub MSLZ Portal

Portal institucional em Next.js para centralizar conteúdo público e gestão administrativa.

A aplicação reúne as seções Hero, Tools, What's New e Tutorials na home pública, além de autenticação e painel Admin para gerenciamento de notícias e tutoriais.

## Funcionalidades principais

- Home pública com Hero, Tools, What's New e Tutorials
- Busca de conteúdo na home (notícias, ferramentas e tutoriais)
- Autenticação administrativa com cookie HttpOnly e sessão persistida
- CRUD de notícias e tutoriais via rotas internas em `app/api`

## Dados e seed

O seed é aplicado quando o arquivo de dados ainda não existe.

- Arquivo de dados local padrão: `data/app-db.json`
- Em ambiente Vercel: `"/tmp/app-db.json"` quando `VERCEL` está definido
- Implementação: `lib/server/db.ts`

Fontes de seed:

- Notícias: `lib/news/data.ts`
- Tutoriais e plataformas: `lib/tutorials/data.ts`

Regra atual:

- O seed é executado apenas na criação inicial do arquivo de dados.
- Se o arquivo já existir, os dados não são sobrescritos automaticamente.

## Estrutura de pastas

```text
app/         # páginas (App Router) e rotas de API
components/  # componentes de UI (hero, tools, news, tutorials, admin, etc.)
lib/         # regras de domínio, serviços, tipos e utilitários
public/      # assets estáticos
data/        # arquivo JSON local de persistência
```
