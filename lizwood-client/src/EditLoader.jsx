import React from 'react'
import { useParams } from 'react-router-dom'
import EditHome from './pages/EditHome'
import EditMusic from './pages/Music/Edit'
import EditAbout from './pages/About/Edit'
import NotFound from './pages/NotFound'

const map = { home: EditHome, music: EditMusic, about: EditAbout }

export default function EditLoader() {
  const { page } = useParams()
  const Component = map[page] || NotFound
  return <Component />
}