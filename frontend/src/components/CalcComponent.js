import styles from "./Components.module.css";
import Draggable from "react-draggable";
import {calcRangedDamage} from '../utils/calcRangedDamage.js'
import { useMemo } from "react";

const CalcComponent = ({ attackerList, defenderList }) => {
  const calculateDamage = (attacker, defender) => {

    return calcRangedDamage(attacker, defender)
  };



  return (
    <div className={styles.calcAttackerPanel}>
      {Object.keys(attackerList).length > 0 &&
        Object.keys(attackerList).map((attacker) => (
          <Draggable>
            <div className={styles.calcUnitDiv}>
              <div className={styles.calcAttackerUnitDiv}>
                <div className={styles.calcAttackerUnitDivName}>
                  {attackerList[attacker].unit.unitname}
                </div>
                <div className={styles.calcAttackerWeaponsDiv}>
                  {Object.keys(attackerList[attacker].weapons).map((weapon) => (
                    <div className={styles.calcAttackerWeaponDiv}>{weapon}</div>
                  ))}
                </div>
              </div>
              <div className={styles.calcDefenderUnitDiv}>
                {Object.keys(defenderList).map((defender) => {
                  console.log(defender);
                  return (
                    <div>
                      <div className={styles.defenderTitle}>{defender}</div>
                      <div className={styles.calcs}>
                        {Object.keys(attackerList[attacker].weapons).map(
                          (weapon) => (
                            <div className={styles.calcAttackerWeaponDiv}>
                              {calculateDamage(attackerList[attacker].weapons[weapon], defenderList[defender])}

                            </div>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Draggable>
        ))}
    </div>
  );
};
export default CalcComponent;
