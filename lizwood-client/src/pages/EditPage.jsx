import React, { useRef } from 'react';
import DraggableResizeableImage from '../components/DraggableResizeable';
import './EditPage.css';
import imageFiles from '../assets/homePageImages.json';
import SavePositionsButton from '../components/SavePositionsButton';

function EditPage() {
  const imageRefs = useRef([]);

  return (
    <div className="EditPage">
      <SavePositionsButton imageFiles={imageFiles} imageRefs={imageRefs} />
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