const express = require('express');
const crypto = require('crypto');
const { readJSON } = require('./utils/fsUtils');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await readJSON();
  const talker = talkers.filter((data) => data.id === Number(id));
  if (talker.length > 0) {
    return res.status(200).json(talker[0]);
  } 
    return res.status(404).json({
      message: 'Pessoa palestrante não encontrada',
    });
});

app.get('/talker', async (_req, res) => {
  const data = await readJSON();
  if (data) {
    return res.status(200).json(data);
  } 
    return res.status(200).json([]);
});

function generateToken() {
  return crypto.randomBytes(8).toString('hex');
}

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const tester = /\w+@\w+\.\w+/;
  if (!email) {
    return res.status(400).json({
      message: 'O campo "email" é obrigatório',
    });
  } if (!tester.test(email)) {
    return res.status(400).json({
      message: 'O "email" deve ter o formato "email@email.com"',
    });
  } if (!password) {
    return res.status(400).json({
      message: 'O campo "password" é obrigatório',
    });
  } if (password.length < 6) {
    return res.status(400).json({
      message: 'O "password" deve ter pelo menos 6 caracteres',
    });
  } 
    const token = generateToken();
    return res.status(200).json({
      token,
    });
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
