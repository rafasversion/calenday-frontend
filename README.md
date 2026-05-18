# Calenday Frontend

**Website:** https://calenday.site

Aplicação SPA em React para gerenciamento de tarefas e eventos. Interface com visualização no modo calendário (mensal, semanal e diário), kanban e uma tela de gerenciamento de tarefas com status (concluídas, em andamento, pendentes e o total), incluindo autenticação.

### Stack

- **Linguagem:** TypeScript
- **Framework:** React
- **Bundler:** Vite
- **Estilização:** CSS Modules
- **Autenticação:** JWT + Google OAuth
- **Ícones:** Lucide

---

### Requisitos

- Node.js >= 18
- npm

---

### Setup

```bash
git clone https://github.com/rafasversion/calenday-frontend.git
cp .env.example .env
npm install
npm run dev
```

---

### Variavéis de Ambiente

| Variável                | Descrição              |
| ----------------------- | ---------------------- |
| `VITE_API_URL`          | URL base da API        |
| `VITE_GOOGLE_CLIENT_ID` | Client ID Google OAuth |

---

### Scripts

| Comando           | Descrição                   |
| ----------------- | --------------------------- |
| `npm run dev`     | Ambiente de desenvolvimento |
| `npm run build`   | Build de produção           |
| `npm run preview` | Pré-visualização            |
| `npm run lint`    | ESLint                      |

---

### Project Structure

```
src/
├── App.tsx
├── main.tsx
├── AppRoutes.tsx
├── components/
│   ├── Calendar/
│   ├── CTA/
│   ├── Events/
│   ├── Features/
│   ├── Footer/
│   ├── Header/
│   ├── Highlight/
│   ├── Kanban/
│   ├── Modal/
│   ├── Notifications/
│   ├── Steps/
│   ├── Tasks/
│   ├── User/
│   └── RouteGuard.tsx
├── contexts/
├── hooks/
├── pages/
├── services/
├── types/
└── utils/
```

---

### Rotas

| Rota               | Componente   | Protegida |
| ------------------ | ------------ | --------- |
| `/`                | Home         | Não       |
| `/login`           | LoginPage    | Não       |
| `/google-login`    | LoginPage    | Não       |
| `/register`        | RegisterPage | Não       |
| `/dashboard/*`     | Dashboard    | Sim       |
| `/tasks/new`       | AddTaskPage  | Sim       |
| `/tasks/edit/:id`  | AddTaskPage  | Sim       |
| `/events/new`      | AddEventPage | Sim       |
| `/events/edit/:id` | AddEventPage | Sim       |
| `/profile`         | ProfilePage  | Sim       |

### Autenticação

Token JWT armazenado em localStorage.
As rotas privadas validam o token antes da renderização. Sessões inválidas redirecionam automaticamente para `/`.

### Funcionalidades

- Login com email/senha
- Login com Google
- Calendário mensal/semanal/diário
- Kanban
- Tabela de tarefas
- Filtros
- Ordenação
- Paginação
- CRUD de tarefas
- CRUD de eventos
- Notificações
- Perfil
- Layout responsivo

## Licença

`MIT license`
