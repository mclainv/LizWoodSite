import React, { useRef, useState, useEffect } from 'react';
import DraggableResizeableImage from '../components/images/DraggableResizeable.tsx';
import './EditHome.css';
import '../index.css';
import paperBackground from '../assets/paper-background.JPG';
// imageFiles will be loaded dynamically via Netlify Function
import SavePositionsButton from '../components/buttons/SavePositionsButton.jsx';

export default function EditHome() {
  const draggableImageRefs = useRef([]);
  const fixedImageRefs = useRef([]);
  const [draggableImageFiles, setDraggableImageFiles] = useState([]);
  const [fixedImageFiles, setFixedImageFiles] = useState([]);

  const handleDeleteRequest = (type, srcToDelete) => {
    if (type === "draggable") {
      setDraggableImageFiles(currentItems => currentItems.filter(item => item.path !== srcToDelete));
      // Also remove the ref if you're managing them dynamically
      delete draggableImageRefs.current[srcToDelete];
    } else if (type === "fixed") {
      setFixedImageFiles(currentItems => currentItems.filter(item => item.path !== srcToDelete));
      delete fixedImageRefs.current[srcToDelete];
    }
  }
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

  return (
    <div className="EditHome" style={{ backgroundImage: `url(${paperBackground})` }}>
      <SavePositionsButton
        draggableImageFiles={draggableImageFiles}
        draggableImageRefs={draggableImageRefs}
        fixedImageFiles={fixedImageFiles}
        fixedImageRefs={fixedImageRefs}
        modelType="HomePosition"
      />
      <div className="imageContainer">
        {draggableImageFiles.map((file, index) => (
          <DraggableResizeableImage
            key={file.path}
            ref={el => draggableImageRefs.current[index] = el}
            onDeleteRequest={() => handleDeleteRequest("draggable", file.path)}
            src={file.path} 
            alt={file.alt}
            width={file.width} 
            height={file.height}
            rotated={file.defaultPosition.rotated}
            initialPos={file.defaultPosition}
            className="draggable-resizeable-image"
          />
        ))}
        {Array.isArray(fixedImageFiles) && fixedImageFiles.map((file, index) => (
          <DraggableResizeableImage
            key={index}
            ref={el => fixedImageRefs.current[index] = el}
            onDeleteRequest={() => handleDeleteRequest("fixed", file.path)}
            src={file.path}
            alt={file.alt}
            ogWidth={file.defaultPosition.width}
            ogHeight={file.defaultPosition.height}
            initialPos={file.defaultPosition}
            className="draggable-resizeable-image"
          />
        ))}        
      </div>
    </div>
  );
}