const calcRangedDamage = (weapon, defender) => {
    const iterations = 1000;
    let totalDamage = 0;
    for(let i = 0; i < iterations; i++)
        {
            let hits = 0;
            let criticalHits = 0;
            let attacks = weapon.attacks;
            let rollToHit = weapon.ballisticsSkill;

            //HIT ROLLS
            for(let a = 0; a < attacks; a++)
                {
                const roll = rollDie;
                if(weapon.torrent) hits++;
                else {
                    if(roll == 6) { criticalHits++}
                    else if(roll == 1) {}
                    else if (roll >= rollToHit) {
                    hits++;
                    }
                }
            }
            if(weapon.sustainedHits) {
                hits += criticalHits * weapon.sustainedHits
            }

            //WOUND ROLLS
            let rollToWound = 0;
            if(weapon.strength > (defender.toughness * 2)) rollToWound = 2;
            else if(weapon.strength > (defender.toughness)) rollToWound = 3;
            else if(weapon.strength == (defender.toughness)) rollToWound = 4;
            else if(weapon.strength < (defender.toughness)) rollToWound = 5;
            else if((weapon.strength*2) < (defender.toughness)) rollToWound = 6;
            
        }


}

const rollDie = () => {
    return Math.floor(Math.random() * 6) + 1; 
}