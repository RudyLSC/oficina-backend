const express = require('express');
const app = express();
const db = require('./database');

app.use(express.json());

const USUARIO = 'Admin';
const SENHA = '1234';

// LOGIN
app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;
  if (usuario === USUARIO && senha === SENHA) {
    return res.json({ sucesso: true });
  }
  return res.status(401).json({ sucesso: false });
});

// CRIAR CHAMADO
app.post('/chamados', (req, res) => {
  const { cliente, veiculo, problema } = req.body;

  const stmt = db.prepare(`
    INSERT INTO chamados (cliente, veiculo, problema, status, valor, aprovado)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(cliente, veiculo, problema, 'ABERTO', 0, 0);

  res.json({ id: result.lastInsertRowid });
});

// LISTAR CHAMADOS
app.get('/chamados', (req, res) => {
  const rows = db.prepare(`SELECT * FROM chamados`).all();
  res.json(rows);
});

// ATUALIZAR ORÇAMENTO
app.put('/chamados/:id/orcamento', (req, res) => {
  const { valor, aprovado } = req.body;
  const id = req.params.id;

  db.prepare(
    `UPDATE chamados SET valor = ?, aprovado = ? WHERE id = ?`
  ).run(valor, aprovado, id);

  res.json({ sucesso: true });
});

// MUDAR STATUS
app.put('/chamados/:id/status', (req, res) => {
  const { status } = req.body;
  const id = req.params.id;

  db.prepare(
    `UPDATE chamados SET status = ? WHERE id = ?`
  ).run(status, id);

  res.json({ sucesso: true });
});

// RELATÓRIO – TOTAL FATURADO
app.get('/relatorios/faturamento', (req, res) => {
  const row = db.prepare(`
    SELECT COUNT(*) as quantidade, SUM(valor) as total
    FROM chamados
    WHERE aprovado = 1
  `).get();

  res.json(row);
});

app.get('/relatorios/servicos', (req, res) => {
  const rows = db.prepare(`
    SELECT cliente, veiculo, valor
    FROM chamados
    WHERE aprovado = 1
  `).all();

  res.json(rows);
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log('Servidor rodando na porta ' + PORT);
});
