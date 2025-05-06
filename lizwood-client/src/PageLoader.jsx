// src/PageLoader.jsx
import React from 'react'
import { useParams } from 'react-router-dom'
import Category from './pages/categories/Category.js' // Import the generic Category component
import Home from './Home.js'
// import NotFound from './pages/notfound/NotFound.jsx'

// No longer need the map or specific page imports
// import Home from './Home'
// import Direction from './pages/direction/Direction.tsx'
// const map = {home: Home, direction: Direction}

export default function PageLoader() {
  const { page } = useParams()

  // Basic check if page parameter exists, otherwise render NotFound
  if (!page) {
    // Or handle based on specific logic, maybe redirect or default
    console.warn('PageLoader: No page parameter found in URL.');
    return <Home/>;
  }
  
  // Render the Category component, passing the page name as modelType
  return <Category modelType={page} />
}