import express from 'express'
const router = express.Router();

router.get('/', (req, res, next) => {
  res.redirect('/inventory');
});

export const indexRouter = router
