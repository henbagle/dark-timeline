const express = require('express');
const darkHelper = require('../helpers');
const Character = require('../models/Character');
const Event = require('../models/Event');

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/season-1');
});

router.get('/summer-2019', (req, res) => {
  res.render('s0', { layout: 'chart' });
});

router.get('/season-1', (req, res) => {
  res.render('s1', { layout: 'chart' });
});

router.get('/season-2', (req, res) => {
  res.render('s2', { layout: 'chart' });
});

// TIMELINES - JSON of EVERYTHING
router.get('/timeline', (req, res) => {
  Character.find({}).populate("periods.events").exec((err, dbChar) => {
    if (err) {
      console.log(err);
    } else {
      res.send({ characters: dbChar, periods: darkHelper.periods });
    }
  });
});

// PERIODS - JSON INDEX
router.get('/periods', (req, res) => {
  res.json(darkHelper.periods);
});


module.exports = router;
