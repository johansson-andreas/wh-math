import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const meleeWeaponSchema = new Schema({
  name: {
    type: String,
    unique: true,
    index: true
  },
  attacks: {
    type: String,
  },
  weaponSkill: {
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

export const MeleeWeapon = mongoose.model('MeleeWeapon', meleeWeaponSchema);
