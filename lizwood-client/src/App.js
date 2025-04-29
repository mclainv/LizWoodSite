import React, { useRef } from 'react';
import DraggableImage from './components/Draggable';
import './App.css';
import imageFiles from './assets/homePageImages.json';
import Resizeable from './components/ResizableImage';
import SavePositionsButton from './components/SavePositionsButton';

function App() {
  const imageRefs = useRef([]);

  return (
    <div className="App">
      <SavePositionsButton imageFiles={imageFiles} imageRefs={imageRefs} />
      <div className="imageContainer">
        {imageFiles.map((file, index) => (
          <DraggableImage 
            key={index}
            ref={el => imageRefs.current[index] = el}
            src={file.path} 
            alt={file.alt}
            width={file.width} 
            height={file.height} 
            initialPos={file.defaultPosition}
            className="draggable-image"
          />
        ))}        
      </div>
      Hello
      {/* <Resizeable src="assets/LW-LOGO.png" alt="Liz wood logo"></Resizeable> */}
      <div>Hello</div>
    </div>
  );
}

export default App;
