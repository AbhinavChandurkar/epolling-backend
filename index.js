const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const MpData = require("./model/mpData.model");

const app = express();
app.use(cors());

let uri =
  "mongodb://admin:password@web.ksemin.in:30001/?authSource=admin&readPreference=primary&directConnection=true&ssl=false";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
// Endpoint to get unique districts based on the selected state
app.get("/getdistricts/:state", async (req, res) => {
  try {
    const selectedState = req.params.state;
    console.log("Selected State:", selectedState);

    // Adjust the field name to match your actual field in the database
    const districts = await MpData.find({ state: selectedState })
      .distinct("dist")
      .exec();

    console.log("Districts:", districts);
    res.json(districts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/getdata", async (req, res) => {
  try {
    const data = await MpData.find().exec();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/getlokSabhas/:district", async (req, res) => {
  try {
    const selectedDistrict = req.params.district;
    console.log("Selected District:", selectedDistrict);

    const lokSabhas = await MpData.find({ dist: selectedDistrict })
      .distinct("pc_code")
      .exec();

    console.log("Lok Sabhas:", lokSabhas);
    res.json(lokSabhas);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/getcandidates/:state/:district/:lokSabha", async (req, res) => {
  try {
    const { state, district, lokSabha } = req.params;
    console.log("Selected State:", state);
    console.log("Selected District:", district);
    console.log("Selected Lok Sabha:", lokSabha);

    const candidates = await MpData.find({
      state: state,
      dist: district,
      pc_code: lokSabha,
    }).exec();

    console.log("Candidates:", candidates);
    res.json(candidates);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/vote/:candidateId", async (req, res) => {
  try {
    const candidateId = req.params.candidateId;

    // Update the vote count for the specified candidateId
    await MpData.findByIdAndUpdate(candidateId, { $inc: { votes: 1 } });

    res.status(200).send("Vote counted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => console.log("Server listening on port 3000"));
