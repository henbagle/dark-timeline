const express = require('express');
const darkHelper = require('./helpers');
const Character = require('./mCharacter');
const Event = require('./mEvent');

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

router.get('/timeline', (req, res) => {
  Character.find({}).populate("periods.events").exec((err, dbChar) => {
    if (err) {
      console.log(err);
    } else {
      res.send({ characters: dbChar, periods: darkHelper.periods });
    }
  });
});

// CHARACTER - JSON INDEX
router.get('/character', (req, res) => {
  Character.find({}, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.json({ chars: results, periods: darkHelper.periods });
    }
  }).populate('periods.entries').sort('name');
});

// CHARACTER - JSON GET
router.get('/character/:id', (req, res) => {
  Character.findOne({ _id: req.params.id }, (err, dbChar) => {
    if (err) {
      console.log(err);
    } else {
      res.json(dbChar);
    }
  }).populate('periods.entries');
});

// EVENTS - JSON INDEX
router.get('/event', (req, res) => {
  Event.find({}, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.json({ events: results, periods: darkHelper.periods });
    }
  }).populate('characters').sort('name');
});

// EVENT - JSON GET
router.get('/event/:id', (req, res) => {
  Event.findOne({ _id: req.params.id }, (err, dbEvent) => {
    if (err) {
      console.log(err);
    } else {
      res.json(dbEvent);
    }
  }).populate('characters');
});

// PERIODS - JSON INDEX
router.get('/periods', (req, res) => {
  res.json(darkHelper.periods);
});


module.exports = router;
