const express = require('express');
const crypto = require('crypto');
const { validateEmail, validatePassword } = require('./middlewares/validateActivities');
const { readJSON, writeJSON } = require('./utils/fsUtils');

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

app.post('/login', validateEmail, validatePassword, async (req, res) => {
    const token = generateToken();
    return res.status(200).json({
      token,
    });
});

app.post('/talker', async (req, res) => {
  const { authorization } = req.headers;
  const { name, age, talk } = req.body;
  if (!authorization) {
    return res.status(401).json(
      {
        message: 'Token não encontrado',
      },
    );
  } if (typeof authorization !== 'string' || authorization.length !== 16) {
    return res.status(401).json({
      message: 'Token inválido',
    });
  } 
  if (!name) {
    return res.status(400).json({
      message: 'O campo "name" é obrigatório',
    });
  } if (name.length) {
    return res.status(400).json({
      message: 'O "name" deve ter pelo menos 3 caracteres',
    });
  } if (!age && age !== 0) {
    return res.status(400).json({
      message: 'O campo "age" é obrigatório',
    });
  } if (typeof age !== 'number') {
    return res.status(400).json({
      message: 'O campo "age" deve ser do tipo "number"',
    });
  } if (!Number.isInteger(age)) {
    return res.status(400).json({
      message: 'O campo "age" deve ser um "number" do tipo inteiro',
    });
  }
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
