// src/PageLoader.jsx
import React from 'react'
import { useParams } from 'react-router-dom'
import Home from './Home'
import Music from './pages/Music'
import About from './pages/About'
import NotFound from './pages/NotFound'

const map = {home: Home, music: Music, about: About }

export default function PageLoader() {
  const { page } = useParams()
  const Component = map[page] || NotFound
  return <Component />
}