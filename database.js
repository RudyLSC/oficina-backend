const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./oficina.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS chamados (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente TEXT,
      veiculo TEXT,
      manutenção TEXT,
      status TEXT,
      valor REAL,
      aprovado INTEGER
    )
  `);
});

module.exports = db;
