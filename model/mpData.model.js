const mongoose = require("mongoose");

const mpDataSchema = new mongoose.Schema({
  state: String,
  dist: String,
  pc_code: String,
  name_of_candidate: String,
  name_of_party: String,
  votes: Number,
});

const MpData = mongoose.model("MpData", mpDataSchema);

module.exports = MpData;
