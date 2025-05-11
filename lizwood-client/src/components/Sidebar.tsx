import React, { useState, useEffect } from 'react';
import './Sidebar.scss';

interface SidebarProps {
  category: string;
  project: string;
}

interface MenuItem {
  text: string;
  path: string;
  isBold: boolean;
  image?: string;
  children?: MenuItem[];
}

export default function Sidebar({ category, project }: SidebarProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchMenuStructure = async () => {
      try {
        const response = await fetch('/.netlify/functions/getMenuStructure');
        if (!response.ok) throw new Error('Failed to fetch menu structure');
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu structure:', error);
      }
    };

    fetchMenuStructure();
  }, []);
  console.log(menuItems);
  return (
    <nav className="Sidebar">
      <a href="/">
        <img
          className="logo"
          src="/assets/LW-LOGO.png"
          alt="Liz Wood Logo"
          width="100%"
          height="auto"
        />
      </a>
      <div className="menu-area">
        {menuItems.map((item, index) => (
          <div key={index} className="menu-group">
            <a href={item.path} className="category-image-link">
              <img 
                src={item.image} 
                alt={item.text} 
                className="category-image"
                width="100%"
                height="auto"
              />
            </a>
            {item.children && item.children.length > 0 && (
              <ul className="project-links">
                {item.children.map((child, childIndex) => {
                  const currentPath = "/" + category + "/" + project;
                  const isCurrentPath = currentPath === (item.path + child.path);
                  const imageName = child.text;
                  return (
                    <li key={childIndex}>
                      <a 
                        href={`${item.path}/${imageName}`}
                        className={`${child.isBold ? 'bold' : ''} ${isCurrentPath ? 'highlighted' : ''}`}
                      >
                        <img 
                          src={`/sidebar${item.path}/${child.path}`}
                          alt={child.text}
                          className="menu-thumbnail"
                        />
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