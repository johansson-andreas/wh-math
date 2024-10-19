import styles from "./Components.module.css";
import Draggable from "react-draggable";
import { calcRangedDamage } from "../utils/calcRangedDamage.js";
import { calcMeleeDamage } from "../utils/calcMeleeDamage.js";
import { useMemo, useState, useEffect } from "react";
import DataTable from 'react-data-table-component';

const CalcComponent = ({ attackerList, defenderList }) => {
  const [calcTable, setCalcTable] = useState([]);
  const [prevCalcTable, setPrevCalcTable] = useState([]);
  let columns = [{}];
  let data = [{}];

  useEffect(() => {
    columns = [];
    columns[0] = { name: "attacker", selector: (row) => row.attacker };
    columns.push(
      ...Object.keys(defenderList).map((defender) => {
        return { name: defender, selector: (row) => row[defender] };
      })
    );
    console.log(columns);
    data = Object.keys(attackerList).map((attackerID) => {
      let unitEntry = Object.keys(attackerList[attackerID].weapons).map(
        (wpnName) => {
          let wpnEntry = Object.keys(defenderList).reduce((acc, defender) => {
            acc[defender] = calculateDamage(
              attackerList[attackerID].weapons[wpnName],
              defenderList[defender]
            );
            console.log(acc); // Add the property dynamically
            return acc;
          }, {});
          wpnEntry.wpnName = wpnName;
          return wpnEntry;
        }
      );
      unitEntry.unitName = attackerList[attackerID].unit.unitname;
      return unitEntry;
    });
    console.log(data);
  }, [attackerList, defenderList]);

  const calculateDamage = (weapon, defender) => {
    if (parseInt(weapon.range) > 0) return calcRangedDamage(weapon, defender);
    else return calcMeleeDamage(weapon, defender);
  };

  return (
    <div className={styles.calcAttackerPanel}>
      {data.length > 0 && (
          <Draggable>
            <div className={styles.calcUnitDiv}>
              {data.map((dataEntry) => {
                console.log('dataentry:', dataEntry)
              })}
            </div>
          </Draggable>
      )
        }
    </div>
  );
};
export default CalcComponent;
