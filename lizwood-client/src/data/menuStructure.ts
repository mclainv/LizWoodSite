export interface MenuItem {
  name: string;
  path: string;
  thumbnail: string | null;
  children: {
    name: string;
    path: string;
  }[];
}

export const menuStructure: MenuItem[] = [
  // This will be populated by the build script
]; 