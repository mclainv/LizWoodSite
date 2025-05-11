const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  try {
    const { category, project } = event.queryStringParameters;
    const projectDir = path.join(__dirname, '../../public/projects', category, project);

    // Check if directory exists
    if (!fs.existsSync(projectDir)) {
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
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to read project images' })
    };
  }
};