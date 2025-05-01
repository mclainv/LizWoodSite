export interface Position {
  x: number; y: number; z: number; rotated: number; width: number; height: number;
}

export interface PositionHandle {
  getPosition: () => Position;
}

export interface ImageProps {
  src: string;
  alt: string;
  ogWidth: number;
  ogHeight: number;
  initialPos?: Position;
  ref?: React.Ref<PositionHandle>;
}
