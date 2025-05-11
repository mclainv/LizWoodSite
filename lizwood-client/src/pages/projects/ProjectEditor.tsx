import React from 'react'

interface ProjectProps {
  category: string;
  project: string;
}

export default function ProjectEditor({ category, project }: ProjectProps) {
  return (
    <div className="ProjectEditor">ProjectEditor</div>
  );
}
