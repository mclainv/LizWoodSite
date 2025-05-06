import mongoose from 'mongoose';

export interface Position {
  x: number; 
  y: number; 
  z: number; 
  rotated: number; 
  width: number; 
  height: number;
  pin?: {
    src: string;
    width: number;
    height: number;
    initialPos: {
      x: number;
      y: number;
      rotated: number;
      width: number;
      height: number;
    };
  };
}

export interface PositionHandle {
  getPosition: () => Position;
}

export interface ImageProps {
  _id: mongoose.Types.ObjectId;
  src: string;
  alt: string;
  ogWidth: number;
  ogHeight: number;
  initialPos?: Position;
  pin?: {
    src: string;
    ogWidth: number;
    ogHeight: number;
    initialPos: {
      x: number;
      y: number;
      rotated: number;
      width: number;
      height: number;
    };
  };
  onDeleteRequest?: (type: string, id: mongoose.Types.ObjectId) => void;
  ref?: React.Ref<PositionHandle>;
}

export interface PinnedImageProps {
  src: string;
  alt: string;
  ogWidth: number;
  ogHeight: number;
  initialPos?: Position;
  pin: {
    src: string;
    width: number;
    height: number;
    initialPos?: Position;
  };
  onDeleteRequest?: () => void;
  ref?: React.Ref<PositionHandle>;
}


