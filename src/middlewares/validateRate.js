async function isThereARateKey(req, res, next) {
  const { talk: { rate } } = req.body;
  if (!rate && Number(rate) !== 0) {
    return res.status(400).json({
      message: 'O campo "rate" é obrigatório',
    });
  } 
  next();
}

async function isRateKeyValid(req, res, next) {
  const { talk: { rate } } = req.body;
  if (!Number.isInteger(rate)) {
    return res.status(400).json({
      message: 'O campo "rate" deve ser um inteiro de 1 à 5',
    });
  }
  if (Number(rate) === 0) {
    return res.status(400).json({
      message: 'O campo "rate" deve ser um inteiro de 1 à 5',
    });
  }
  if (Number(rate) < 1 || Number(rate) > 5) {
    return res.status(400).json({
      message: 'O campo "rate" deve ser um inteiro de 1 à 5',
    });
  } 
  next();
}

module.exports = {
  isThereARateKey,
  isRateKeyValid,
};