import React from 'react'
import { useParams } from 'react-router-dom'
import Project from './pages/projects/Project.tsx'
import ProjectEditor from './pages/projects/ProjectEditor.tsx'
import NotFound from './pages/notfound/NotFound.jsx'

const projects: { project: string, category: string }[] = [
  {
    project: "thesis",
    category: "music"
  }
];

export function ProjectLoader() {
  const { category, project } = useParams()

  if (!category || !project || !projects.includes({ project: project, category: category })) {
    console.warn('PageLoader: Invalid or missing page parameter in URL.');
    return <NotFound/>;
  }

  return <Project category={category} project={project} />
}

export function ProjectEditorLoader() {
  const { category, project } = useParams()

  if (!category || !project || !projects.includes({ project: project, category: category })) {
    console.warn('PageLoader: Invalid or missing page parameter in URL.');
    return <NotFound/>;
  }
  return <ProjectEditor category={category} project={project} />
}