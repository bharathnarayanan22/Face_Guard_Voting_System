const PartyModel = require("../models/partyModel");
const RegionModel = require("../models/regionModel");

const getParties = async(req, res) => {
  try {
    const parties = await PartyModel.find();
    res.json({ parties });
  } catch (error) {
    console.error('Error fetching parties:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const enrollParty = async(req, res)=> {
  try {
    const { partyName, partyLeader, partySymbol, regionId } = req.body;

    const existingParty = await PartyModel.findOne({
      $or: [
        { partyName: { $regex: new RegExp(`^${partyName}$`, 'i') } },
        { partyLeader: { $regex: new RegExp(`^${partyLeader}$`, 'i') } },
        { partySymbol: { $regex: new RegExp(`^${partySymbol}$`, 'i') } },
      ],
    });

    if (existingParty) {
      return res.status(409).json({ message: 'Party already enrolled.' });
    }

    const party = new PartyModel({
      partyName,
      partyLeader,
      partySymbol,
      regionId
    });

    await party.save();

    const region = await RegionModel.findById(regionId);
    if (region) {
      region.parties.push(party._id);
      await region.save();
    }

    res.status(201).json({ message: 'Party enrolled successfully!' });
  } catch (error) {
    console.error('Error enrolling party:', error);
    res.status(500).json({ message: 'Failed to enroll party. Please try again.' });
  }
}
const updateParty = async (req, res) => {
  const { id } = req.params;
  const { partyName, partyLeader, partySymbol, regionId } = req.body;

  try {
    const existingParty = await PartyModel.findOne({
      $or: [
        { partyName: { $regex: new RegExp(`^${partyName}$`, 'i') } },
        { partyLeader: { $regex: new RegExp(`^${partyLeader}$`, 'i') } },
        { partySymbol: { $regex: new RegExp(`^${partySymbol}$`, 'i') } },
      ],
      _id: { $ne: id } 
    });

    if (existingParty) {
      return res.status(409).json({ message: 'Party already enrolled.' });
    }

    const updatedParty = await PartyModel.findByIdAndUpdate(id, {
      partyName,
      partyLeader,
      partySymbol,
      regionId 
    }, { new: true }); 

    if (updatedParty) {
      res.status(200).json(updatedParty);
    } else {
      res.status(404).json({ message: "Party not found" });
    }
  } catch (error) {
    console.error("Error updating party:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const deleteParty = async(req, res) => {
  const partyId = req.params.partyId;
  try {
    await PartyModel.findByIdAndDelete(partyId);
    res.status(200).json({ message: "Party deleted successfully" });
  } catch (error) {
    console.error("Error deleting party:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const viewResults = async(req, res) => {
  try {
    const parties = await PartyModel.find({}).sort({ VoteCount: -1 });
    res.json({ parties });
  } catch (error) {
    console.error('Error fetching parties:', error);
    res.status(500).json({ message: 'Error fetching parties' });
  }
}

const fetchPartiesByRegion = async (req, res) => {
  const { region } = req.params;

  console.log(region)

  try {
    const parties = await PartyModel.find({ regionId: region });
    console.log("party: ", parties)
    res.json({ parties });
  } catch (error) {
    console.error('Error fetching parties by region:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getParties,
  enrollParty,
  updateParty,
  deleteParty,
  viewResults,
  fetchPartiesByRegion
};
