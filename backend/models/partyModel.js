const mongoose = require("mongoose");

const partySchema = new mongoose.Schema({
  partyName: {
    type: String,
    required: true,
    unique: true,
  },
  partyLeader: {
    type: String,
    required: true,
    unique: true, 
  },
  partySymbol: {
    type: String,
    required: true,
  },
  VoteCount: { 
    type: Number, 
    default: 0 
  },
  regionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Region',
    required: true,
    unique: false,  
  }
});

partySchema.index({ partyName: 1, partyLeader: 1 }, { unique: true });

const Party = mongoose.model('Party', partySchema);

module.exports = Party;
