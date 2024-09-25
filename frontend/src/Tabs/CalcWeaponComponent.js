import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./CalcWeaponComponent.module.css";
import FactionUnitDropDown from "../components/FactionUnitDropDown";
import UnitList from "../components/UnitList";
import AttackList from "../components/AttackList.js";
import DefenderUnitList from "../components/DefenderUnitList.js";
import CalcComponent from "../components/CalcComponent.js";

const CalcWeaponComponent = () => {
  const [meleeWeaponData, setMeleeWeaponData] = useState([]);
  const [rangedWeaponData, setRangedWeaponData] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [defenderUnitList, setDefenderUnitList] = useState([]);
  const [factionList, setFactionList] = useState([]);
  const [attackerList, setAttackerList] = useState({});

  const [mostRecentAddedUnit, setMostRecentAddedUnit] = useState({});

  const [selectedFaction, setSelectedFaction] = useState("");
  const [selectedUnitsAndWeapons, setSelectedUnitsAndWeapons] = useState({});
  const [selectedDefenders, setSelectedDefenders] = useState({});


  const initializeData = async () => {
    try {
      console.log("requesting ranged weapon data");
      const response = await axios.get(
        "http://localhost:5000/api/weapons/ranged"
      );
      setRangedWeaponData(response.data.weapons);
    } catch (error) {
      console.log(error);
    }
    try {
      console.log("requesting melee weapon data");
      const response = await axios.get(
        "http://localhost:5000/api/weapons/melee"
      );
      setMeleeWeaponData(response.data.weapons);
    } catch (error) {
      console.log(error);
    }
    try {
      console.log("getting factionlist");
      const response = await axios.get("http://localhost:5000/api/factions");
      console.log(response.data);
      setFactionList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const unitClickEvent = (unit) => {
    const newUnit = {};
    const attackerID = generateID();
    newUnit.unitName = unit;
    newUnit.faction = selectedFaction;

    setMostRecentAddedUnit({ attackerID, unit });
  };

  const defenderListClickEvent = (unit) => {
    if(Object.keys(selectedDefenders).includes(unit.name)) {
      setSelectedDefenders(prevList => {
        const newList = {...prevList}
        delete newList[unit.name]
        return newList
      })
    } else{
      setSelectedDefenders(prevList => {
        const newList = {...prevList}
        newList[unit.name] = unit;
        return newList
      })
    }
    console.log(selectedDefenders)
  };

  const generateID = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from(
      { length: 5 },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  };

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    console.log('selectedUnitsAndWeapons', selectedUnitsAndWeapons);
  }, [selectedUnitsAndWeapons]);

  return (
    <div className={styles.mainDiv}>
      <div className={styles.attackerDiv}>
        <div className={styles.attackTitle}>
          <FactionUnitDropDown
            setUnitList={setUnitList}
            setSelectedFaction={setSelectedFaction}
            className={styles.attackerFactionButton}
          />
          <div>Attacker</div>
        </div>
        <div className={styles.unitList}>
          <UnitList
            unitList={unitList}
            clickEvent={unitClickEvent}
            setAttackerList={setAttackerList}
          />
        </div>
        <div className={styles.attackList}>
          <AttackList
            attackerList={attackerList}
            className={styles.attackList}
            setAttackerList={setAttackerList}
            selectedFaction={selectedFaction}
            mostRecentAddedUnit={mostRecentAddedUnit}
            setSelectedUnitsAndWeapons={setSelectedUnitsAndWeapons}
          />
        </div>
      </div>
      <div className={styles.defenderDiv}>
        <div className={styles.defenderTitle}>
          <FactionUnitDropDown
            setUnitList={setDefenderUnitList}
            setSelectedFaction={setSelectedFaction}
            className={styles.attackerFactionButton}
          />
          <div>Defender</div>
        </div>
        <div className={styles.unitList}>
          <DefenderUnitList
            unitList={defenderUnitList}
            clickEvent={defenderListClickEvent}
            setAttackerList={setSelectedDefenders}
          />
        </div>
      </div>
      <div className={styles.calcDiv}>
        <CalcComponent attackerList={selectedUnitsAndWeapons} defenderList={selectedDefenders} />
      </div>
    </div>
  );
};

export default CalcWeaponComponent;
