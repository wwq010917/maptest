import React, { useState } from "react";

const ColorPanel = (props) => {
  const { onColorChange } = props;
  const [selectedColor, setSelectedColor] = useState("red");

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);

    onColorChange(event.target.value);
  };

  return (
    <div className="color-panel">
      <h2>Choose a color:</h2>
      <div className="color-options">
        <label>
          <input
            type="radio"
            name="color"
            value="red"
            checked={selectedColor === "red"}
            onChange={handleColorChange}
          />
          <span style={{ color: "Red" }}>Red</span>
        </label>
        <label>
          <input
            type="radio"
            name="color"
            value="orange"
            checked={selectedColor === "orange"}
            onChange={handleColorChange}
          />
          <span style={{ color: "Orange" }}>Orange</span>
        </label>
        <label>
          <input
            type="radio"
            name="color"
            value="yellow"
            checked={selectedColor === "yellow"}
            onChange={handleColorChange}
          />
          <span style={{ color: "Yellow" }}>Yellow</span>
        </label>
        <label>
          <input
            type="radio"
            name="color"
            value="green"
            checked={selectedColor === "green"}
            onChange={handleColorChange}
          />
          <span style={{ color: "Green" }}>Green</span>
        </label>
        <label>
          <input
            type="radio"
            name="color"
            value="blue"
            checked={selectedColor === "blue"}
            onChange={handleColorChange}
          />
          <span style={{ color: "blue" }}>Blue</span>
        </label>

        <label>
          <input
            type="radio"
            name="color"
            value="purple"
            checked={selectedColor === "purple"}
            onChange={handleColorChange}
          />
          <span style={{ color: "Purple" }}>Purple</span>
        </label>
        <label>
          <input
            type="radio"
            name="color"
            value="black"
            checked={selectedColor === "black"}
            onChange={handleColorChange}
          />
          <span style={{ color: "black" }}>Black</span>
        </label>
      </div>
      <p>Selected color: {selectedColor}</p>
    </div>
  );
};

export default ColorPanel;
