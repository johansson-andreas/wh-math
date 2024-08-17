import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const unitSchema = new Schema({
  name: {
    type: String,
    unique: true,
    index: true
  },
  movement: {
    type: String,
  },
  toughness: {
    type: String,
  },
  saveThrow: {
    type: String,
  },
  wounds: {
    type: String,
  },
  invulnerableSave: {
    type: String,
  },
  faction: {
    type: String,
    index: true
  },
  keywords: {
    type: Array
  },
  meleeWeapons: [{ type: Schema.Types.ObjectId, ref: 'MeleeWeapon' }], // Array of MeleeWeapon references
  rangedWeapons: [{ type: Schema.Types.ObjectId, ref: 'RangedWeapon' }], // Array of RangedWeapon references
});

export const Unit = mongoose.model('Unit', unitSchema);
