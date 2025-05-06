import React from 'react'
import { useParams } from 'react-router-dom'
import Category from './pages/categories/Category.js'
import CategoryEditor from './pages/categories/CategoryEditor.js'
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

  return <Category modelType={page} />
}

export function EditorLoader() {
  const { page } = useParams()

  if (!page || !pages.includes(page)) {
    console.warn('EditLoader: Invalid or missing page parameter in URL.');
    return <NotFound />;
  }
  
  return <CategoryEditor modelType={page} />
}