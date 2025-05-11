const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  try {
    const sidebarDir = path.join(__dirname, '../../public/sidebar');
    const menuItems = [];

    // Read the public directory
    const folders = fs.readdirSync(sidebarDir)
      .filter(item => {
        const itemPath = path.join(sidebarDir, item);
        return fs.statSync(itemPath).isDirectory() && 
               !item.startsWith('.') && 
               item !== 'home' && 
               item !== 'menu';
      });

    // Create menu items for each folder
    for (const folder of folders) {
      const folderPath = path.join(sidebarDir, folder);
      const files = fs.readdirSync(folderPath)
        .filter(file => {
          const filePath = path.join(folderPath, file);
          return fs.statSync(filePath).isFile() && 
                 /\.(jpg|jpeg|png|gif)$/i.test(file);
        });

      const children = files.map(file => ({
        text: path.parse(file).name,
        path: `/${file}`,
        isBold: false
      }));

      menuItems.push({
        text: folder.charAt(0).toUpperCase() + folder.slice(1),
        path: `/${folder}`,
        isBold: true,
        children
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify(menuItems)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to read menu structure' })
    };
  }
}; 