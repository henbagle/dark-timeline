const   express = require("express"),
        darkHelper = require("./helpers"),
        Character = require("./mCharacter"),
        Event = require("./mEvent");

    

let router = express.Router();


// INDEX
router.get("/editor", function(req, res){
    Character.find({}, function(err, results){
        if(err){
            console.log(err)
        }
        else{
            res.render("editor/index", {layout: "edit", characters: results})
        }
    })
})


// CHARACTER - NEW
router.get("/editor/character/new", function(req, res){
    res.render("editor/newCharacter", {layout: "edit", periods:darkHelper.periods})
})

// CHARACTER - CREATE
router.post("/editor/character", function(req, res){
    let newCharacter = req.body.char;
    for(i=0; i<newCharacter.periods.length;i++){
        if(newCharacter.periods[i].default == 1){
            newCharacter.periods[i].default = true;
        }
        else{
            newCharacter.periods[i].default = false;
        }
    }
    Character.create(newCharacter, function(err, newObj){
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
                hiddenI: function(input){
                    if(input){
                        return "1";
                    }
                    else{
                        return "0";
                    }
                },
                checkLine: function(w, text){
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
                pName: function(input){
                    return darkHelper.periods[input].name
                }
            }})
        }
    })
})

// CHARACTER - PUT

// CHARACTER - DELETE
module.exports = router;