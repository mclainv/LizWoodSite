import React from 'react';
// import { connectToDatabase, savePositionsDB } from '../database/db';
export default function SavePositionsButton({ imageFiles, imageRefs, modelType }) {
  const handleClick = async () => {
    // build items array by pulling latest position from each ref
    const items = imageFiles.map((file, index) => {
      const ref = imageRefs.current[index];
      // getPosition returns { x, y, z, rotated }
      const currentPos = ref && ref.getPosition ? ref.getPosition() : file.defaultPosition;
      return {
        path:            file.path,
        alt:             file.alt,
        ogWidth:           file.width,
        ogHeight:          file.height,
        defaultPosition: currentPos,
      };
    });

    // send clean payload to Netlify Function
    try {
      const resp = await fetch('/.netlify/functions/savePositions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelType, items }),
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