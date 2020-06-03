const   express = require("express"),
        darkHelper = require("./helpers"),
        Character = require("./mCharacter"),
        Event = require("./mEvent")

let router = express.Router();

router.get("/", function(req, res){
    res.redirect("/season-1");
})

router.get("/summer-2019", function(req, res){
    res.render("s0", {layout : "chart"});
})

router.get("/season-1", function(req, res){
    res.render("s1", {layout : "chart"});
})

router.get("/season-2", function(req, res){
    res.render("s2", {layout : "chart"});
})

router.get("/timeline", function(req, res){
    Character.find({}).populate(periods.events).exec(function(err, dbChar){
        if(err){
            console.log(err);
        }
        else{
            res.send({characters:dbChar, period:darkHelper.periods[req.query.p]})
        }
    })
})


module.exports = router;