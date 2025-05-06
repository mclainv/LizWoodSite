import React from 'react'
import { useParams } from 'react-router-dom'
// Import the generic EditCategory component (adjust path/name as needed)
import EditCategory from './pages/categories/EditCategory.js' 
import NotFound from './pages/notfound/NotFound.jsx'

// No longer need the map or specific edit page imports
// import EditHome from './pages/EditHome'
// const map = { home: EditHome}

export default function EditLoader() {
  const { page } = useParams()

  // Basic check if page parameter exists, otherwise render NotFound
  if (!page) {
    console.warn('EditLoader: No page parameter found in URL.');
    return <NotFound />;
  }

  // Render the EditCategory component, passing the page name as modelType
  // Ensure EditCategory accepts and uses the modelType prop
  return <EditCategory modelType={page} />
}