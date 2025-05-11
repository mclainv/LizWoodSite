import React from 'react';
import './Sidebar.scss';

interface SidebarProps {
  category: string;
  project: string;
}

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

export default function Sidebar({ category, project }: SidebarProps) {
  return (
    <nav className="Sidebar">
      <img
        src="/home/LW-LOGO.png"
        alt="Liz Wood Logo"
        width="300rem"
        height="auto"
      />
      <div className="text-area">
        {menuItems.map((item, index) => (
          <div key={index} className="menu-group">
            <p className={`category-header`}>
              {item.text}
            </p>
            {item.children && item.children.length > 0 && (
              <ul className="project-links">
                {item.children.map((child, childIndex) => {
                  const currentPath = "/" + category + "/" + project;
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
  );
} 