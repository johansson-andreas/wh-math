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
function ColorPicker(element) {
  this.element = element;

  this.init = function() {
      var diameter = this.element.offsetWidth;

      var canvas = document.createElement('canvas');
      canvas.height = diameter;
      canvas.width = diameter,
      this.canvas = canvas;

      this.renderColorMap();

      element.appendChild(canvas);

      this.setupBindings();
  };

  this.renderColorMap = function() {
      var canvas = this.canvas;
      var ctx = canvas.getContext('2d');

      var radius = canvas.width / 2;
      var toRad = (2 * Math.PI) / 360;
      var step = 1 / radius;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      var cx = cy = radius;
      for(var i = 0; i < 360; i += step) {
          var rad = i * toRad;
          var x = radius * Math.cos(rad),
              y = radius * Math.sin(rad);
          
          ctx.strokeStyle = 'hsl(' + i + ', 100%, 50%)';
         
          ctx.beginPath();
          ctx.moveTo(radius, radius);
          ctx.lineTo(cx + x, cy + y);
          ctx.stroke();
      }

      // draw saturation gradient
      var grd = ctx.createRadialGradient(cx,cy,0,cx,cx,radius);
      grd.addColorStop(0,"white");
      grd.addColorStop(1,'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grd;
      //ctx.fillStyle = 'rgb(255, 255, 255)';
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      
      // render the rainbow box here ----------
  };

  this.renderMouseCircle = function(x, y) {
      var canvas = this.canvas;
      var ctx = canvas.getContext('2d');

      ctx.strokeStyle = 'rgb(255, 255, 255)';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.lineWidth = '3';
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
  };

  this.setupBindings = function() {
      var canvas = this.canvas;
      var ctx = canvas.getContext('2d');
      var self = this;

      canvas.addEventListener('click', function(e) {
          var x = e.offsetX || e.clientX - this.offsetLeft;
          var y = e.offsetY || e.clientY - this.offsetTop;

          var imgData = ctx.getImageData(x, y, 1, 1).data;
          //var selectedColor = new Color(imgData[0], imgData[1], imgData[2]);
          // do something with this

          self.renderMouseCircle(x, y);
      }, false);
  };
  
  function rgbToHsv(r, g, b){
      r = r/255, g = g/255, b = b/255;
      var max = Math.max(r, g, b), min = Math.min(r, g, b);
      var h, s, v = max;

      var d = max - min;
      s = max == 0 ? 0 : d / max;

      if(max == min){
          h = 0; // achromatic
      }else{
          switch(max){
              case r: h = (g - b) / d + (g < b ? 6 : 0); break;
              case g: h = (b - r) / d + 2; break;
              case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
      }

      return [h, s, v];
  }
  
  this.plotRgb = function(r, g, b) {
      var canvas = this.canvas;
      var ctx = canvas.getContext('2d');
      
      var [h, s, v] = rgbToHsv(r, g, b);
      var theta = h * 2 * Math.PI;
      var maxRadius = canvas.width / 2;
      var r = s * maxRadius;
      var x = r * Math.cos(theta) + maxRadius,
          y = r * Math.sin(theta) + maxRadius;
      this.renderMouseCircle(x, y);        
  }

  this.init();
}

var pick = new ColorPicker(document.querySelector('.color-space'));

var RGBList = [
  {'r':231,'g':52,'b':35},
  {'r':255,'g':128,'b':128},
  {'r':153,'g':77,'b':77},
  {'r':24,'g':111,'b':24}
];

RGBList.forEach(function (color) {
pick.plotRgb(color.r, color.g, color.b);
})  

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

  const hexagons = generateColorHexagons(10, 10);
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
      <div class="color-space"></div>
    </div>
    
  );
};

export default ColorPickerComponent;
