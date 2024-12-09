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

// CONSULTAR
app.get('/produtos', (req, res) => {
  const sql = 'SELECT * FROM produto';

  conexao.query(sql, (erro, resultados) => {
    if (erro) {
      console.error(erro);
      return res.status(500).json({ mensagem: 'Erro ao consultar os produtos.' });
    }
    res.status(200).json(resultados);
  });
});

// CONSULTAR POR ID
app.get('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM produto WHERE id = ?';

  conexao.query(sql, [id], (erro, resultado) => {
    if (erro) {
      console.error(erro);
      return res.status(500).json({ mensagem: 'Erro ao consultar o produto.' });
    }

    if (resultado.length > 0) {
      res.status(200).json(resultado[0]);
    } else {
      res.status(404).json({ mensagem: 'Produto não encontrado.' });
    }
  });
});

// ALTERAR
app.put('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, quantidade, preco } = req.body;

  if (!nome || quantidade == null || preco == null) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios: nome, quantidade, e preco.' });
  }

  const sql = 'UPDATE produto SET nome = ?, quantidade = ?, preco = ? WHERE id = ?';
  const valores = [nome, quantidade, preco, id];

  conexao.query(sql, valores, (erro, resultado) => {
    if (erro) {
      console.error(erro);
      return res.status(500).json({ mensagem: 'Erro ao atualizar o produto.' });
    }

    if (resultado.affectedRows > 0) {
      res.status(200).json({ mensagem: 'Produto atualizado com sucesso!' });
    } else {
      res.status(404).json({ mensagem: 'Produto não encontrado.' });
    }
  });
});

// DELETAR
app.delete('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM produto WHERE id = ?';

  conexao.query(sql, [id], (erro, resultado) => {
    if (erro) {
      console.error(erro);
      return res.status(500).json({ mensagem: 'Erro ao deletar o produto.' });
    }

    if (resultado.affectedRows > 0) {
      res.status(200).json({ mensagem: 'Produto deletado com sucesso!' });
    } else {
      res.status(404).json({ mensagem: 'Produto não encontrado.' });
    }
  });
});

//INSERIR
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
