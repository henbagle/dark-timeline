const   express = require("express"),
        darkHelper = require("./helpers")

let router = express.Router();

router.get("/", function(req, res){
    res.render("main", {layout : "chart"});
})




module.exports = router;