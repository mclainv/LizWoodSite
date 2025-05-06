import React from 'react'
import './Project.scss';
// Define props type
interface ProjectProps {
  category: string;
  project: string;
}

// Accept props object and destructure
export default function Project({ category, project }: ProjectProps) {
  return (
    <div className="Project">
      <nav className="Sidebar">
        <p className="category-header">Direction</p>
          <ul className="project-links">
            <li>
              <h3>Thesis</h3>
            </li>
            <li>
              <h3>Clam</h3>
            </li>
            <li>
              <h3>Sex</h3>
            </li>
          </ul>
        <p className="category-header">Music</p>
          <ul className="project-links">
            <li>
              <h3>Band1</h3>
            </li>
            <li>
              <h3>Band2</h3>
            </li>
            <li>
              <h3>Band3</h3>
            </li>
          </ul>
      </nav>
      <div className="ImageGallery">
        {project}
      </div>
    </div>
  );
}