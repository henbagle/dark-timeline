const   express = require("express"),
        darkHelper = require("./helpers"),
        Character = require("./mCharacter"),
        Event = require("./mEvent");

    

let router = express.Router();


// EDITOR INDEX
router.get("/editor", function(req, res){
    Character.find({}, function(err, results){
        if(err){
            console.log(err)
        }
        else{
            res.render("editor/index", {layout: "edit", characters: results})
        }
    }).sort("name")
})

////////////////////
// Character Routes
////////////////////

// CHARACTER - JSON INDEX
router.get("/character", function(req, res){
    Character.find({}, function(err, results){
        if(err){
            console.log(err);
        }
        else{
            res.json({chars:results, periods:darkHelper.periods});
        }
    }).populate("periods.entries").sort("name")
})

// CHARACTER - GET
router.get("/character/:id", function(req, res){
    Character.findOne({"_id":req.params.id}, function(err, dbChar){
        if(err){
            console.log(err);
        }
        else{
            res.json(dbChar);
        }
    }).populate("periods.entrys")
})

// CHARACTER - NEW
router.get("/editor/character/new", function(req, res){
    res.render("editor/newCharacter", {layout: "edit", periods:darkHelper.periods})
})

// CHARACTER - CREATE
router.post("/editor/character", function(req, res){
    let newCharacter = req.body.char;
    for(let i=0; i<newCharacter.periods.length;i++){
        if(newCharacter.periods[i].default == 1){
            newCharacter.periods[i].default = true;
        }
        else{
            newCharacter.periods[i].default = false;
        }
    }
    Character.create(newCharacter, function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/editor")
        }
    })
})

// CHARACTER - EDIT
router.get("/editor/character/:id/edit", function(req, res){
    Character.findById(req.params.id).populate("periods.events").exec(function(err, dbChar){
        if(err){
            console.log(err);
        }
        else{
            res.render("editor/editCharacter", {layout:"edit", periods:darkHelper.periods, oldChar:dbChar, helpers:{
                hiddenI: function(input){      // returns the initial value for the hidden input tracking default checkbox changes
                    if(input){
                        return "1";
                    }
                    else{
                        return "0";
                    }
                },
                checkLine: function(w, text){ // Given an index and the value in db, returns whether or not this radial menu option should be checked
                    if(text == "straight" && w == 1){
                        return "checked";
                    }
                    else if(text == "dashed" && w == 2){
                        return "checked";
                    }
                    else if(text == "dashdot" && w == 3){
                        return "checked";
                    }
                },
                pName: function(input){     // Returns the period name at the index of the input
                    return darkHelper.periods[input].name
                }
            }})
        }
    })
})

// CHARACTER - PUT
router.put("/editor/character/:id", function(req, res){
    let newCharacter = req.body.char;
    for(let i=0; i<newCharacter.periods.length;i++){
        if(newCharacter.periods[i].default == 1){
            newCharacter.periods[i].default = true;
        }
        else{
            newCharacter.periods[i].default = false;
        }
    }
    Character.findByIdAndUpdate(req.params.id, newCharacter, function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/editor")
        }
    })
})

// CHARACTER - DELETE                                                           // Todo: Go through each linked event, deleting references to character, delete events if necessary
router.delete("/editor/character/:id", function(req, res){
    Character.deleteOne({"_id":req.params.id}, function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/editor")
        }
    })
})

////////////////////
// Event Routes
////////////////////

// EVENT - NEW
router.get("/editor/event/new", function(req, res){
    res.render("editor/newEvent", {layout: "edit", periods:darkHelper.periods})
})

module.exports = router;