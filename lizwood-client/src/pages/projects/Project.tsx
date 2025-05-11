import React, {useState, useEffect} from 'react'
import './Project.scss';
// Define props type
interface ProjectProps {
  category: string;
  project: string;
}

// Accept props object and destructure
export default function Project({ category, project }: ProjectProps) {
  const [imageGallery, setImageGallery] = useState([]);
  // const [projectText, setProjectText] = useState({});
  useEffect(() => {
    // fetch saved positions dynamically
    const fetchData = async () => {
      try {
        const resp = await fetch('/.netlify/functions/getProjectData', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: category, project: project }),
        });
        if (!resp.ok) throw new Error(resp.statusText);
        const data = await resp.json();
        const projectData = data.data;
        setImageGallery(projectData.pictures);
        // setProjectText(projectData.text);
      } catch (err) {
        console.error('Error loading positions:', err);
      }
    };
    fetchData();
  }, [category, project]);
  const menuItems = [
    {
      text: "Liz Wood",
      isBold: true,
      children: [
        { text: "About", isBold: false, path: "/about" },
        { text: "Contact", isBold: false, path: "/contact" }
      ]
    },
    {
      text: "Production",
      path: "/production",
      isBold: true,
      children: [
        { text: "Thesis", isBold: false, path: "/thesis" },
        { text: "Clam", isBold: false, path: "/clam" },
        { text: "Sex", isBold: false, path: "/sex" }
      ]
    }
  ];
  
  return (
    <div className="Project">
      <nav className="Sidebar">
        <img
          src="/home/LW-LOGO.png"
          alt="Liz Wood Logo"
          width="300rem"
          height="auto"
        >
        </img>
        <div className="text-area">
          {menuItems.map((item, index) => (
            <div key={index} className="menu-group">
              <p 
                className={`category-header`}
              >
                {item.text}
              </p>
              {item.children && item.children.length > 0 && (
                <ul className="project-links">
                  {item.children.map((child, childIndex) => {
                    const currentPath = "/" + category + "/" + project;
                    console.log("currentPath", currentPath);
                    console.log("item.path + child.path", item.path + child.path);
                    const isCurrentPath = currentPath === (item.path + child.path);
                    return (
                      <li key={childIndex}>
                        <a 
                          href={item.path + child.path} 
                          className={`${child.isBold ? 'bold' : ''} ${isCurrentPath ? 'highlighted' : ''}`}
                        >
                          {child.text}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      </nav>
      <div className="ImageGallery">
        {imageGallery.map((image, index) => (
          <img 
            key={index} 
            src={image.src} 
            alt={image.alt} 
            style={{ width: '100%', height: 'auto', display: 'block' }} 
          />
        ))}
      </div>
    </div>
  );
}