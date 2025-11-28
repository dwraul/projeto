const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "sua_senha",
  database: "fila",
  port: 5432,
});

module.exports = pool;
