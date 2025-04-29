import React, { useRef } from 'react';
import DraggableImage from './components/Draggable';
import './App.css';
import imageFiles from './assets/homePageImages.json';

function App() {
  const imageRefs = useRef([]);

  return (
    <div className="App">
      <div className="imageContainer">
        {imageFiles.map((file, index) => (
          <DraggableImage 
            key={index}
            src={file.path} 
            alt={file.alt}
            width={file.width} 
            height={file.height} 
            initialPos={file.defaultPosition}
            className="draggable-image"
          />
        ))}        
      </div>
    </div>
  );
}

export default App;
