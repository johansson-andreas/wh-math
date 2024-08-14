const calcRangedDamage = (weapon, defender) => {
    const iterations = 1000;
    let totalDamage = 0;
    for(let i = 0; i < iterations; i++)
        {


            //HIT ROLLS
            const hits = hitRolls(weapon, defender);

            const wounds = woundRolls(weapon, defender, hits);

            const damage = saveRolls(weapon, defender, wounds);
            
        }


}

const rollDie = () => {
    return Math.floor(Math.random() * 6) + 1; 
}
const hitRolls = (weapon, defender) => {

    let hits = 0;
    let criticalHits = 0;
    let attacks = weapon.attacks;
    let rollToHit = weapon.ballisticsSkill;

    for(let a = 0; a < attacks; a++)
        {
        const roll = rollDie();
        if(weapon.torrent) hits++;
        else {
            if(roll == 6) {hits++; criticalHits++}
            else if(roll == 1) {}
            else if (roll >= rollToHit) {
            hits++;
            }
            //TODO: REROLL ALL HITS?
            else {

            }
        }
    }
    if(weapon.sustainedHits) {
        hits += criticalHits * weapon.sustainedHits
    }

}

const woundRolls = (weapon, defender, hits) => {
            let woundRolls = 0;
            //WOUND ROLLS
            let rollToWound = 0;
            if(weapon.strength > (defender.toughness * 2)) rollToWound = 2;
            else if(weapon.strength > (defender.toughness)) rollToWound = 3;
            else if(weapon.strength == (defender.toughness)) rollToWound = 4;
            else if(weapon.strength < (defender.toughness)) rollToWound = 5;
            else if((weapon.strength*2) < (defender.toughness)) rollToWound = 6;

            for (let a = 0; a < hits; a++)
                {
                    const roll = rollDie();
                    if(roll == 6) { woundRolls++; criticalHits++}
                    else if(roll == 1) { /*TODO: REROLL 1s */ }
                    else if (roll >= rollToWound) {
                        woundRolls++;
                    }
                    //REROLL ALL WOUNDS 
                    else {

                    }
                }
}


const saveRolls = (weapon, defender, wounds) => {
    let damage = 0;
    //WOUND ROLLS
    let rollToWound = 0;
    if(weapon.strength > (defender.toughness * 2)) rollToWound = 2;
    else if(weapon.strength > (defender.toughness)) rollToWound = 3;
    else if(weapon.strength == (defender.toughness)) rollToWound = 4;
    else if(weapon.strength < (defender.toughness)) rollToWound = 5;
    else if((weapon.strength*2) < (defender.toughness)) rollToWound = 6;

    for (let a = 0; a < hits; a++)
        {
            const roll = rollDie();
            if(roll == 6) { woundRolls++; criticalHits++}
            else if(roll == 1) { /*TODO: REROLL 1s */ }
            else if (roll >= rollToWound) {
                woundRolls++;
            }
            //REROLL ALL WOUNDS 
            else {

            }
        }
}