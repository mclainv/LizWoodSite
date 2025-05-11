import React, { useState, useEffect } from 'react';
import './Sidebar.scss';
import { menuStructure } from '../data/menuStructure';
import { MenuItem } from '../data/types';

interface SidebarProps {
  category?: string;
  project?: string;
}

export default function Sidebar({ category, project }: SidebarProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    setMenuItems(menuStructure);
  }, []);

  return (
    <div className="Sidebar">
      <img src="/sidebar/logo.PNG" alt="Liz Wood Logo" className="logo" />
      <div className="menu-area">
        {menuItems.map((item) => (
          <div key={item.name} className="menu-group">
            {item.thumbnail && (
              <a href={`/${item.name}`}>
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="category-image"
                />
              </a>
            )}
            <ul className="project-links">
              {item.children.map((child) => (
                <li key={child.name}>
                  <a
                    href={`/${item.name}/${child.name}`}
                    className={child.name === project ? 'highlighted' : ''}
                  >
                    <img
                      src={child.path}
                      alt={child.name}
                      className="menu-thumbnail"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
} 