const express = require('express');
const darkHelper = require('../helpers');
const Character = require('../models/Character');
const Event = require('../models/Event');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('timeline', { layout: 'chart' , periods: darkHelper.periods, hasTimeline: true})
});

router.get("/faq", (req, res) => {
  res.render("faq", {layout: 'chart'})
})

// TIMELINES - JSON of EVERYTHING
router.get('/timeline/:p', (req, res) => {
  let p = req.params.p;
  if(p == 3){                 // Comment this if statement out when season 3 happens
    p = '2'
  }
  Character.find({}).populate("periods."+p+".events").exec((err, dbChar) => {
    if (err) {
      console.log(err);
    } else {
      res.send({ characters: dbChar, period: darkHelper.periods[p], periodN: p });
    }
  });
});

// PERIODS - JSON INDEX
router.get('/periods', (req, res) => {
  res.json(darkHelper.periods);
});


module.exports = router;
