import React, { useRef } from 'react';
import DraggableImage from './components/DraggableImage';
import './App.css';
import imageFiles from './assets/imageFiles.json';

function App() {
  const imageRefs = useRef([]);

  const handleButtonClick = () => {
    // Get current positions of all images
    const updatedPositions = imageFiles.map((file, index) => {
      let position = file.defaultPosition; // Use original as fallback
      
      // If we have a valid ref, get the current position
      if (imageRefs.current[index] && imageRefs.current[index].getPosition) {
        position = imageRefs.current[index].getPosition();
      }
      
      // Return a new object with updated position
      return {
        ...file,
        defaultPosition: position
      };
    });
    
    // Create the updated JSON structure
    const updatedJSON = JSON.stringify(updatedPositions, null, 2);
    
    // Log to console
    console.log("Updated image positions:");
    console.log(updatedJSON);
    
    // Log positions in a more readable format
    console.log("Image positions summary:");
    updatedPositions.forEach((item, index) => {
      console.log(`Image ${index + 1} (${item.alt}): x=${item.defaultPosition.x}, y=${item.defaultPosition.y}`);
    });
  };

  return (
    <div className="App">
      <button onClick={handleButtonClick}>Save Positions</button>
      <div className="imageContainer">
        {imageFiles.map((file, index) => (
          <DraggableImage 
            key={index}
            ref={el => imageRefs.current[index] = el}
            src={file.path} 
            alt={file.alt}
            width={file.width} 
            height={file.height} 
            defaultPosition={file.defaultPosition}
            className="draggable-image"
          />
        ))}
      </div>
    </div>
  );
}

export default App;
