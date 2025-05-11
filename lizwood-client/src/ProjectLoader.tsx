import React from 'react'
import { useParams } from 'react-router-dom'
import Project from './pages/projects/Project'
import ProjectEditor from './pages/projects/ProjectEditor'
import NotFound from './pages/notfound/NotFound.jsx'

const projects: { category: string, project: string }[] = [
  {
    category: "production",
    project: "thesis"
  },
  {
    category: "production",
    project: "clam"
  },
  {
    category: "production",
    project: "sex"
  }
];

export function ProjectLoader() {
  const { category, project } = useParams()

  if (!category ||!project) {
    console.warn('PageLoader: Project or category missing.');
    return <NotFound/>;
  }
  // if (!projects.some(p => p.category === category && p.project === project)) {
  //   console.warn('PageLoader: Project or category not found.');
  //   return <NotFound/>;
  // }

  return <Project category={category} project={project} />
}

export function ProjectEditorLoader() {
  const { category, project } = useParams()

  if (!category ||!project || !projects.some(p => p.category === category && p.project === project)) {
    console.warn('PageLoader: Project or category not found or missing.');
    return <NotFound/>;
  }
  return <ProjectEditor category={category} project={project} />
}