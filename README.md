# Logistics Freight System 🚛📊

Sistema fullstack para cadastro, cálculo, gestão e análise de fretes.

## 📌 Objetivo

Este projeto foi desenvolvido como um sistema de gestão logística, permitindo cadastrar fretes, calcular valores automaticamente, visualizar indicadores operacionais e analisar dados por destino.

## 🚀 Funcionalidades

- Cadastro de fretes
- Edição de fretes
- Exclusão com confirmação
- Reset da base de dados
- Cálculo automático do valor do frete
- Filtro por origem e destino
- Dashboard com KPIs
- Gráfico de fretes por destino
- Insights operacionais automáticos
- Persistência com SQLite
- API REST com Express

## 📊 Indicadores

- Total de fretes
- Faturamento total
- Peso total transportado
- Ticket médio
- Rota mais usada
- Maior frete
- Média de peso

## 🛠️ Tecnologias

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express
- SQLite

## 📁 Estrutura do projeto

```txt
logistics-freight-system/
├── backend/
│   ├── server.js
│   ├── database.db
│   └── package.json
│
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js

    ▶️ Como rodar localmente
Backend
cd backend
npm install
node server.js

A API ficará disponível em:

http://localhost:3000/fretes
Frontend

Abra o arquivo:

frontend/index.html

ou use a extensão Live Server no VS Code.

🔗 Endpoints da API
Listar fretes
GET /fretes
Cadastrar frete
POST /fretes
Editar frete
PUT /fretes/:id
Excluir frete
DELETE /fretes/:id
Resetar base
DELETE /fretes
📌 Status

Projeto em desenvolvimento contínuo.

🧭 Próximas melhorias
Autenticação de usuário
Migração para PostgreSQL
Deploy online
Versão em React
Integração com Power BI