import React from 'react'
import './Project.scss';
// Define props type
interface ProjectProps {
  category: string;
  project: string;
}

// Accept props object and destructure
export default function Project({ category, project }: ProjectProps) {
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
      text: "Direction",
      isBold: true,
      children: [
        { text: "Thesis", isBold: false, path: "/thesis" },
        { text: "Clam", isBold: true, isHighlighted: true, path: "/clam" },
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
                  {item.children.map((child, childIndex) => (
                    <li key={childIndex}>
                      <a 
                        href={child.path} 
                        className={`${child.isBold ? 'bold' : ''} ${child.isHighlighted ? 'highlighted' : ''}`}
                      >
                        {child.text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </nav>
      <div className="ImageGallery">
        {[...Array(10)].map((_, index) => (
          <img 
            key={index} 
            src={`https://picsum.photos/600/400?random=${index}`} 
            alt={`Random placeholder ${index + 1}`} 
            style={{ width: '100%', height: 'auto', marginBottom: '10px', display: 'block' }} 
          />
        ))}
      </div>
    </div>
  );
}