import React from 'react'
import { useParams } from 'react-router-dom'
import Project from './pages/projects/Project.ts'
import ProjectEditor from './pages/projects/ProjectEditor.tsx'
import NotFound from './pages/notfound/NotFound.jsx'

const pages = [
  "music",
  "concepts",
  "direction",
  "fineart"
];

export function PageLoader() {
  const { page } = useParams()

  if (!page || !pages.includes(page)) {
    console.warn('PageLoader: Invalid or missing page parameter in URL.');
    return <NotFound/>;
  }

  return <Project modelType={page} />
}

export function EditorLoader() {
  const { page } = useParams()

  if (!page || !pages.includes(page)) {
    console.warn('EditLoader: Invalid or missing page parameter in URL.');
    return <NotFound />;
  }
  
  return <ProjectEditor modelType={page} />
}