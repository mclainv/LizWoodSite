import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home.jsx';
import HomeEditor from './pages/home/HomeEditor.jsx';
import NotFound from './pages/notfound/NotFound.jsx';
import './index.css';

import { PageLoader, EditorLoader } from './PageLoader.tsx';
import { ProjectLoader, ProjectEditorLoader } from './ProjectLoader.tsx';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <Routes>
      {/* home page */}
      <Route path="/" element={<Home />} />
      {/* edit home page */}
      <Route path="/edit" element={<HomeEditor />} />
      {/* categories pages and editors*/}
      <Route path=":page" element={<PageLoader />} />
      <Route path=":page/edit" element={<EditorLoader />} />
      {/* projects pages*/}
      <Route path=":category/:project" element={<ProjectLoader />} />
      <Route path=":category/:project/edit" element={<ProjectEditorLoader />} />
      {/* catch all for invalid routes */}
      <Route path="*" element={<NotFound />} />
      <Route path="//" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// import reportWebVitals from './reportWebVitals';
// reportWebVitals();