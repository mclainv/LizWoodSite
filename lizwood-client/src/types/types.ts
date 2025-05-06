export interface Point {
  x: number;
  y: number;
}
  
export interface Size {
  x: number;
  y: number;
}
export interface Position extends Size {
  x: number;
  y: number;
  z: number;
  rotated: number;
  width: number;
  height: number;
  pin?: PinData;
}

// Data for a pin attachment
export interface PinData {
  src: string;        // Source URL of the pin image
  ogWidth: number;    // Original width of the pin image
  ogHeight: number;   // Original height of the pin image
  initialPos: {
      x: number;      // Initial X position relative to parent image
      y: number;      // Initial Y position relative to parent image
      rotated: number;// Initial rotation 
      width: number;  // Initial display width
      height: number; // Initial display height
  };
}

// Represents one available pin image source and its original properties
export interface PinSourceData {
  src: string;
  ogWidth: number;
  ogHeight: number;
  rotated?: number; // Optional initial rotation for this specific source
}

// Props for the DraggableResizeableImage component
export interface ImageProps {
  _id: string;       // Unique ID from database
  src: string;        // Source URL of the main image
  alt: string;        // Alt text for the main image
  ogWidth: number;    // Original width of the main image
  ogHeight: number;   // Original height of the main image
  initialPos: Position; // Initial state (position, size, rotation, z-index)
  pin?: PinData;      // Optional pin data
  onDeleteRequest: (itemType: 'draggable' | 'fixed', id: string) => void; // Callback for deletion
  ref: React.Ref<any>; // Ref for accessing imperative methods like getPosition
} 

// Represents the CURRENT state of the pin to be saved in defaultPosition
export interface PinCurrentState {
  src: string;
  x: number;
  y: number;
  rotated: number;
  width: number;
  height: number;
}

export interface PositionHandle {
  getPosition: () => Position;
}


