const express = require('express');
const crypto = require('crypto');
const { validateEmail, validatePassword } = require('./middlewares/validateActivities');
const validateAuth = require('./middlewares/auth');
const { readJSON, writeJSON } = require('./utils/fsUtils');
const { isAgeANumberDifferentFromZero, isAnAdult } = require('./middlewares/validateAge');

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

async function validateName(req, res, next) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({
      message: 'O campo "name" é obrigatório',
    });
  } if (name.length < 3) {
    return res.status(400).json({
      message: 'O "name" deve ter pelo menos 3 caracteres',
    });
  } 
  next();
}

async function isThereATalkKey(req, res, next) {
  const { talk } = req.body;
  if (!talk) {
    return res.status(400).json({
      message: 'O campo "talk" é obrigatório',
    });
  } 
  next();
}

async function isThereAWatchedAtKey(req, res, next) {
  const { talk: { watchedAt } } = req.body;
  if (!watchedAt) {
    return res.status(400).json({
      message: 'O campo "watchedAt" é obrigatório',
    });
  } if (watchedAt.split('/').length !== 3) {
    return res.status(400).json({
      message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
    });
  }
  next();
}

async function isWatchedAtAYear(req, res, next) {
  const { talk: { watchedAt } } = req.body;
  if (Number(watchedAt.split('/')[2]) < 1) {
    return res.status(400).json({
      message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
    });
  }
  next();
}

async function isWatchedAtADay(req, res, next) {
  const { talk: { watchedAt } } = req.body;
  if (Number(watchedAt.split('/')[0]) < 1 || Number(watchedAt.split('/')[0]) > 31) {
    return res.status(400).json({
      message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
    });
  } 
  next();
}

async function isWatchedAtAMonth(req, res, next) {
  const { talk: { watchedAt } } = req.body;
  if (typeof watchedAt !== 'number') {
    return res.status(400).json({
      message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
    });
  }
  if (Number(watchedAt.split('/')[1]) < 1 || Number(watchedAt.split('/')[1]) > 12) {
    return res.status(400).json({
      message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
    });
  }  
  next();
}

app.post('/talker', 
  validateAuth, 
  validateName,
  isAgeANumberDifferentFromZero,
  isAnAdult,
  isThereATalkKey,
  isThereAWatchedAtKey,
  isWatchedAtADay,
  isWatchedAtAMonth,
  isWatchedAtAYear,
  async (req, res) => res.status(201).json(req.body));

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
