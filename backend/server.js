// Importa o Express, framework usado para criar o servidor
const express = require("express");
// Importa o CORS, que permite o frontend acessar o backend
const cors = require("cors");
// Importa a biblioteca SQLite e habilita logs mais detalhados para debug
const sqlite3 = require("sqlite3").verbose();


// Cria a aplicação Express
const app = express();


// Libera o acesso da API para o frontend
app.use(cors());
// Permite que o backend receba dados em formato JSON
app.use(express.json());


// Cria/conecta no banco de dados local
const db = new sqlite3.Database("./database.db");

// Cria a tabela de fretes caso ela ainda não exista
db.run(`
    CREATE TABLE IF NOT EXISTS fretes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        origem TEXT NOT NULL,
        destino TEXT NOT NULL,
        peso REAL NOT NULL,
        valor REAL NOT NULL
    )
`);

app.get("/", (req, res) => {
    res.send("API do sistema de frete funcionando com SQLite!");
});

// Lista todos os fretes salvos no banco
app.get("/fretes", (req, res) => {
    db.all("SELECT * FROM fretes ORDER BY id DESC", [], (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "Erro ao buscar fretes" });
        }

        res.json(rows);
    });
});

// Cadastra novo frete no banco
app.post("/fretes", (req, res) => {
    const { origem, destino, peso, valor } = req.body;

    db.run(
        "INSERT INTO fretes (origem, destino, peso, valor) VALUES (?, ?, ?, ?)",
        [origem, destino, peso, valor],
        function (error) {
            if (error) {
                return res.status(500).json({ error: "Erro ao cadastrar frete" });
            }

            res.status(201).json({
                id: this.lastID,
                origem,
                destino,
                peso,
                valor
            });
        }
    );
});

//Atualizar um frete pelo ID
app.put("/fretes/:id", (req, res) => {
     const id = Number(req.params.id);
     const { origem, destino, peso, valor } = req.body;

     db.run(
        "UPDATE fretes SET origem = ?, destino = ?, peso = ?, valor = ? WHERE id = ?",
        [origem, destino, peso, valor, id],
        function (error) {
            if (error) {
                return res.status(500).json({ error: "Erro ao atualizar frete"});
            }

            res.json({
                id,
                origem,
                destino,
                peso,
                valor
            });
        }
     );
});

// Exclui frete pelo ID
app.delete("/fretes/:id", (req, res) => {
    const id = Number(req.params.id);

    db.run("DELETE FROM fretes WHERE id = ?", [id], function (error) {
        if (error) {
            return res.status(500).json({ error: "Erro ao excluir frete" });
        }

        res.json({ message: "Frete excluído com sucesso" });
    });
});

// Remove todos os fretes do banco
app.delete("/fretes", (req, res) => {
    db.run("DELETE FROM fretes", [], function (error) {
        if (error) {
            return res.status(500).json({ error: "Erro ao resetar base" });
        }

        res.json({ message: "Base resetada com sucesso" });
    });
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000 com SQLite");
});