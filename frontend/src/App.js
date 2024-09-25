import './App.css';
import React, { useState } from 'react';
import AddNewDataComponent from './Tabs/AddNewDataComponent.js';
import CalcWeaponComponent from './Tabs/CalcWeaponComponent.js';
import ColorPickerComponent from './Tabs/ColorPickerComponent.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

function App() {

  const [state, setState] = useState('add');

  const renderAddNew = () => {
    return <AddNewDataComponent />;
  }

  const renderCalcDamage = () => {
    return <CalcWeaponComponent />
  }
  const renderColorPicker = () => {
    return <ColorPickerComponent />
  }



  return (
    <Tabs
      defaultActiveKey="calcDamage"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
      <Tab eventKey="calcDamage" title="Calculate data">

        {renderCalcDamage()}
      </Tab>
      <Tab eventKey="add" title="Add data to db">
        {renderAddNew()}
      </Tab>
      <Tab eventKey="colorPicker" title="Color Picker">
        {renderColorPicker()}
      </Tab>
    </Tabs>

  );
}

export default App;
