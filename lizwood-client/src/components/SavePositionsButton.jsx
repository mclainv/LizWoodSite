import React from 'react';

export default function SavePositionsButton({ imageFiles, imageRefs }) {
  const handleClick = () => {
    const updatedPositions = imageFiles.map((file, index) => {
      let position = file.defaultPosition;
      const ref = imageRefs.current[index];
      if (ref && ref.getPosition) {
        position = ref.getPosition();
      }
      return { ...file, defaultPosition: position };
    });

    const updatedJSON = JSON.stringify(updatedPositions, null, 2);
    console.log('Updated image positions:', updatedJSON);
    updatedPositions.forEach((item, index) => {
      console.log(
        `Image ${index + 1} (${item.alt}): x=${item.defaultPosition.x}, y=${item.defaultPosition.y}`
      );
    });
  };

  return <button onClick={handleClick}>Save Positions</button>;
} 