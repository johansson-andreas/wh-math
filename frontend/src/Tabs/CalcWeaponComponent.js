import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './CalcWeaponComponent.module.css'
import FactionUnitDropDown from '../components/FactionUnitDropDown';
import UnitList from '../components/UnitList';


const CalcWeaponComponent = () => {
  const [meleeWeaponData, setMeleeWeaponData] = useState([]);
  const [rangedWeaponData, setRangedWeaponData] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [factionList, setFactionList] = useState([])

  const [selectedUnit, setSelectedUnit] = useState('')
  const [selectedFaction, setSelectedFaction] = useState('')



  const initializeData = async () => {

    try {
      console.log('requesting ranged weapon data')
      const response = await axios.get('http://localhost:5000/api/weapons/ranged');
      setRangedWeaponData(response.data.weapons)
    } catch (error) {
      console.log(error)
    }
    try {
      console.log('requesting melee weapon data')
      const response = await axios.get('http://localhost:5000/api/weapons/melee');
      setMeleeWeaponData(response.data.weapons)
    } catch (error) {
      console.log(error)
    }
    try {
      console.log('getting factionlist')
      const response = await axios.get('http://localhost:5000/api/factions');
      console.log(response.data);
      setFactionList(response.data)
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    initializeData();
  }, []);


  return (
    <div className={styles.mainDiv}>

      <div className={styles.attackerDiv}>
        <FactionUnitDropDown setUnitList={setUnitList} setSelectedFaction={setSelectedFaction} className={styles.attackerFactionButton} /> 
        <p className={styles.attackTitle}>Attacker</p>
        <UnitList unitList={unitList} setSelectedUnit={setSelectedUnit} selectedUnit={selectedUnit} className={styles.unitList}/>
      </div>
      <div className={styles.defenderDiv}></div>
    </div>
  )
}

export default CalcWeaponComponent;