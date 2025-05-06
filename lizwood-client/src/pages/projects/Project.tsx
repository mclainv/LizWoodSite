import React from 'react'

// Define props type
interface ProjectProps {
  category: string;
  project: string;
}

// Accept props object and destructure
export default function Project({ category, project }: ProjectProps) {
  return (
    <div>Project {category} {project}</div>
  );
}