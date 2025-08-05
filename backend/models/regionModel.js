// const mongoose = require('mongoose');

// const regionSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   description: {
//     type: String,
//     required: false,
//   },
//   voters: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Voter', 
//     }
//   ],
//   parties: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Party', 
//     }
//   ],
// }, { timestamps: true });

// const Region = mongoose.model('Region', regionSchema);

// module.exports = Region;


const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const regionSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: () => uuidv4(),
    unique: true,
  },
  state: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  zone: {
    type: String,
    required: true,
  },
  taluk: {
    type: String,
    required: true,
  },
  wardNo: {
    type: Number,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  voters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Voter'
  }],
  parties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Party'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Region', regionSchema);
