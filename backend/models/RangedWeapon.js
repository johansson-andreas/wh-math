import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const rangedWeaponSchema = new Schema({
  name: {
    type: String,
    unique: true,
    index: true
  },
  range: {
    type: String,
  },
  attacks: {
    type: String,
  },
  ballisticSkill: {
    type: String,
  },  
  strength: {
    type: String,
  },
  armorPenetration: {
    type: String,
  },
  damage: {
    type: String
  },
  keywords: {
    type:Array
  }
});

export const RangedWeapon = mongoose.model('RangedWeapon', rangedWeaponSchema);
