import React from 'react';
// import { connectToDatabase, savePositionsDB } from '../database/db';
export default function SavePositionsButton({ 
    draggableItemsData, 
    draggableItemRefs, 
    fixedItemsData, 
    fixedItemRefs, 
    modelType 
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
    // Process Draggable Items
    const draggableItems = draggableItemsData.map((item) => {
      // Get ref using item._id
      const ref = draggableItemRefs.current[item._id];
      let currentPosData;

      // Safely get position data from ref
      if (ref && ref.current && typeof ref.current.getPosition === 'function') {
        currentPosData = ref.current.getPosition(); 
        // getPosition returns: { x, y, z, rotated, width, height, pin? }
      } else {
        console.warn(`Ref missing or invalid for draggable item ID: ${item._id}`);
        // Fallback to original data if ref is missing (should ideally not happen)
        currentPosData = item.defaultPosition;
      }
      // Construct the payload object matching the schema
      return {
        _id: item._id,
        positionData: currentPosData
        }
    });

    // Process Fixed Items
    const fixedItems = fixedItemsData.map((item) => {
       // Get ref using item._id
      const ref = fixedItemRefs.current[item._id];
      let currentPosData;

      // Safely get position data from ref
      if (ref && ref.current && typeof ref.current.getPosition === 'function') {
        currentPosData = ref.current.getPosition();
      } else {
        console.warn(`Ref missing or invalid for fixed item ID: ${item._id}`);
        currentPosData = item.defaultPosition;
      }

      // Construct the payload object matching the schema
      return {
        _id: item._id,
        positionData: currentPosData
        }
    });
    

    console.log("Saving Draggable Items:", draggableItems);
    console.log("Saving Fixed Items:", fixedItems);

    // Send payload to Netlify Function
    try {
      const resp = await fetch('/.netlify/functions/savePositions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelType, draggableItems, fixedItems }), // Send the processed arrays
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