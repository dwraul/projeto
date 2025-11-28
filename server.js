const express = require("express");
const path = require("path");
const pool = require("./db");

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/fila", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM fila ORDER BY criado_em ASC");
  res.json(rows);
});

app.post("/api/fila", async (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ erro: "Nome é obrigatório" });

  const { rows } = await pool.query(
    "INSERT INTO fila (nome) VALUES ($1) RETURNING *",
    [nome]
  );
  res.json(rows[0]);
});

app.delete("/api/fila/proximo", async (req, res) => {
  const { rows } = await pool.query(
    `DELETE FROM fila
     WHERE id = (SELECT id FROM fila ORDER BY criado_em ASC LIMIT 1)
     RETURNING *`
  );
  if (rows.length === 0) return res.json({ msg: "Fila vazia" });
  res.json({ chamado: rows[0] });
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
