const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  try {
    const { category, project } = event.queryStringParameters;
    
    // Use the public directory path
    const projectDir = path.join(__dirname, '../../public/projects', category, project);
    console.log('Function directory:', __dirname);
    console.log('Looking for project in:', projectDir);
    console.log('Directory contents:', fs.readdirSync(path.join(__dirname, '../../public')));

    // Check if directory exists
    if (!fs.existsSync(projectDir)) {
      console.log('Project directory not found');
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Project not found' })
      };
    }

    // Read all image files from the directory
    const files = fs.readdirSync(projectDir)
      .filter(file => {
        const filePath = path.join(projectDir, file);
        return fs.statSync(filePath).isFile() && 
               /\.(jpg|jpeg|png|gif)$/i.test(file);
      });

    console.log(`Found ${files.length} images in project directory`);

    // Create image data array
    const images = files.map(file => ({
      src: `/projects/${category}/${project}/${file}`,
      alt: path.parse(file).name
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ images })
    };
  } catch (error) {
    console.error('Error in getProjectImages:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to read project images' })
    };
  }
};