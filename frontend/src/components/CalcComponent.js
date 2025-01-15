import styles from "./Components.module.css";
import Draggable from "react-draggable";
import { calcRangedDamage } from "../utils/calcRangedDamage.js";
import { calcMeleeDamage } from "../utils/calcMeleeDamage.js";
import { useMemo, useState, useEffect } from "react";
import DataTable from "react-data-table-component";

const CalcComponent = ({ attackerList, defenderList }) => {
  const [calcTable, setCalcTable] = useState([]);
  const [prevCalcTable, setPrevCalcTable] = useState([]);
  let columns = [{}];
  let [data, setData] = useState([]);

  useEffect(() => {
    columns = [];
    columns[0] = { name: "attacker", selector: (row) => row.attacker };
    columns.push(
      ...Object.keys(defenderList).map((defender) => {
        return { name: defender, selector: (row) => row[defender] };
      })
    );
    console.log(columns);
    setData(
      Object.keys(attackerList).map((attackerID) => {
        let unitEntry = Object.keys(attackerList[attackerID].weapons).map(
          (wpnName) => {
            let wpnEntry = Object.keys(defenderList).reduce((acc, defender) => {
              acc[defender] = calculateDamage(
                attackerList[attackerID].weapons[wpnName],
                defenderList[defender]
              );
              return acc;
            }, {});
            wpnEntry.wpnName = wpnName;
            return wpnEntry;
          }
        );
        unitEntry.unitName = attackerList[attackerID].unit.unitname;
        return unitEntry;
      })
    );
    console.log(data);
  }, [attackerList, defenderList]);

  const calculateDamage = (weapon, defender) => {
    if (parseInt(weapon.range) > 0) return calcRangedDamage(weapon, defender);
    else return calcMeleeDamage(weapon, defender);
  };

  return (
    <div className={styles.calcAttackerPanel}>
      {data.length > 0 && (
        <div className={styles.calcUnitDiv}>
          {data.map((dataEntry) => {
            console.log(dataEntry);
            return (
              <div key={dataEntry}>
                <Draggable>
                  <table class={styles.attackerTable}>
                    <tr>
                    <td class={styles.attackerCell}>{dataEntry.unitName} </td>
                      {Object.keys(dataEntry[0]).map(weaponEntryEntry => {
                        if(weaponEntryEntry == "wpnName") return 
                        return (
                          <td class={styles.attackerCell}>{weaponEntryEntry}</td>
                        )
                      })}
                    </tr>
                    {dataEntry.map((weaponEntry) => (
                      <tr key={weaponEntry.wpnName}>
                        <td class={styles.attackerCell} >{weaponEntry.wpnName}</td>
                        {Object.keys(weaponEntry).map((weaponEntryEntry) => {
                          if(weaponEntryEntry == "wpnName") return 
                          return (
                            <td class={styles.attackerCell} key={weaponEntryEntry}>
                              {weaponEntry[weaponEntryEntry]}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </table>
                </Draggable>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default CalcComponent;
