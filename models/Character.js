const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: String,
  shortName: String,
  spoilerName: String,
  age: String,

  color: String,
  line: String,

  periods: [
    {
      default: Boolean,
      toStart: Boolean,
      toEnd: Boolean,
      events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event',
      }],
    },
  ],
});

module.exports = mongoose.model('character', characterSchema);
