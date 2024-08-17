import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './UnitWeaponLink.module.css'
import Dropdown from 'react-bootstrap/Dropdown';
import { Button } from 'react-bootstrap';

const UnitWeaponLinkForm = () => {
  const [meleeWeaponData, setMeleeWeaponData] = useState([]);
  const [rangedWeaponData, setRangedWeaponData] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [factionList, setFactionList] = useState([])


  const [selectedMeleeWeapons, setSelectedMeleeWeapons] = useState([]);
  const [selectedRangedWeapons, setSelectedRangedWeapons] = useState([]);
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

  const getFactionUnitList = async (faction) => {
    try {
      setSelectedFaction(faction.faction)
      const response = await axios.get(`http://localhost:5000/api/factions/${faction.faction}/unit`);
      console.log(response)
      setUnitList(response.data.factionUnitList)
    } catch (error) {
      console.log(error)
    }
  }

  const handleMeleeClick = (event) => {
    const { target } = event;
    if (target.tagName === 'OPTION') {
      const value = target.value;
      setSelectedMeleeWeapons(prevSelected => {
        const newSelected = [...prevSelected];
        if (newSelected.includes(value)) {
          return newSelected.filter(item => item !== value);
        } else {
          return [...newSelected, value];
        }
      });
      target.selected = !target.selected;
    }
  };

  const handleUnitChange = (e) => {
    setSelectedUnit(e.target.value);
  }

  const handleRangedClick = (event) => {
    const { target } = event;
    if (target.tagName === 'OPTION') {
      const value = target.value;
      setSelectedRangedWeapons(prevSelected => {
        const newSelected = [...prevSelected];
        if (newSelected.includes(value)) {
          return newSelected.filter(item => item !== value);
        } else {
          return [...newSelected, value];
        }
      });
      target.selected = !target.selected;
    }
  };

  const linkWeaponUnit = async () => {
    console.log(selectedMeleeWeapons, selectedRangedWeapons, selectedUnit)

    const updatedWeaponList = {
      selectedMeleeWeapons,
      selectedRangedWeapons
    }

    const response = await axios.put(`http://localhost:5000/api/factions/${selectedFaction}/unit/${selectedUnit}`, updatedWeaponList);


  }

  useEffect(() => {
  }, [selectedMeleeWeapons])

  useEffect(() => {
  }, [rangedWeaponData])

  useEffect(() => {
  }, [factionList])

  useEffect(() => {
    initializeData();
  }, []);

  return (
    <div className={styles.linkForm}>

      <Dropdown className={styles.topButtons}>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Faction List

        </Dropdown.Toggle>

        <Dropdown.Menu>
          {factionList && factionList.map(faction => (
            <Dropdown.Item as="button" onClick={() => getFactionUnitList({faction})}>{faction}</Dropdown.Item>
          ))}
        </Dropdown.Menu>
        <Button variant="primary" onClick={() => linkWeaponUnit()}>Add</Button>
      </Dropdown>
      <div className={styles.dataDiv}>
        <div className={styles.unitDiv}>
          Unit List:
          <select multiple value={selectedUnit} onChange={handleUnitChange} className={styles.unitSelect}>
            {unitList && unitList.map(unit => (
              <option value={unit.name} className={styles.rangedWeaponsEntry}>
                {unit.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.weaponsDiv}>
          <div className={styles.rangedWeaponsDiv}>
            Melee Weapons:
            <select multiple value={selectedMeleeWeapons} onClick={handleMeleeClick} className={styles.rangedWeaponsSelect}>
              {meleeWeaponData && meleeWeaponData.map(meleeWeapon => (
                <option value={meleeWeapon.name} className={styles.rangedWeaponsEntry}>
                  {meleeWeapon.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.rangedWeaponsDiv}>
            Ranged Weapons:
            <select multiple value={selectedRangedWeapons} onClick={handleRangedClick} className={styles.rangedWeaponsSelect}>
              {rangedWeaponData && rangedWeaponData.map(rangedWeapon => (
                <option value={rangedWeapon.name} className={styles.rangedWeaponsEntry}>
                  {rangedWeapon.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitWeaponLinkForm;
