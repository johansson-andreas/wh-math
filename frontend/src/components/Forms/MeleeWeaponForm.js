import React, { useState } from 'react';
import axios from 'axios';

const MeleeWeaponForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    range: '',
    attacks: '',
    weaponSkill: '',
    strength: '',
    armorPenetration: '',
    damage: '', // Fixed field name
    keywords: []
  });


  const [textInput, setTextInput] = useState('');

  const handleTextInputChange = (e) => {
    setTextInput(e.target.value);
  };

  const parseTextInput = () => {
    // Use regex to extract name, keywords, and values
    let regex = /^(.+?)\s*\[(.*?)\]\s*([\s\S]*)$/;
    let match = textInput.match(regex);

    if (match) {
      const name = match[1].trim();
      const keywords = match[2].split(',').map(keyword => keyword.trim()) || [];
      const values = match[3].trim().split(/\s+/);
      setFormData({
        name: name,
        keywords: keywords,
        range: values[0] || '',
        attacks: values[1] || '',
        weaponSkill: values[2] || '',
        strength: values[3] || '',
        armorPenetration: values[4] || '',
        damage: values[5] || '1' // Fixed field name
      });
    } else {
      // Fallback regex pattern if keywords are not present
      regex = /^(.+)\n([\s\S]*)$/;
      match = textInput.match(regex);

      if (match) {
        const name = match[1].trim();
        const values = match[2].trim().split(/\s+/);

        setFormData({
          name: name,
          keywords: [], // No keywords in fallback pattern
          range: values[0] || '',
          attacks: values[1] || '',
          weaponSkill: values[2] || '',
          strength: values[3] || '',
          armorPenetration: values[4] || '',
          damage: values[5] || '' // Fixed field name
        });
      } else {
        console.error('Input text does not match the expected format.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your submit logic here, such as making an API call
    const response = await axios.post('http://localhost:5000/api/weapons/melee', { formData })
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
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            readOnly
          />
        </label>
        <label>
          Range:
          <input
            type="string"
            name="range"
            value={formData.range}
            readOnly
          />
        </label>
        <label>
          Attacks:
          <input
            type="string"
            name="attacks"
            value={formData.attacks}
            readOnly
          />
        </label>
        <label>
          Weapon Skill:
          <input
            type="string"
            name="weaponSkill"
            value={formData.weaponSkill}
            readOnly
          />
        </label>
        <label>
          Strength:
          <input
            type="string"
            name="strength"
            value={formData.strength}
            readOnly
          />
        </label>
        <label>
          Armor Penetration:
          <input
            type="string"
            name="armorPenetration"
            value={formData.armorPenetration}
            readOnly
          />
        </label>
        <label>
          Damage:
          <input
            type="string"
            name="damage" // Fixed field name
            value={formData.damage}
            readOnly
          />
        </label>
        <label>
          Keywords:
          <input
            type="text"
            name="keywords"
            value={formData.keywords.join(', ')}
            readOnly
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default MeleeWeaponForm;
