// src/data/pinSources.ts

// Array of available pin image sources.
// Paths should be relative to the public directory root.
// IMPORTANT: Ensure the initial pin.src passed via props to DraggableResizeableImage
// is included in this list for cycling to work correctly.
export const availablePinSources: string[] = [
  '/assets/tapes/tape-red.png', // Example: Assumes tape-red.png is in public/assets/tapes/
  '/assets/tapes/tape-blue.png',
  '/assets/tapes/tape-green.png',
  // Add other tape/pin image sources here
]; 