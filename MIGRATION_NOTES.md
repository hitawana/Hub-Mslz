# Estudo Django (nit-hub-test02) para migracao futura

## Admin - como funciona hoje

- Backend Django REST usa `AdminUser` + `AdminSession` para sessao.
- Login: `POST /api/auth/login/` valida bcrypt e cria JWT com `jti`.
- JWT vai para cookie HttpOnly `nit_admin`.
- A autenticacao valida token + sessao ativa no banco (`AdminSession`).
- Logout remove sessao e limpa cookie.
- CRUD de noticias protegido por `IsAuthenticated`:
  - `GET /api/admin/news/`
  - `POST /api/admin/news/create/`
  - `GET/PUT/PATCH/DELETE /api/admin/news/:id/`
- Frontend Next usa `middleware.ts` para bloquear `/admin/*` sem cookie.
- Frontend admin tem login, dashboard, formulario de criacao/edicao/exclusao.

## Whats New - como funciona hoje

- Fonte de dados: modelo `News` no Django.
- Endpoint publico: `GET /api/news/?page=N`.
- Regra: noticia mais recente vira `featured`.
- Restante vem paginado (3 itens por pagina) via DRF paginator.
- Frontend exibe:
  - 1 card principal (`featured`)
  - 3 cards secundarios
  - paginacao por dots
  - autoplay de pagina no client
  - modal de detalhe ao clicar

## Adaptacoes necessarias para Node/Next depois

- Recriar modelos de `AdminUser`, `AdminSession`, `News` em Prisma (ou equivalente).
- Portar autenticacao com cookie HttpOnly + sessao persistida.
- Reimplementar endpoints admin/public com mesmas regras de negocio.
- Migrar validacoes (tags, redirect, campos obrigatorios) para schema no backend Node.
- Reproduzir middleware de protecao de rotas admin.
- Reimplementar paginacao `featured + 3 itens` e contrato de resposta para What''s New.
- Garantir compatibilidade de timezone/data no front para evitar hydration mismatch.
