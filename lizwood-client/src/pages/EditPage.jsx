import React, { useRef, useState, useEffect } from 'react';
import DraggableResizeableImage from '../components/DraggableResizeable.tsx';
import './EditPage.css';
// imageFiles will be loaded dynamically via Netlify Function
import SavePositionsButton from '../components/SavePositionsButton';

function EditPage() {
  const imageRefs = useRef([]);
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
    <div className="EditPage">
      <SavePositionsButton
        imageFiles={imageFiles}
        imageRefs={imageRefs}
        modelType="HomePosition"
      />
      <div className="imageContainer">
        {imageFiles.map((file, index) => (
          <DraggableResizeableImage
            key={index}
            ref={el => imageRefs.current[index] = el}
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

export default EditPage;