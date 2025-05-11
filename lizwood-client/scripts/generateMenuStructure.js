const fs = require('fs');
const path = require('path');

function generateMenuStructure() {
  const sidebarDir = path.join(__dirname, '../public/sidebar');
  const menuItems = [];

  // Read all category folders
  const categories = fs.readdirSync(sidebarDir)
    .filter(file => fs.statSync(path.join(sidebarDir, file)).isDirectory());

  categories.forEach(category => {
    const categoryPath = path.join(sidebarDir, category);
    const files = fs.readdirSync(categoryPath);
    
    // Find the category thumbnail (should be named category.PNG)
    const categoryThumbnail = files.find(file => 
      file.toLowerCase() === `${category.toLowerCase()}.png`
    );

    // Get all other images as children
    const children = files
      .filter(file => !file.toLowerCase().match(`${category.toLowerCase()}.png`))
      .map(file => ({
        name: path.parse(file).name,
        path: `/sidebar/${category}/${file}`
      }));

    menuItems.push({
      name: category,
      path: `/sidebar/${category}`,
      thumbnail: categoryThumbnail ? `/sidebar/${category}/${categoryThumbnail}` : null,
      children
    });
  });

  // Generate the TypeScript content
  const tsContent = `import { MenuItem } from './types';

export const menuStructure: MenuItem[] = ${JSON.stringify(menuItems, null, 2)};
`;

  // Write the menu structure to the TypeScript file
  const outputPath = path.join(__dirname, '../src/data/menuStructure.ts');
  fs.writeFileSync(outputPath, tsContent);
  console.log('Menu structure generated successfully!');
}

generateMenuStructure(); 