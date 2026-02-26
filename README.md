# portal-official

Projeto consolidado para HERO + TOOLS + WHAT''S NEW + ADMIN, com base nas variacoes Node/Next.

## Status atual

### Publico

- HERO implementado
- TOOLS implementado
- What''s New implementado na home
- API publica de noticias:
  - `GET /api/public/news?page=1&page_size=3`
  - `GET /api/public/news/:id`

### Admin (Passo 2)

- Login real via API (`POST /api/auth/login`) com cookie HttpOnly
- Sessao persistida em arquivo (`data/app-db.json`)
- Validacao de sessao em paginas admin (server-side)
- Logout real (`POST /api/auth/logout`)
- Endpoint de usuario autenticado (`GET /api/auth/me`)
- CRUD completo de noticias:
  - `GET /api/admin/news`
  - `POST /api/admin/news`
  - `GET /api/admin/news/:id`
  - `PUT /api/admin/news/:id`
  - `DELETE /api/admin/news/:id`
- UI Admin conectada aos endpoints (login/dashboard/criar/editar/excluir)

## Configuracao de credenciais

- Defina `ADMIN_EMAIL` no arquivo `.env` (obrigatorio para ambiente local).
- Defina `ADMIN_PASSWORD` no arquivo `.env` (obrigatorio para ambiente local).
- `JWT_ACCESS_TTL_SECONDS` pode ser definido no `.env` (sugestao: `3600`).

## Observacao tecnica

A persistencia atual usa arquivo JSON local em `data/app-db.json` para simplificar esta entrega. Em producao, recomenda-se migrar para banco transacional.
