import { useEffect, useState, useRef } from "react";
import styles from "./Components.module.css";
import axios from "axios";

export default ({
  attackerList,
  setAttackerList,
  selectedFaction,
  mostRecentAddedUnit,
  setSelectedUnitsAndWeapons,
}) => {
  const prevAttackerList = useRef({ attackerList });

  const getUnitData = async (unitName) => {
    return await axios.get(
      `http://localhost:5000/api/factions/${selectedFaction}/unit/${unitName}`
    );
  };

  useEffect(() => {
    const updateData = async () => {
      const newUnitData = await getUnitData(mostRecentAddedUnit.unit);
      console.log(mostRecentAddedUnit, newUnitData);

      if (Object.keys(mostRecentAddedUnit).length > 0) {
        setAttackerList((prevValue) => {
          const newList = { ...prevValue };
          newList[mostRecentAddedUnit.attackerID] = {
            unitName: mostRecentAddedUnit.unit,
            meleeWeapons: newUnitData.data.unitDetails[0].meleeWeapons,
            rangedWeapons: newUnitData.data.unitDetails[0].rangedWeapons,
            points: newUnitData.data.unitDetails[0].points,
            attackerID: mostRecentAddedUnit.attackerID,
          };
          return newList;
        });
      }
    };
    if (Object.keys(mostRecentAddedUnit).length > 0) updateData();
  }, [mostRecentAddedUnit]);

  const handleCheckboxClick = (weapon, unit) => {
    console.log(weapon, unit)
    setSelectedUnitsAndWeapons((prevValue) => {
      const newValue = { ...prevValue };

      // Check if the unit exists
      if (!newValue[unit.attackerID]) {
        // If the unit doesn't exist, add it with the weapon as a key
        newValue[unit.attackerID] = {weapons: {}, unit: {}}
        newValue[unit.attackerID].weapons[weapon.name] =  weapon ;
        newValue[unit.attackerID].unit = {unitname: unit.unitName, points: unit.points}
      } else {
        // If the unit exists, check if the weapon exists
        if (newValue[unit.attackerID].weapons[weapon.name]) {
          // If the weapon exists, remove it
          delete newValue[unit.attackerID].weapons[weapon.name];

          // If no weapons are left for this unit, remove the unit
          if (Object.keys(newValue[unit.attackerID]).length === 0) {
            delete newValue[unit.attackerID];
          }
        } else {
          // If the weapon doesn't exist, add it
          newValue[unit.attackerID].weapons[weapon.name] = weapon;
        }
      }
      return newValue;
    });
  };

  useEffect(() => {
    console.log("attackerlist", attackerList);
  }, [attackerList]);

  return (
    <div className={styles.attackListBody}>
      {Object.keys(attackerList).map((attacker) => (
        <div
          key={attackerList[attacker].attackerID}
          className={styles.attackerUnit}
        >
          <div className={styles.unitNameTitle}>
            {attackerList[attacker].unitName}
          </div>
          <div className={styles.meleeWeaponsTitle}>Melee Weapons </div>
          <div className={styles.meleeWeapons}>
            {attackerList[attacker].meleeWeapons.map((meleeWeapon) => (
              <label
                key={attackerList[attacker].meleeWeapon}
                className={styles.weaponEntry}
                title={meleeWeapon.name}
              >
                <div className={styles.weaponName}>{meleeWeapon.name}</div>
                <input
                  type="checkbox"
                  onClick={() =>
                    handleCheckboxClick(
                      meleeWeapon,
                      attackerList[attacker]
                    )
                  }
                />
              </label>
            ))}
          </div>
          <div className={styles.meleeWeaponsTitle}>Ranged Weapons </div>
          <div className={styles.meleeWeapons}>
            {attackerList[attacker].rangedWeapons.map((rangedWeapon) => (
              <label
                key={attackerList[attacker].rangedWeapon}
                className={styles.weaponEntry}
                title={rangedWeapon.name}
              >
                <div className={styles.weaponName}>{rangedWeapon.name}</div>
                <input type="checkbox" onClick={() =>
                    handleCheckboxClick(
                        rangedWeapon,
                      attackerList[attacker]
                    )
                  }/>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
