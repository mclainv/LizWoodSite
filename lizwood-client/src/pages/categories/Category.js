import React, { useState, useEffect, useRef } from 'react';
import './Category.css';
import DraggableImage from '../../components/images/Draggable';
import FixedImage from '../../components/images/Fixed';
import Menu from '../../components/menu.tsx';
import paperBackground from '../../assets/paper-background.JPG';

export default function Category({ modelType }) {
  const [draggableImageFiles, setDraggableImageFiles] = useState([]);
  const [fixedImageFiles, setFixedImageFiles] = useState([]);
  const menuRef = useRef();
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

  const handleMenuOpen = () => {
    menuRef.current.open();
  };

  return (
    <div className={`${modelType}Category pageContainer`} style={{ backgroundImage: `url(${paperBackground})` }}>
      <Menu ref={menuRef} />
      <div className="imageContainer">
        {Array.isArray(draggableImageFiles) && draggableImageFiles.map((file, index) => (
          <DraggableImage
            key={file._id}
            src={file.path} 
            alt={file.alt}
            route={file.route}
            ogWidth={file.ogWidth}
            ogHeight={file.ogHeight}
            initialPos={file.defaultPosition}
            pin={file.defaultPosition.pin ? file.defaultPosition.pin : 
              {
                src: 'tapes/pink_pin.png',
                ogWidth: 89,
                ogHeight: 86,
                initialPos: {
                  x: 0,
                  y: 0,
                  rotated: 0,
                  width: 89,
                  height: 86
                }
              }
            }
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
            onMenuOpen={handleMenuOpen}
          />
        ))}
      </div>
    </div>
  );
}