const   express = require("express"),
        darkHelper = require("./helpers")

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



module.exports = router;