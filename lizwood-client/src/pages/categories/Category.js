import React, { useState, useEffect } from 'react';
import './Category.css';
import DraggableImage from '../../components/images/Draggable';
import FixedImage from '../../components/images/Fixed';
import paperBackground from '../../assets/paper-background.JPG';

export default function Category({ modelType }) {
  const [draggableImageFiles, setDraggableImageFiles] = useState([]);
  const [fixedImageFiles, setFixedImageFiles] = useState([]);
  modelType = modelType.charAt(0).toUpperCase() + modelType.slice(1);
  console.log("modelType is ", modelType);
  useEffect(() => {
    // fetch saved positions dynamically
    const fetchPositions = async () => {
      try {
        const resp = await fetch('/.netlify/functions/getPositions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ modelType: modelType }),
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
  }, [modelType]);
  console.log("draggables are ", draggableImageFiles);
  return (
    <div className={`${modelType}Category Category`} style={{ backgroundImage: `url(${paperBackground})` }}>
      <div className="imageContainer">
        {Array.isArray(draggableImageFiles) && draggableImageFiles.map((file, index) => (
          <DraggableImage
            key={file._id}
            src={file.path} 
            alt={file.alt}
            ogWidth={file.ogWidth}
            ogHeight={file.ogHeight}
            initialPos={file.defaultPosition}
            pin={{
              src: "/tapes/tape5.png",
              ogWidth: 160,
              ogHeight: 50,
              initialPos: {
                x: 0,
                y: 0,
                rotated: 0,
                width: 80,
                height: 25
              }
            }}
            className="draggable-image"
          />
        ))}
        {Array.isArray(fixedImageFiles) && fixedImageFiles.map((file, index) => (
          <FixedImage
            key={index}
            src={file.path}
            alt={file.alt}
            ogWidth={file.defaultPosition.width}
            ogHeight={file.defaultPosition.height}
            initialPos={file.defaultPosition}
            className="fixed-image"
          />
        ))}
      </div>
    </div>
  );
}