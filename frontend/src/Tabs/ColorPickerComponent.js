import React, {useEffect, useState} from 'react';
import '../styles/ColorPickerStyle.css';


// Utility function to generate hexagonal grid colors based on HSL values
const generateColorHexagons = (rows, cols) => {
  const hexagons = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const hue = (col / cols) * 360; // Hue varies across the columns
      const saturation = 100; // Full saturation
      const lightness = 50 - (row / rows) * 50; // Darker toward bottom rows
      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      hexagons.push({ color, hue, saturation, lightness, row, col });
    }
  }
  return hexagons;
};

// Grayscale generator function
const generateGrayscale = (steps) => {
  const grayscale = [];
  for (let i = 0; i < steps; i++) {
    const value = Math.round((i / (steps - 1)) * 255);
    grayscale.push(`rgb(${value}, ${value}, ${value})`);
  }
  return grayscale;
};

// Function to convert hex color to HSL
const hexToHSL = (hex) => {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let l = (max + min) / 2;
  let s = 0;
  if (max !== min) {
    s = l < 0.5 ? (max - min) / (max + min) : (max - min) / (2 - max - min);
  }

  let h = 0;
  if (max !== min) {
    if (max === r) h = 60 * ((g - b) / (max - min));
    if (max === g) h = 60 * (2 + (b - r) / (max - min));
    if (max === b) h = 60 * (4 + (r - g) / (max - min));
    if (h < 0) h += 360;
  }

  return { h, s: s * 100, l: l * 100 };
};

// Function to calculate the closest color
const calculateClosestColor = (hslColor, hexagons) => {
  let closestColor = null;
  let closestDistance = Infinity;

  hexagons.forEach((hex) => {
    const distance = Math.sqrt(
      Math.pow(hslColor.h - hex.hue, 2) +
      Math.pow(hslColor.s - hex.saturation, 2) +
      Math.pow(hslColor.l - hex.lightness, 2)
    );

    if (distance < closestDistance) {
      closestDistance = distance;
      closestColor = hex.color;
    }
  });

  return closestColor;
};

// Example usage
const hexColor = "#ff5733";
const hslColor = hexToHSL(hexColor);
console.log(hslColor); // Output: { h: 14.736842105263165, s: 100, l: 60 }




// React component to render the hexagonal color grid
const ColorPickerComponent = ({  }) => {
  const [colorsOwned, setColorsOwned] = useState([]);
  const [newColor, setNewColor] = useState("");

  const hexagons = generateColorHexagons(20, 20);
  const grayscaleColors = generateGrayscale(16);

  useEffect(() => {
    console.log(colorsOwned)
  
  }, [colorsOwned])



  const handleHotkey = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (newColor && /^#[0-9A-F]{6}$/i.test(newColor)) { // Check if it's a valid hex color
        const hslColor = hexToHSL(newColor);
        const closestColor = calculateClosestColor(hslColor, hexagons);

        if (closestColor) {
          setColorsOwned((prevColors) => [...prevColors, closestColor]);
        } else {
          alert('No matching color found.');
        }
      } else {
        alert('Please enter a valid hex color.');
      }
    }
  };


  useEffect(() => {
    window.addEventListener('keydown', handleHotkey);

    return () => {
      window.removeEventListener('keydown', handleHotkey);
    };
  }, [newColor, hexagons]);


  return (
    <div className="color-visualizer">
      {/* Hexagonal color grid */}
      <div className="hex-grid">
        {hexagons.map((hex, index) => (
          <div
            key={index}
            className={`hexagon ${hex.row % 2 === 0 ? 'even-row' : 'odd-row'}`}
            style={{
              backgroundColor: hex.color,
              border: colorsOwned.includes(hex.color)
                ? '10px solid black'
                : '1px solid transparent',
            }}
          ></div>
        ))}
      </div>

      {/* Grayscale grid */}
      <div className="grayscale-grid">
        {grayscaleColors.map((gray, index) => (
          <div
            key={index}
            className="grayscale-cell"
            style={{
              backgroundColor: gray,
              border: colorsOwned.includes(gray)
                ? '2px solid gold'
                : '1px solid black',
            }}
          ></div>
        ))}
      </div>
        
      <input
        type="text"
        className="inputColor"
        placeholder="#hexcolor"
        value={newColor}
        onChange={(e) => setNewColor(e.target.value)}
      />
    </div>
  );
};

export default ColorPickerComponent;
