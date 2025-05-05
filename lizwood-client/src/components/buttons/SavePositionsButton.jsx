import React from 'react';
// import { connectToDatabase, savePositionsDB } from '../database/db';
export default function SavePositionsButton({ 
    draggableImageFiles, draggableImageRefs, fixedImageFiles, fixedImageRefs, modelType 
  }) {
  //   const newItems=[{
  //     path: "home/band-group.png",
  //     alt: "Drawn Logo",
  //     ogWidth: 2398,
  //     ogHeight: 1600,
  //     defaultPosition: {
  //       x: 0,
  //       y: 0,
  //       z: 1,
  //       rotated: 0,
  //       width: 240,
  //       height: 160,
  //     }
  //   },
  //   {
  //     path: "home/black.PNG",
  //     alt: "Drawn Logo",
  //     ogWidth: 2398,
  //     ogHeight: 1600,
  //     defaultPosition: {
  //       x: 0,
  //       y: 0,
  //       z: 1,
  //       rotated: 0,
  //       width: 240,
  //       height: 160,
  //     }
  //   },
  //   {
  //     path: "home/rabbit.PNG",
  //     alt: "Drawn Logo",
  //     ogWidth: 2398,
  //     ogHeight: 1600,
  //     defaultPosition: {
  //       x: 0,
  //       y: 0,
  //       z: 1,
  //       rotated: 0,
  //       width: 240,
  //       height: 160,
  //     }
  //   },
  //   {
  //     path: "home/eyes.jpg",
  //     alt: "Drawn Logo",
  //     ogWidth: 2398,
  //     ogHeight: 1600,
  //     defaultPosition: {
  //       x: 0,
  //       y: 0,
  //       z: 1,
  //       rotated: 0,
  //       width: 240,
  //       height: 160,
  //     }
  //   },
  // ]
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
        pin: {
          src: file.pin?.src,
          ogWidth: file.pin?.ogWidth,
          ogHeight: file.pin?.ogHeight,
          defaultPosition: file.pin?.defaultPosition,
        },
      };
      
    });
    // draggableItems.push(...newItems);
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