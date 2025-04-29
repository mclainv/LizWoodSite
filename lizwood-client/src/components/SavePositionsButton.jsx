import React from 'react';

export default function SavePositionsButton({ imageFiles, imageRefs }) {
  const handleClick = async () => {
    const updatedPositions = imageFiles.map((file, index) => {
      let position = file.defaultPosition;
      const ref = imageRefs.current[index];
      if (ref && ref.getPosition) {
        position = ref.getPosition();
      }
      return { ...file, defaultPosition: position };
    });

    // send to Netlify Function
    try {
      const resp = await fetch('/.netlify/functions/savePositions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPositions),
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