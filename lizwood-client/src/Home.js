import React, { useState, useEffect } from 'react';
import DraggableImage from './components/Draggable';
import FixedImage from './components/FixedImage';
import './Home.css';
import paperBackground from './assets/paper-background.JPG';
export default function Home() {
  const [draggableImageFiles, setDraggableImageFiles] = useState([]);
  const [fixedImageFiles, setFixedImageFiles] = useState([]);

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
        const draggableImages = data.draggableImages;
        const fixedImages = data.fixedImages;
        setDraggableImageFiles(draggableImages);
        setFixedImageFiles(fixedImages);
      } catch (err) {
        console.error('Error loading positions:', err);
      }
    };
    fetchPositions();
  }, []);
  console.log("draggables are ", draggableImageFiles);
  return (
    <div className="Home" style={{ backgroundImage: `url(${paperBackground})` }}>
      <div className="imageContainer">
        {Array.isArray(draggableImageFiles) && draggableImageFiles.map((file, index) => (
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
        {Array.isArray(fixedImageFiles) && fixedImageFiles.map((file, index) => (
          <FixedImage
            key={index}
            src={file.path} 
            alt={file.alt}
            width={file.defaultPosition.width}
            height={file.defaultPosition.height}
            style={{ 
              cursor: 'default',
              position: 'absolute', 
              left: file.defaultPosition.x, 
              top: file.defaultPosition.y,
              zIndex: file.defaultPosition.z,
              transform: `rotate(${file.defaultPosition.rotated}deg)`
            }}
            className="fixed-image"
          />
        ))}
      </div>
    </div>
  );
}