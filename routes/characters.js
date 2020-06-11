const express = require('express');
const darkHelper = require('../helpers');
const Character = require('../models/Character');
const Event = require('../models/Event');


const router = express.Router();


// EDITOR INDEX
router.get('/editor', (req, res) => {
  Character.find({}, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      results.sort(darkHelper.characterSort)
      res.render('editor/editorIndex', { layout: 'edit', characters: results });
    }
  }).sort('name');
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
      dbChar.sort(darkHelper.characterSort)
      res.json(dbChar);
    }
  }).populate('periods.entries');
});

// CHARACTER - NEW
router.get('/editor/character/new', (req, res) => {
  res.render('editor/newCharacter', { layout: 'edit', periods: darkHelper.periods });
});

// CHARACTER - CREATE
router.post('/editor/character', (req, res) => {
  const newCharacter = req.body.char;
  for (let i = 0; i < newCharacter.periods.length; i++) {
    if (newCharacter.periods[i].default == 1) {
      newCharacter.periods[i].default = true;
    } else {
      newCharacter.periods[i].default = false;
    }
  }
  Character.create(newCharacter, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/editor');
    }
  });
});

// CHARACTER - EDIT
router.get('/editor/character/:id/edit', (req, res) => {
  Character.findById(req.params.id).populate('periods.events').exec((err, dbChar) => {
    if (err) {
      console.log(err);
    } else {
      for(let i=0; i<dbChar.periods.length; i++){
        dbChar.periods[i].events.sort((a, b) => a.x - b.x)
      }

      res.render('editor/editCharacter', {
        layout: 'edit',
        periods: darkHelper.periods,
        oldChar: dbChar,
        helpers: {
          hiddenI(input) { // returns the initial value for the hidden input tracking default checkbox changes
            if (input) {
              return '1';
            }

            return '0';
          },
          checkLine(w, text) { // Given an index and the value in db, returns whether or not this radial menu option should be checked
            if (text === 'straight' && w === 1) {
              return 'checked';
            }
            if (text === 'dashed' && w === 2) {
              return 'checked';
            }
            if (text === 'dashdot' && w === 3) {
              return 'checked';
            }
            return(null);
          },
          pName(input) { // Returns the period name at the index of the input
            return darkHelper.periods[input].name;
          },
        },
      });
    }
  });
});

// CHARACTER - PUT
router.put('/editor/character/:id', (req, res) => {
  const newCharacter = req.body.char;
  Character.findById(req.params.id).populate("periods.events").exec((err, old) => {
    for (let i = 0; i < newCharacter.periods.length; i++) {
      if (newCharacter.periods[i].default == 1) {
        newCharacter.periods[i].default = true;
      } else {
        newCharacter.periods[i].default = false;
      }
      newCharacter.periods[i].events = old.periods[i].events
    }

    Character.findByIdAndUpdate(req.params.id, newCharacter, (err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/editor');
      }
    });
    
  })
});

// CHARACTER - DELETE                                                           // Todo: Go through each linked event, deleting references to character, delete events if necessary
router.delete('/editor/character/:id', (req, res) => {
  Character.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/editor');
    }
  });
});

module.exports = router;
