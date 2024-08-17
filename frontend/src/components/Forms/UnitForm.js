import React, { useState } from 'react';
import axios from 'axios';

const UnitForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    movement: '',
    toughness: '',
    save: '',
    wounds: '',
    invulnerableSave: '',
    faction: '',
    keywords: []
  });


  const [textInput, setTextInput] = useState('');
  const [keywordsInput, setKeywordsInput] = useState('');


  const handleKeywordsChange = (e) => {
    const kinput = e.target.value;
    console.log(kinput)
    setKeywordsInput(e.target.value);
    setFormData(prevValue => {const tempValue = {...prevValue}; tempValue.keywords = kinput.split(',').map(keyword => keyword.trim());; return tempValue});
  };
  const handleTextInputChange = (e) => {
    setTextInput(e.target.value);
  };

  const parseTextInput = () => {
    // Use regex to extract name, keywords, and values
    let match = textInput.split('\n')
    console.log(match)
    if (match) {
      const name = match[0].trim();
      setFormData(prevData => {
        const newData = {...prevData};
        newData.name = name;
        newData.movement = match[3] || '';
        newData.toughness = match[5] || '';
        newData.save = match[7] || '';
        newData.wounds = match[9] || '';
        newData.invulnerableSave = match[15] || '';
        return newData;
      });
    } else {

      console.error('Input text does not match the expected format.');

    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    const response = await axios.post(`http://localhost:5000/api/factions/${formData.faction}/unit`, { formData })
    console.log(response.data);
  };

  return (
    <div>
      <textarea
        value={textInput}
        onChange={handleTextInputChange}
        placeholder="Paste text line here..."
        rows="10"
        cols="50"
      />
      <button onClick={parseTextInput}>Parse Input</button>
      <form onSubmit={handleSubmit}>
      <label>
          Faction:
          <input
            type="text"
            name="faction"
            value={formData.faction}
            onChange={(e) => setFormData(prevValue => {const tempObject = {...prevValue}; tempObject.faction = e.target.value; return tempObject})}
          />
        </label>
        <label>
          Keywords:
          <textarea
            value={keywordsInput}
            onChange={handleKeywordsChange}
            placeholder="Keywords..."
            rows="1"
            cols="50"
            
        />
        </label>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            readOnly
          />
        </label>
        <label>
          Movement:
          <input
            type="string"
            name="movement"
            value={formData.movement}
            readOnly
          />
        </label>
        <label>
          Toughness:
          <input
            type="string"
            name="toughness"
            value={formData.toughness}
            readOnly
          />
        </label>
        <label>
          Save:
          <input
            type="string"
            name="save"
            value={formData.save}
            readOnly
          />
        </label>
        <label>
          Wounds:
          <input
            type="string"
            name="wounds"
            value={formData.wounds}
            readOnly
          />
        </label>
        <label>
          Invulnerable Save:
          <input
            type="string"
            name="invulnerableSave"
            value={formData.invulnerableSave}
            readOnly
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UnitForm;
