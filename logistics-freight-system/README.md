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