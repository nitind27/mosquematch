import React, { useState } from "react";

function TextSlider() {
  const words = [
    { id: 0, value: "Find a partner in any Mosque in any location" },
    { id: 1, value: "Find someone local that is known in the community" },
    {
      id: 2,
      value: "A online solution for Marriage only",
    },
    { id: 3, value: "Wali feature for full confidence" },
  ];

  const [wordData, setWordData] = useState(words[0].value);
  const [selectedDot, setSelectedDot] = useState(0);

  const handleClick = (index) => {
    console.log(index);
    const wordSlider = words[index].value;
    setWordData(wordSlider);
    setSelectedDot(index);
  };

  return (
    <div className="changing-container-home">
      <div className="word-size">{wordData}</div>
      <div className="flexRow">
        <div className="dotsContainer">
          {words.map((data, i) => (
            <span
              key={i}
              className={`dot ${selectedDot === i ? "selected" : ""}`}
              onClick={() => handleClick(i)}
            ></span>
          ))}
          <span className="dotPlaceholder">.</span>
        </div>
      </div>
    </div>
  );
}

export default TextSlider;
