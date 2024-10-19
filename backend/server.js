import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import { RangedWeapon } from './models/RangedWeapon.js';
import { MeleeWeapon } from './models/MeleeWeapon.js';
import { Unit } from './models/Unit.js';
import cors from 'cors';


const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(express.json());

// CORS options
const corsOptions = {
  origin: 'http://localhost:3000', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add any other methods you need
  allowedHeaders: ['Content-Type', 'my-custom-header'], // Include 'Content-Type'
  credentials: true
};

console.log('CORS Options:', corsOptions);

// Apply middleware
app.use(cors(corsOptions));

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

app.get('/api/weapons/ranged', async (req, res) => {
  const weapons = await RangedWeapon.find().sort('name').exec()
  res.json({ weapons });
  console.log('sent ranged weapon data')
});

app.post('/api/weapons/ranged', async (req, res) => {
  console.log(req.body)
  const { name, range, attacks, ballisticSkill, strength, armorPenetration, damage, keywords } = req.body.formData;

  const newRangedWeapon = new RangedWeapon({
    name: name,
    range: range,
    attacks: attacks,
    ballisticSkill: ballisticSkill,
    strength: strength,
    armorPenetration: armorPenetration,
    damage: damage,
    keywords: keywords

  });

  try {
    const response = await newRangedWeapon.save();
    console.log(response)
    res.send(response);
  }
  catch (error) {
    console.log(error.errorResponse)
    res.send(error.errorResponse.errmsg);
  }

});

app.get('/api/weapons/melee', async (req, res) => {
  const weapons = await MeleeWeapon.find().sort('name').exec()
  res.json({ weapons });
  console.log('sent melee weapon data')

});

app.post('/api/weapons/melee', async (req, res) => {
  console.log(req.body.formData)
  const { name, attacks, weaponSkill, strength, armorPenetration, damage, keywords } = req.body.formData;

  const newMeleeWeapon = new MeleeWeapon({
    name: name,
    attacks: attacks,
    weaponSkill: weaponSkill,
    strength: strength,
    armorPenetration: armorPenetration,
    damage: damage,
    keywords: keywords,
  });


  try {

    const response = await newMeleeWeapon.save();
    console.log(response)
    res.send(response);
  }
  catch (error) {
    console.log(error)
    res.send(error);
  }
});

app.post('/api/factions/:faction/unit', async (req, res) => {
  console.log(req.body.formData)
  const factionName = req.params.faction;
  const { name, movement, toughness, save, wounds, invulnerableSave, keywords } = req.body.formData;

  console.log('keywords', keywords)

  const newUnit = new Unit({
    name: name,
    movement: movement,
    toughness: toughness,
    saveThrow: save,
    wounds: wounds,
    invulnerableSave: invulnerableSave,
    faction: factionName.trim(),
    keywords: keywords
  });
  try {

    const response = await newUnit.save();
    console.log(response)
    res.send(response);
  }
  catch (error) {
    console.log(error)
    res.send(error);
  }
});

app.get('/api/factions/:faction/unit', async (req, res) => {
  const factionName = req.params.faction;
  try {

    const factionUnitList = await Unit.find({faction:factionName}).sort('name').exec()
    console.log(req.params.faction)
    res.json({ factionUnitList });
    console.log('sent faction unit list', factionUnitList)

  }
  catch (error) {
    console.log(error)
    res.send(error);
  }

});

app.put('/api/factions/:faction/unit/:unit', async (req, res) => {
  const unitName = req.params.unit;
  console.log(req.body)
  const { selectedMeleeWeapons:selectedMeleeWeaponsSet, selectedRangedWeapons:selectedRangedWeaponsSet, pointCost } = req.body;

  const selectedMeleeWeapons = Array.from(selectedMeleeWeaponsSet);
  const selectedRangedWeapons = Array.from(selectedRangedWeaponsSet);
  console.log(selectedMeleeWeapons)
  try {
    // Initialize an object to hold the update fields
    let updateFields = {};

    // Only add to updateFields if the value is not empty or null
    if (selectedMeleeWeapons && selectedMeleeWeapons.length > 0) {
      const meleeWeapons = await MeleeWeapon.find({ name: { $in: selectedMeleeWeapons } }).exec();
      const meleeWeaponIds = meleeWeapons.map(weapon => weapon._id);
      updateFields.meleeWeapons = meleeWeaponIds;
    }

    if (selectedRangedWeapons && selectedRangedWeapons.length > 0) {
      const rangedWeapons = await RangedWeapon.find({ name: { $in: selectedRangedWeapons } }).exec();
      const rangedWeaponIds = rangedWeapons.map(weapon => weapon._id);
      updateFields.rangedWeapons = rangedWeaponIds;
    }

    if (pointCost !== undefined && pointCost !== null && pointCost !== 0) {
      updateFields.points = pointCost;
    }

    // Check if there are fields to update
    if (Object.keys(updateFields).length > 0) {
      try {
        const result = await Unit.findOneAndUpdate(
          { name: unitName },
          updateFields,
          { new: true }
        ).exec();
      
        if (result) {
          res.status(200).json({ message: "Unit updated successfully" });
        } else {
          res.status(404).json({ message: "Unit not found" });
        }
      } catch (error) {
        res.status(500).json({ message: "An error occurred during the update", error: error.message });
      }
    } else {
      // No valid fields to update
      res.status(400).json({ message: "No valid fields provided for update" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({error: error});
  }
});

app.get('/api/factions', async (req,res) => {
  try {
    const result = await Unit.aggregate([
      {
        $group: {
          _id: null,  // Group all documents together
          uniqueValues: { $addToSet: "$faction" }  // Collect unique values of the "category" field
        }
      },
      {
        $project: {
          _id: 0,  // Exclude the _id field
          uniqueValues: 1  // Include the uniqueValues field
        }
      }
    ]);

    res.json(result.length > 0 ? result[0].uniqueValues : []); // Return unique values array
  } catch (error) {
    console.error('Error fetching unique categories:', error);
    res.json(error);
  }
})

app.get('/api/factions/:faction/unit/:unit', async (req, res) => {
  const factionName = req.params.faction;
  const unit = req.params.unit;

  try {

    const unitDetails = await Unit.find({name:unit}).populate('rangedWeapons').populate('meleeWeapons').exec()
    res.json({ unitDetails });
    console.log('sent unit details', unitDetails)

  }
  catch (error) {
    console.log(error)
    res.send(error); 
  }

});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
