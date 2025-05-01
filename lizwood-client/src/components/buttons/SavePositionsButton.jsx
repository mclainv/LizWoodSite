import React from 'react';
// import { connectToDatabase, savePositionsDB } from '../database/db';
export default function SavePositionsButton({ 
    draggableImageFiles, draggableImageRefs, fixedImageFiles, fixedImageRefs, modelType 
  }) {
  const handleClick = async () => {
    // build items array by pulling latest position from each ref
    const draggableItems = draggableImageFiles.map((file, index) => {
      const ref = draggableImageRefs.current[index];
      // getPosition returns { x, y, z, rotated }
      const currentPos = ref && ref.getPosition ? ref.getPosition() : file.defaultPosition;
      return {
        path:            file.path,
        alt:             file.alt,
        ogWidth:           file.ogWidth,
        ogHeight:          file.ogHeight,
        defaultPosition: currentPos,
      };
      
    });
    const fixedItems = fixedImageFiles.map((file, index) => {
      const ref = fixedImageRefs.current[index];
      const currentPos = ref && ref.getPosition ? ref.getPosition() : file.defaultPosition;
      return {
        path: file.path,
        alt: file.alt,
        ogWidth: file.ogWidth,
        ogHeight: file.ogHeight,
        defaultPosition: currentPos,
      };
    });
    

    console.log("draggableItems are ", draggableItems);
    // send clean payload to Netlify Function
    try {
      const resp = await fetch('/.netlify/functions/savePositions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelType, draggableItems, fixedItems }),
      });
      if (resp.ok) {
        alert('Positions saved successfully.');
      } else {
        console.error('Save failed', resp.statusText);
        alert('Failed to save positions.');
      }
    } catch (err) {
      console.error('Save error', err);
      alert('Error saving positions.');
    }
  };

  return <button onClick={handleClick}>Save Positions</button>;
} 