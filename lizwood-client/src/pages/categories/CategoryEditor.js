import React, { useRef, useState, useEffect } from 'react';
import DraggableResizeableImage from '../../components/images/DraggableResizeable.tsx';
import './EditCategory.css';
import '../../index.css';
import paperBackground from '../../assets/paper-background.JPG';
// imageFiles will be loaded dynamically via Netlify Function
import SavePositionsButton from '../../components/buttons/SavePositionsButton.jsx';

export default function EditCategory({ modelType }) {
  // Use objects for refs, keyed by item._id
  const draggableImageRefs = useRef({}); 
  const fixedImageRefs = useRef({});
  const [draggableImageFiles, setDraggableImageFiles] = useState([]);
  const [fixedImageFiles, setFixedImageFiles] = useState([]);

  modelType = modelType.charAt(0).toUpperCase() + modelType.slice(1);
  // Update handler to use idToDelete
  const handleDeleteRequest = async (type, idToDelete) => {
    console.log(`Requesting delete for ${type} ID: ${idToDelete}`);

    // Define item type based on 'type' argument
    const itemType = type; // e.g., 'draggable' or 'fixed'

    try {
      // Call the backend delete function
      const resp = await fetch('/.netlify/functions/deletePosition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelType, itemType, idToDelete }),
      });

      if (!resp.ok) {
        // Handle backend error (e.g., show message, don't update UI)
        console.error('Backend delete failed:', await resp.text());
        alert('Failed to delete image from database.');
        return; // Stop further execution
      }

      // --- If backend deletion was successful, update UI state ---
      if (type === "draggable") {
        setDraggableImageFiles(currentItems => currentItems.filter(item => item._id !== idToDelete));
        if (draggableImageRefs.current[idToDelete]) {
          delete draggableImageRefs.current[idToDelete];
        }
      } else if (type === "fixed") {
        setFixedImageFiles(currentItems => currentItems.filter(item => item._id !== idToDelete));
        if (fixedImageRefs.current[idToDelete]) {
          delete fixedImageRefs.current[idToDelete];
        }
      }
    } catch (err) {
        // Handle fetch error
        console.error('Error calling delete function:', err);
        alert('Error communicating with server to delete image.');
    }
  }

  useEffect(() => {
    // fetch saved positions dynamically
    const fetchPositions = async () => {
      try {
        const resp = await fetch('/.netlify/functions/getPositions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ modelType: modelType }),
        });
        if (!resp.ok) throw new Error(resp.statusText);
        const data = await resp.json();
        // Ensure fetched items have _id
        console.log("Fetched Draggable:", data.draggableImages);
        console.log("Fetched Fixed:", data.fixedImages);
        setDraggableImageFiles(data.draggableImages || []);
        setFixedImageFiles(data.fixedImages || []);
      } catch (err) {
        console.error('Error loading positions:', err);
      }
    };
    fetchPositions();
  }, [modelType]);

  return (
    <div className={`Edit${modelType} CategoryEditor`} style={{ backgroundImage: `url(${paperBackground})` }}>
      <SavePositionsButton
        // Pass the state arrays directly
        draggableItemsData={draggableImageFiles} 
        fixedItemsData={fixedImageFiles} 
        // Pass the ref objects
        draggableItemRefs={draggableImageRefs} 
        fixedItemRefs={fixedImageRefs} 
        modelType={modelType} // This might need adjustment depending on Save Button logic now
      />
      <div className="imageContainer">
        {/* Draggable Images Map */}
        {Array.isArray(draggableImageFiles) && draggableImageFiles.map((file) => { // No index needed
          // Ensure ref OBJECT exists for this _id
          if (!draggableImageRefs.current[file._id]) {
             draggableImageRefs.current[file._id] = React.createRef(); // Create ref OBJECT
          }
          return (
            <DraggableResizeableImage
              key={file._id} // Use stable _id for key
              // Pass the ref OBJECT to the ref prop
              ref={draggableImageRefs.current[file._id]} 
              onDeleteRequest={() => handleDeleteRequest("draggable", file._id)} // Pass _id to handler
              src={file.path} 
              alt={file.alt}
              ogWidth={file.ogWidth} 
              ogHeight={file.ogHeight}
              rotated={file.defaultPosition.rotated}
              initialPos={file.defaultPosition}
              pin={file.defaultPosition.pin ? file.defaultPosition.pin : 
                {
                  src: 'tapes/pink_pin.png',
                  ogWidth: 89,
                  ogHeight: 86,
                  initialPos: {
                    x: 0,
                    y: 0,
                    rotated: 0,
                    width: 89,
                    height: 86
                  }
                }
              }
              className="draggable-resizeable-image"
            />
          );
        })}
        {/* Fixed Images Map */}
        {Array.isArray(fixedImageFiles) && fixedImageFiles.map((file) => { // No index needed
          // Ensure ref OBJECT exists for this _id
          if (!fixedImageRefs.current[file._id]) {
             fixedImageRefs.current[file._id] = React.createRef(); // Create ref OBJECT
          }
          return (
            <DraggableResizeableImage
              key={file._id} // Use stable _id for key
              // Pass the ref OBJECT to the ref prop
              ref={fixedImageRefs.current[file._id]} 
              onDeleteRequest={() => handleDeleteRequest("fixed", file._id)} // Pass _id to handler
              src={file.path}
              alt={file.alt}
              ogWidth={file.defaultPosition.width}
              ogHeight={file.defaultPosition.height}
              initialPos={file.defaultPosition}
              className="draggable-resizeable-image"
            />
          );
        })}      
          
      </div>
    </div>
  );
}