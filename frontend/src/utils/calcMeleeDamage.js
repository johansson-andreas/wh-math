import { addWeaponKeyword, addKeywordsToWeapon } from './addWeaponKeywords.js'

export const calcMeleeDamage = (weapon, defender, modifiers) => {
  const iterations = 10000;
  let totalDamage = 0;
  let totalHitHits = 0;
  let totalWoundHits = 0;
  let totalLethalHits = 0;
  let totalSaves = 0;
  

  console.log(weapon)
  let updatedWeapon = addKeywordsToWeapon(weapon);
  console.log(updatedWeapon);
  updatedWeapon.hitCrit = 6;

  updatedWeapon = applyModifiers(updatedWeapon, modifiers);

  const hitToWound = rollToWound(updatedWeapon, defender);

  const rollToSave = Math.min(
    // Calculate the first value with defaults
    (parseInt(defender.saveThrow[0]) || 7) -
      (parseInt(updatedWeapon.armorPenetration) || 0),
    // Use Infinity for invulnerable save to ensure it’s only used if valid
    parseInt(defender.invulnerableSave[0]) || Infinity
  );
  console.log('weapon: ', weapon.name)
  console.log('roll to wound', hitToWound)
  console.log('rollToSave', rollToSave)
  if (updatedWeapon.weaponSkill || updatedWeapon.torrent) {
    for (let i = 0; i < iterations; i++) {
      //HIT ROLLS
      const {hits, lethalHits} = hitRolls(updatedWeapon);
      totalHitHits += hits;

      let wounds = woundRolls(hitToWound, hits);
      wounds += lethalHits;
      totalLethalHits += lethalHits;
      totalWoundHits += wounds;
      totalWoundHits += lethalHits;

      const {damage, savedAmount} = saveRolls(updatedWeapon, rollToSave, wounds, defender);
      totalSaves += savedAmount;
      totalDamage += parseInt(damage);
    }

    // console.log(
    //   updatedWeapon.name,
    //   "average hit Hits:",
    //   totalHitHits / iterations,
    //   "average Wound Hits",
    //   totalWoundHits / iterations,
    //   "average damage:",
    //   totalDamage / iterations
    // );


    console.log("total hits", totalHitHits, "total lethal hits", totalLethalHits,  "total wounds", totalWoundHits, "total damage", totalDamage, "total saves", totalSaves);
    return totalDamage / iterations;
  } else return 0;
};

const applyModifiers = (modifiers) => {

}

const rollDie = () => {
  return Math.floor(Math.random() * 6) + 1;
};
const rollNDie = (n) => {
  return Math.floor(Math.random() * n) + 1;
};
const hitRolls = (weapon) => {
  let hits = 0;
  let criticalHits = 0;
  let lethalHits = 0;
  let attacks = weapon.attacks;
  if(weapon.rapidfire) {
    attacks = parseInt(attacks)
    attacks += parseInt(weapon.rapidfire)
  }

  let rollToHit = parseInt(weapon.weaponSkill[0]);
    if(attacks[0] == 'D') attacks = rollDie();
  
  for (let a = 0; a < attacks; a++) {
    const roll = rollDie();

    if (weapon.torrent) {
      hits++;
    } else {
      if (roll >= weapon.hitCrit) {
        if(weapon.lethalhits) lethalHits++;
        else hits++;
        criticalHits++;
      } else if (roll == 1) {
      } else if (roll >= rollToHit) {
        hits++;
      }
      //TODO: REROLL ALL HITS?
      else {
      }
    }
  }
  if (weapon.sustainedHits) {
    hits += criticalHits * weapon.sustainedHits;
  }
  return {hits, lethalHits}
};
const rollToWound = (weapon, defender) => {
  let rollToWound = 0;
  const weaponStrength = Number(weapon.strength);
  const defenderToughness = Number(defender.toughness);

  console.log("weapon.strength", weaponStrength);
  console.log("defender.toughness", defenderToughness);

  if (weaponStrength >= (defenderToughness * 2)) {
    rollToWound = 2;
  } else if (weaponStrength > defenderToughness) {
    rollToWound = 3;
  } else if (weaponStrength == defenderToughness) {
    rollToWound = 4;
  } else if (weaponStrength * 2 <= defenderToughness) {
    rollToWound = 6;
  } else if (weaponStrength < defenderToughness) {
    rollToWound = 5;
  }
  return rollToWound;
};

const woundRolls = (rollToWound, hits) => {
  let woundRolls = 0;
  //WOUND ROLLS

  for (let a = 0; a < hits; a++) {
    const roll = rollDie();
    if (roll == 6) {
      woundRolls++;
    } else if (roll == 1) {
      /*TODO: REROLL 1s */
    } else if (roll >= rollToWound) {
      woundRolls++;
    }
    //TODO: REROLL ALL WOUNDS
    else {
    }
  }
  return woundRolls;
};

const saveRolls = (weapon, rollToSave, wounds, defender) => {
  let damage = 0;
  let savedAmount = 0;

  for (let a = 0; a < wounds; a++) {
    let damageHit = 0;
    const roll = rollDie();

    if (roll === 1 || roll < rollToSave) {
      damageHit += parseDamage(weapon.damage);
      if (weapon.melta) damageHit += weapon.melta;
    } else {
      savedAmount++;
    }

    // Cap damage to the defender's remaining wounds
    damage += Math.min(damageHit, defender.wounds);
  }

  return { damage, savedAmount };
};

const parseDamage = (damageString) => {
  // Check if the damage is static (just a number)
  if (!isNaN(damageString)) {
    return parseInt(damageString, 10);
  }

  // Check for range-based or mixed damage formats
  const regex = /D(\d+)(\+(\d+))?/; // Matches formats like D6, D3+2, etc.
  const match = damageString.match(regex);
  console.log(match)

  if (match) {
    const diceSides = parseInt(match[1], 10); // Number of sides on the die (e.g., 6 for D6)
    const flatBonus = match[3] ? parseInt(match[3], 10) : 0; // Flat bonus, if present
    const rolledValue = rollNDie(diceSides); // Roll the die
    console.log(rolledValue + flatBonus)
    return rolledValue + flatBonus;
  }

  // If the damage format is invalid, return 0 or throw an error
  console.error(`Invalid damage format: ${damageString}`);
  return 0;
};

const calculateExpectedValueAndVariance = (
  numIterations,
  targetValue,
  totalHits
) => {
  // Calculate the probability of hitting the target value or higher
  const p_k = (7 - targetValue) / 6;

  // Calculate the expected value of the count per experiment
  const expectedValue = numIterations * p_k;

  // Calculate the variance of the count per experiment
  const variance = numIterations * p_k * (1 - p_k);

  // Calculate the variance of the average count over totalHits experiments
  const varianceOfAverage = variance / totalHits;

  // Calculate the standard deviation of the average count
  const standardDeviationOfAverage = Math.sqrt(varianceOfAverage);

  // Return the results
  return {
    expectedValue: expectedValue,
    variance: variance,
    varianceOfAverage: varianceOfAverage,
    standardDeviationOfAverage: standardDeviationOfAverage,
  };
};
