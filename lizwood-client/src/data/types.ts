export interface MenuItem {
  name: string;
  path: string;
  thumbnail: string | null;
  children: {
    name: string;
    path: string;
  }[];
} 