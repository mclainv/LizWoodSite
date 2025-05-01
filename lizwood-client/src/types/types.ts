export interface Position {
  _id: string;
  path: string;
  alt: string;
  ogWidth: number;
  ogHeight: number;
  defaultPosition: {
    x: number;
    y: number;
    z: number;
    rotated: number;
    width: number;
    height: number;
  };
}

