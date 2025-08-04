const mongoose = require("mongoose");

const voterSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    unique: true,
  },
  mobile_number: {
    type: String,
    required: true,
    unique: true,
  },
  regionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Region",
    required: true,
  },
  hasVoted: {
    type: Boolean,
    default: false,
  },
  imagePaths: {
    type: [String],
    default: [],
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  maritalStatus: {
    type: String,
    enum: ["Yes", "No"],
    required: true,
  },
  spouseName: {
    type: String,
    required: function() {
      return this.maritalStatus === "Yes";
    },
  },
  fatherName: {
    type: String,
    required: function() {
      return this.maritalStatus === "No";
    },
  },
  motherName: {
    type: String,
    required: function() {
      return this.maritalStatus === "No";
    },
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  
});

const Voter = mongoose.model("Voter", voterSchema);

module.exports = Voter;