import React, { useState, useEffect } from 'react';
import DraggableImage from './components/Draggable';
import './Home.css';
// import imageFiles from './assets/homePageImages.json';

export default function Home() {
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    // fetch saved positions dynamically
    const fetchPositions = async () => {
      try {
        const resp = await fetch('/.netlify/functions/getPositions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ modelType: 'HomePosition' }),
        });
        if (!resp.ok) throw new Error(resp.statusText);
        const data = await resp.json();
        setImageFiles(data);
      } catch (err) {
        console.error('Error loading positions:', err);
      }
    };
    fetchPositions();
  }, []);

  return (
    <div className="App">
      <div className="imageContainer">
        {imageFiles.map((file, index) => (
          <DraggableImage
            key={index}
            src={file.path} 
            alt={file.alt}
            ogWidth={file.ogWidth}
            ogHeight={file.ogHeight}
            initialPos={file.defaultPosition}
            className="draggable-image"
          />
        ))}        
      </div>
    </div>
  );
}