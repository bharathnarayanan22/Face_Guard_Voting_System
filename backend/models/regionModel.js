const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: false,
  },
  voters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Voter', 
    }
  ],
  parties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Party', 
    }
  ],
}, { timestamps: true });

const Region = mongoose.model('Region', regionSchema);

module.exports = Region;
