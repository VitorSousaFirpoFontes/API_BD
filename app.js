const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

const conexao = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'produtos'
});

conexao.connect(function(erro) {
  if (erro) throw erro;
  console.log('Conexão efetuada com sucesso');
});

app.post('/produtos', (req, res) => {
  const { nome, quantidade, preco } = req.body;

  if (!nome || quantidade == null || preco == null) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios: nome, quantidade, e preco.' });
  }

  const sql = 'INSERT INTO produto (nome, quantidade, preco) VALUES (?, ?, ?)';
  const valores = [nome, quantidade, preco];

  conexao.query(sql, valores, (erro, resultado) => {
    if (erro) {
      console.error(erro);
      return res.status(500).json({ mensagem: 'Erro ao inserir produto no banco de dados.' });
    }

    res.status(201).json({
      mensagem: 'Produto cadastrado com sucesso!',
      produto: { id: resultado.insertId, nome: nome, quantidade: quantidade, preco: preco }
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
