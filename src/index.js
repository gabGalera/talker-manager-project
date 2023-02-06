const express = require('express');
const crypto = require('crypto');
const { validateEmail, validatePassword } = require('./middlewares/validateActivities');
const validateName = require('./middlewares/validateName');
const validateAuth = require('./middlewares/auth');
const { readJSON, writeJSON } = require('./utils/fsUtils');
const { isAgeANumberDifferentFromZero, isAnAdult } = require('./middlewares/validateAge');
const {
  isThereATalkKey,
  isThereAWatchedAtKey,
  isWatchedAtADay,
  isWatchedAtAMonth,
  isWatchedAtAYear,
} = require('./middlewares/validateWatchedAt');
const {
  isThereARateKey,
  isRateKeyValid,
} = require('./middlewares/validateRate');

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
  isThereARateKey,
  isRateKeyValid,
  async (req, res) => {
    const newEntry = req.body;
    const data = await readJSON();
    newEntry.id = data.length + 1;
    await writeJSON(newEntry);
    res.status(201).json(req.body); 
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
