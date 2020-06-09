const express = require('express');
const darkHelper = require('../helpers');
const Character = require('../models/Character');
const Event = require('../models/Event');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('timeline', { layout: 'chart' , periods: darkHelper.periods})
});

// TIMELINES - JSON of EVERYTHING
router.get('/timeline', (req, res) => {
  Character.find({}).populate("periods.events").exec((err, dbChar) => {
    if (err) {
      console.log(err);
    } else {
      res.send({ characters: dbChar, period: darkHelper.periods[req.params.p] });
    }
  });
});

// PERIODS - JSON INDEX
router.get('/periods', (req, res) => {
  res.json(darkHelper.periods);
});


module.exports = router;
