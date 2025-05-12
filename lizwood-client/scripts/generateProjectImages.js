const fs = require('fs');
const path = require('path');

function generateProjectImages() {
  console.log('Starting project images generation...');
  
  const projectsDir = path.join(__dirname, '../public/projects');
  console.log(`Reading projects directory: ${projectsDir}`);
  
  const projectImages = {};

  // Read all category folders
  const categories = fs.readdirSync(projectsDir)
    .filter(file => fs.statSync(path.join(projectsDir, file)).isDirectory());
  
  console.log(`Found ${categories.length} categories: ${categories.join(', ')}`);

  categories.forEach(category => {
    console.log(`\nProcessing category: ${category}`);
    const categoryPath = path.join(projectsDir, category);
    const projects = fs.readdirSync(categoryPath)
      .filter(file => fs.statSync(path.join(categoryPath, file)).isDirectory())
        .sort(function(a, b) {
          return a < b ? -1 : 1; });
    
    console.log(`Found ${projects.length} projects in ${category}`);

    projects.forEach(project => {
      const projectPath = path.join(categoryPath, project);
      const files = fs.readdirSync(projectPath)
        .filter(file => {
          const filePath = path.join(projectPath, file);
          return fs.statSync(filePath).isFile() && 
                 /\.(jpg|jpeg|png|gif|mp4|mov)$/i.test(file);
        });

      console.log(`Found ${files.length} images in project ${project}`);

      const images = files.map(file => ({
        src: `/projects/${category}/${project}/${file}`,
        alt: path.parse(file).name
      }));

      if (!projectImages[category]) {
        projectImages[category] = {};
      }
      projectImages[category][project] = images;
    });
  });

  // Generate the TypeScript content
  const tsContent = `import { ProjectImages } from './types';

export const projectImages: ProjectImages = ${JSON.stringify(projectImages, null, 2)};
`;

  // Write the project images structure to the TypeScript file
  const outputPath = path.join(__dirname, '../src/data/projectImages.ts');
  console.log(`\nWriting project images structure to: ${outputPath}`);
  fs.writeFileSync(outputPath, tsContent);
  
  console.log('\nProject images generation complete!');
  console.log(`Total categories: ${Object.keys(projectImages).length}`);
  console.log(`Total projects: ${Object.values(projectImages).reduce((acc, category) => acc + Object.keys(category).length, 0)}`);
}

console.log('=== Project Images Generation Started ===');
try {
  generateProjectImages();
  console.log('=== Project Images Generation Completed Successfully ===');
} catch (error) {
  console.error('=== Project Images Generation Failed ===');
  console.error('Error:', error);
  process.exit(1);
} 