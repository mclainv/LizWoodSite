import React, { useRef, useState, useEffect } from 'react';
import DraggableResizeableImage from '../components/DraggableResizeable.tsx';
import './EditHome.css';
// imageFiles will be loaded dynamically via Netlify Function
import SavePositionsButton from '../components/SavePositionsButton.jsx';

export default function EditHome() {
  const draggableImageRefs = useRef([]);
  const fixedImageRefs = useRef([]);
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

  return (
    <div className="EditPage">
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
            key={index}
            ref={el => draggableImageRefs.current[index] = el}
            src={file.path} 
            alt={file.alt}
            width={file.width} 
            height={file.height}
            rotated={file.defaultPosition.rotated}
            initialPos={file.defaultPosition}
            className="draggable-resizeable-image"
          />
        ))}        
      </div>
    </div>
  );
}