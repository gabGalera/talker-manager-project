const feedback = 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"';

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
      message: feedback,
    });
  }
  next();
}

async function isWatchedAtAYear(req, res, next) {
  const { talk: { watchedAt } } = req.body;
  if (watchedAt.split('/')[2].length !== 4) {
    return res.status(400).json({
      message: feedback,
    });
  }
  next();
}

async function isWatchedAtADay(req, res, next) {
  const { talk: { watchedAt } } = req.body;
  if (watchedAt.split('/')[0].length !== 2) {
    return res.status(400).json({
      message: feedback,
    });
  } 
  next();
}

async function isWatchedAtAMonth(req, res, next) {
  const { talk: { watchedAt } } = req.body;
  if (watchedAt.split('/')[1].length !== 2) {
    return res.status(400).json({
      message: feedback,
    });
  }
  next();
}

module.exports = {
  isThereATalkKey,
  isThereAWatchedAtKey,
  isWatchedAtADay,
  isWatchedAtAMonth,
  isWatchedAtAYear,
};