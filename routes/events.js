const express = require('express');
const darkHelper = require('../helpers');
const Character = require('../models/Character');
const Event = require('../models/Event');

const router = express.Router();

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

// EVENT - NEW
router.get('/editor/event/new', (req, res) => {           // Get the create new event page
    res.render('editor/eventEditor', { layout: 'edit' });
  });
  
// EVENT - EDIT
router.get('/editor/event/:id/edit', (req, res) => {      // Get the edit existing event page. Event data is fetched with AJAX by React on page load
res.render('editor/eventEditor', { layout: 'edit', id: req.params.id });
});
  
// EVENT - CREATE     
router.post('/editor/event', (req, res) => {              // Process create form

let newEvent = req.body.event;

if(!newEvent.characters){                               // Make sure we've selected a character! TODO: Do this on react instead
    res.json({ok:false})
}
else{
    newEvent.characters = docsToId(newEvent.characters);  // Turn those populated characters into IDs, we don't need them

    Event.create(newEvent, (err, dbCreate) => {           // Create the event
    if(err){
        console.log(err);
    }

    else{
        newEvent.characters.forEach((char) => {      // For each character this event belongs to
        addEventToChar(char, dbCreate)
        })

        res.json({ok:true})                              // return ok
    }
    });
}
});

// EVENT - PUT                                                                      // TODO
router.put('/editor/event/:id', (req, res) => {
let editEvent = req.body.event;         // The edited event from React
editEvent.characters = docsToId(editEvent.characters)


Event.findById(editEvent["_id"], (err, toEdit) => {
    if(err){
    console.log(err);
    }
    else{

    editEvent.characters.forEach((char) => {     // Check for new characters
        if(!toEdit.characters.includes(char)){ // if the old array doesn't include this element of the new one
        addEventToChar(char, editEvent);
        }
    })
    
    toEdit.characters.forEach((char) => {                 // Check for deleted characters
        let oChar = char.toString();
        if(!editEvent.characters.includes(oChar)){ // if the new array doesn't include an element from the old array
        delEventFromChar(char, editEvent);
        }
    })

    Event.findByIdAndUpdate(editEvent["_id"], editEvent, (err) => {
        if(err){
        console.log(err);
        }
        else{
        res.json({ok:true});
        }
    })
    }
})

});

// EVENT - DELETE
router.delete('/editor/event/:id', (req, res) => {
Event.findById(req.params.id, (err, deleted) => {
    if(err){
    console.log(err);
    }
    else{
    deleted.characters.forEach((char) => {             // find each character this event relates to
        delEventFromChar(char, deleted);
    })
    Event.findByIdAndDelete(req.params.id, (err) => { // also delete the event
        if (err) {
        console.log(err);
        } else {
        res.json({ok:true});
        }
    });
    }
})

});

function docsToId(list){
if(!list){
    return([])
}
else{
    return list.map((val) => {
    return(val["_id"]);
    })
}
}

function delEventFromChar(charId, event){
Character.findById(charId, (err, toUpdate) => {
    if(err){
    console.log(err);
    }
    else{
    let element = toUpdate.periods[Number(event.period)].events.indexOf(event["_id"]) // delete it from the list
    toUpdate.periods[Number(event.period)].events.splice(element, 1);
    toUpdate.save();
    }
})
}

function addEventToChar(charId, event){
Character.findById(charId).populate("periods.events").exec((err, toUpdate) => {  // get them
    if(err){
    console.log(err);
    }

    toUpdate.periods[Number(event.period)].events.push(event)                   // Add this event to that character
    toUpdate.periods[Number(event.period)].events.sort((a, b) => {return(a["x"] - b["x"])}) // Sort the period by perceived time
    toUpdate.save();
})
}

module.exports = router;