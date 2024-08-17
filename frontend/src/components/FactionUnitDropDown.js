import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import styles from './Components.module.css';

export default ({ setUnitList, setSelectedFaction}) => {


  const [factionList, setFactionList] = useState([])


  const initializeData = async () => {
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
  }, [])

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

  return (
    <Dropdown className={styles.dropDownMainDiv}>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Faction List

      </Dropdown.Toggle>

      <Dropdown.Menu>
        {factionList && factionList.map(faction => (
          <Dropdown.Item as="button" onClick={() => getFactionUnitList({ faction })}>{faction}</Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  )

}