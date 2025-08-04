const Region = require('../models/regionModel'); 
const VoterModel = require("../models/voterModel");
const PartyModel = require("../models/partyModel");
const fs = require('fs');
const path = require('path');

exports.createRegion = async (req, res) => {
  const { name, description } = req.body;

  try {
    const newRegion = new Region({
      name,
      description,
    });

    const savedRegion = await newRegion.save();
    res.status(201).json(savedRegion);
  } catch (error) {
    console.error('Error creating region:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllRegions = async (req, res) => {
  try {
    const regions = await Region.find();
    res.json({ regions });
  } catch (error) {
    console.error('Error fetching regions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to get a region by ID
exports.getRegionById = async (req, res) => {
  const { id } = req.params;

  try {
    const region = await Region.findById(id);
    if (region) {
      res.json(region);
    } else {
      res.status(404).json({ message: 'Region not found' });
    }
  } catch (error) {
    console.error('Error fetching region:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to update a region by ID
exports.updateRegionById = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const updatedRegion = await Region.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (updatedRegion) {
      res.json(updatedRegion);
    } else {
      res.status(404).json({ message: 'Region not found' });
    }
  } catch (error) {
    console.error('Error updating region:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to delete a region by ID
exports.deleteRegionById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRegion = await Region.findByIdAndDelete(id);

    if (deletedRegion) {
      res.json({ message: 'Region deleted successfully' });
    } else {
      res.status(404).json({ message: 'Region not found' });
    }
  } catch (error) {
    console.error('Error deleting region:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.addVoterToRegion = async (regionId, voterId) => {
  try {
    const region = await Region.findById(regionId);
    region.voters.push(voterId);
    await region.save();
  } catch (error) {
    console.error('Error adding voter to region:', error);
  }
};

exports.addPartyToRegion = async (regionId, partyId) => {
  try {
    const region = await Region.findById(regionId);
    region.parties.push(partyId);
    await region.save();
  } catch (error) {
    console.error('Error adding party to region:', error);
  }
};

// Controller to get voters of a region
exports.getVotersOfRegion = async (req, res) => {
  const { id } = req.params;

  try {
    const region = await Region.findById(id).populate('voters');
    if (region) {
      res.json(region.voters);
    } else {
      res.status(404).json({ message: 'Region not found' });
    }
  } catch (error) {
    console.error('Error fetching voters:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to get parties of a region
exports.getPartiesOfRegion = async (req, res) => {
  const { id } = req.params;

  try {
    const region = await Region.findById(id).populate('parties');
    if (region) {
      res.json(region.parties);
    } else {
      res.status(404).json({ message: 'Region not found' });
    }
  } catch (error) {
    console.error('Error fetching parties:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to download voters list as a file
exports.downloadVotersList = async (req, res) => {
  const { id } = req.params;
 

  try {
    const region = await Region.findById(id).populate('voters');
    if (region) {
      const filePath = path.join(__dirname, 'voters-list.txt');
      const fileContent = region.voters.map(voter => `Voter ID: ${voter._id}, Name: ${voter.label}, Mobile Number: ${voter.mobile_number}`).join('\n');
      fs.writeFileSync(filePath, fileContent);

      res.download(filePath, 'voters-list.txt', (err) => {
        if (err) {
          console.error('Error downloading file:', err);
          res.status(500).json({ message: 'Error downloading file' });
        }
        fs.unlinkSync(filePath); // Delete the file after download
      });
    } else {
      res.status(404).json({ message: 'Region not found' });
    }
  } catch (error) {
    console.error('Error downloading voters list:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to download parties list as a file
exports.downloadPartiesList = async (req, res) => {
  const { id } = req.params;

  try {
    const region = await Region.findById(id).populate('parties');
    if (region) {
      const filePath = path.join(__dirname, 'parties-list.txt');
      const fileContent = region.parties.map(party => `Party ID: ${party._id}, Party Name: ${party.partyName}, Party Leader: ${party.partyLeader}, Party Symbol: ${party.partySymbol}`).join('\n');
      fs.writeFileSync(filePath, fileContent);

      res.download(filePath, 'parties-list.txt', (err) => {
        if (err) {
          console.error('Error downloading file:', err);
          res.status(500).json({ message: 'Error downloading file' });
        }
        fs.unlinkSync(filePath); 
      });
    } else {
      res.status(404).json({ message: 'Region not found' });
    }
  } catch (error) {
    console.error('Error downloading parties list:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};