const mongoose = require('mongoose');

const MongoItemSchema = new mongoose.Schema({
  name: String,
  data: Object,
});

module.exports = mongoose.model('MongoItem', MongoItemSchema);
