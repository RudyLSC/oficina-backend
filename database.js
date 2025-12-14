const Database = require('better-sqlite3');

const db = new Database('oficina.db');

// Cria tabela se não existir
db.prepare(`
  CREATE TABLE IF NOT EXISTS chamados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente TEXT,
    veiculo TEXT,
    problema TEXT,
    status TEXT,
    valor REAL,
    aprovado INTEGER
  )
`).run();

module.exports = db;
