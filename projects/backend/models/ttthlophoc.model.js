var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  makhoahoc: { type: String },
  dot: { type: String },
  lop: { type: String },
  trangthai: { type: Boolean },
  nguoitao: { type: String },
  nguoisua: { type: String },
  created_at: { type: Date },
  updated_at: { type: Date },
})

module.exports = mongoose.model('ttthlophoc', schema, 'ttth_lophoc')
