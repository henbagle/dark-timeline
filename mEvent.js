const mongoose = require("mongoose");

let eventSchema = new mongoose.Schema({
    name:String,
    description: String,
    image: String,
    period: Number,         // 0, 1, 2, 3 which period does this event belong to
    methodOfTravel: String,
    location: String,
    link: String,           // Link to wiki page
    link2: String,          // Link to another event

    chartIcon: String,
    x: Number,              // Time - float 0-9, days from start of graph
    y: Number,              // Year - int 0-4 which year are we in - see helper functions for list

    characters: [{type: mongoose.Schema.Types.ObjectId,
                ref: "character"}]

})

module.exports = mongoose.model("event", eventSchema);