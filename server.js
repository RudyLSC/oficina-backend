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
  const { cliente, veiculo, manutenção } = req.body;

  db.run(
    `INSERT INTO chamados (cliente, veiculo, manutenção, status, valor, aprovado)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [cliente, veiculo, manutenção, 'ABERTO', 0, 0],
    function (err) {
      if (err) return res.status(500).end();
      res.json({ id: this.lastID });
    }
  );
});

// LISTAR CHAMADOS
app.get('/chamados', (req, res) => {
  db.all(`SELECT * FROM chamados`, (err, rows) => {
    if (err) return res.status(500).end();
    res.json(rows);
  });
});

// ATUALIZAR ORÇAMENTO
app.put('/chamados/:id/orcamento', (req, res) => {
  const { valor, aprovado } = req.body;
  const id = req.params.id;

  db.run(
    `UPDATE chamados SET valor = ?, aprovado = ? WHERE id = ?`,
    [valor, aprovado, id],
    function (err) {
      if (err) {
        console.log(err);
        return res.status(500).end();
      }
      res.json({ sucesso: true });
    }
  );
});


// MUDAR STATUS
app.put('/chamados/:id/status', (req, res) => {
  const { status } = req.body;
  const id = req.params.id;

  db.run(
    `UPDATE chamados SET status = ? WHERE id = ?`,
    [status, id],
    function (err) {
      if (err) return res.status(500).end();
      res.json({ sucesso: true });
    }
  );
});

// RELATÓRIO – TOTAL FATURADO
app.get('/relatorios/faturamento', (req, res) => {
  db.get(
    `SELECT 
       COUNT(*) as quantidade,
       SUM(valor) as total
     FROM chamados
     WHERE aprovado = 1`,
    (err, row) => {
      if (err) return res.status(500).end();
      res.json(row);
    }
  );
});

// RELATÓRIO – LISTA DE SERVIÇOS APROVADOS
app.get('/relatorios/servicos', (req, res) => {
  db.all(
    `SELECT cliente, veiculo, valor
     FROM chamados
     WHERE aprovado = 1`,
    (err, rows) => {
      if (err) return res.status(500).end();
      res.json(rows);
    }
  );
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log('Servidor rodando na porta ' + PORT);
});
