import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './UnitWeaponLink.module.css'
import Dropdown from 'react-bootstrap/Dropdown';
import { Button } from 'react-bootstrap';
import FactionDropDown from '../FactionUnitDropDown';
import UnitList from '../UnitList';

const UnitWeaponLinkForm = () => {
  const [meleeWeaponData, setMeleeWeaponData] = useState([]);
  const [rangedWeaponData, setRangedWeaponData] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [factionList, setFactionList] = useState([])
  const [pointCost, setPointCost] = useState(0)


  const [selectedMeleeWeapons, setSelectedMeleeWeapons] = useState(new Set());
  const [selectedRangedWeapons, setSelectedRangedWeapons] = useState(new Set());
  const [selectedUnit, setSelectedUnit] = useState('')
  const [selectedFaction, setSelectedFaction] = useState('')
  const [responseMessage, setResponseMessage] = useState('')





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
  };

  const handleMeleeSelection = (meleeWeapon) => {
    setSelectedMeleeWeapons(prevSet => {
      const newSet = new Set(prevSet);
      if (newSet.has(meleeWeapon)) {
        newSet.delete(meleeWeapon);
      } else {
        newSet.add(meleeWeapon);
      }
      return newSet
    });
  };

  const handleRangedSelection = (rangedName) => {
    setSelectedRangedWeapons(prevSet => {
      const newSet = new Set(prevSet);
      if (newSet.has(rangedName)) {
        newSet.delete(rangedName);
      } else {
        newSet.add(rangedName);
      }
      return newSet
    });
  };

  const handleCostChange = (event) => {
    setPointCost(event.target.value)
  }

  const linkWeaponUnit = async () => {
    console.log(selectedMeleeWeapons, selectedRangedWeapons, selectedUnit)

    const updatedWeaponList = {
      selectedMeleeWeapons: Array.from(selectedMeleeWeapons), // Convert Set to Array
      selectedRangedWeapons: Array.from(selectedRangedWeapons), // Convert Set to Array
      pointCost: pointCost
    };
    
    console.log(updatedWeaponList)
    try{
    const response = await axios.put(`http://localhost:5000/api/factions/${selectedFaction}/unit/${selectedUnit}`, updatedWeaponList);
 
    if (response.status === 200) {
      console.log(response.data.message)
      setResponseMessage(response.data.message);
    }
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        setResponseMessage('Unit not found');
      } else if (status === 500) {
        setResponseMessage('An error occurred during the update');
      } else {
        setResponseMessage('An unexpected error occurred');
      }
    } else {
      setResponseMessage('No response received or request setup error', error.message);
    }
  }
    setSelectedMeleeWeapons(new Set())
    setSelectedRangedWeapons(new Set())
    setSelectedUnit('')

  }
  useEffect(() => {
    initializeData();
  }, []);

  const unitClickEvent = (unit) => {
    setSelectedUnit(unit);
  }


  return (
    <div className={styles.linkForm}>

        <FactionDropDown setUnitList={setUnitList} setSelectedFaction={setSelectedFaction} className={styles.factionDropDown}/>
        <Button variant="primary" onClick={() => linkWeaponUnit()} className={styles.factionDropDown}>Add</Button>
        Points cost: <input type='number' onChange={handleCostChange} className={styles.factionDropDown}/>

      <div className={styles.dataDiv}>
          <UnitList unitList={unitList} clickEvent={unitClickEvent} selectedUnit={selectedUnit}/>
          <div className={styles.rangedWeaponsDiv}>
            Ranged Weapons:
            <div className={styles.rangedWeaponList}>
              {rangedWeaponData && rangedWeaponData.map(rangedWeapon => (
                <div className={`${styles.rangedWeaponsEntry} ${selectedRangedWeapons.has(rangedWeapon.name) ? styles.selectedUnit : ''}`} onClick={() => handleRangedSelection(rangedWeapon.name)}>
                  {rangedWeapon.name}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.meleeWeaponDiv}>
            Melee Weapons:
            <div className={styles.meleeWeaponList}>
              {meleeWeaponData && meleeWeaponData.map(meleeWeapon => (
                <div className={`${styles.rangedWeaponsEntry} ${selectedMeleeWeapons.has(meleeWeapon.name) ? styles.selectedUnit : ''}`} onClick={() => handleMeleeSelection(meleeWeapon.name)}>
                  {meleeWeapon.name}
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default UnitWeaponLinkForm;
