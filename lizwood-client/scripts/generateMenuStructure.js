const fs = require('fs');
const path = require('path');

function generateMenuStructure() {
  console.log('Starting menu structure generation...');
  
  const sidebarDir = path.join(__dirname, '../public/sidebar');
  console.log(`Reading sidebar directory: ${sidebarDir}`);
  
  const menuItems = [];

  // Read all category folders
  const categories = fs.readdirSync(sidebarDir)
    .filter(file => fs.statSync(path.join(sidebarDir, file)).isDirectory());
  
  console.log(`Found ${categories.length} categories: ${categories.join(', ')}`);

  categories.forEach(category => {
    console.log(`\nProcessing category: ${category}`);
    const categoryPath = path.join(sidebarDir, category);
    const files = fs.readdirSync(categoryPath);
    console.log(`Found ${files.length} files in ${category}`);
    
    // Find the category thumbnail (should be named category.PNG)
    const categoryThumbnail = files.find(file => 
      file.toLowerCase() === `${category.toLowerCase()}.png`
    );
    console.log(`Category thumbnail: ${categoryThumbnail || 'Not found'}`);

    // Get all other images as children
    const children = files
      .filter(file => !file.toLowerCase().match(`${category.toLowerCase()}.png`))
      .map(file => ({
        name: path.parse(file).name,
        path: `/${category}/${file}`
      }));
    console.log(`Found ${children.length} child items`);

    menuItems.push({
      name: category,
      path: `/${category}`,
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
  console.log(`\nWriting menu structure to: ${outputPath}`);
  fs.writeFileSync(outputPath, tsContent);
  
  console.log('\nMenu structure generation complete!');
  console.log(`Total categories: ${menuItems.length}`);
  console.log(`Total items: ${menuItems.reduce((acc, item) => acc + item.children.length, 0)}`);
}

console.log('=== Menu Structure Generation Started ===');
try {
  generateMenuStructure();
  console.log('=== Menu Structure Generation Completed Successfully ===');
} catch (error) {
  console.error('=== Menu Structure Generation Failed ===');
  console.error('Error:', error);
  process.exit(1);
} 