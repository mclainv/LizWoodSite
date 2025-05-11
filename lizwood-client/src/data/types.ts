export interface MenuItem {
  name: string;
  path: string;
  thumbnail: string | null;
  children: {
    name: string;
    path: string;
  }[];
}

export interface ProjectImage {
  src: string;
  alt: string;
}

export interface ProjectImages {
  [category: string]: {
    [project: string]: ProjectImage[];
  };
} 