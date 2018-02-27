const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CodeStrings = new Schema({
  code: {
    type:  String,
    default: '',
  }
})

module.exports = mongoose.model('CodeStrings', CodeStrings)
