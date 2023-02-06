const express = require('express');
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

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
