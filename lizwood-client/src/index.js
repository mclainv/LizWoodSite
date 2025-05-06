import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import EditHome from './pages/home/EditHome';
import NotFound from './pages/notfound/NotFound';

import { PageLoader, EditorLoader } from './PageLoader';
import { ProjectLoader, ProjectEditorLoader } from './ProjectLoader';
// import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <Routes>
      {/* home page */}
      <Route path="/" element={<Home />} />
      {/* edit home page */}
      <Route path="/edit" element={<EditHome />} />
      {/* categories pages and editors*/}
      <Route path=":page" element={<PageLoader />} />
      <Route path=":page/edit" element={<EditorLoader />} />
      {/* projects pages*/}
      <Route path=":page/:project" element={<ProjectLoader />} />
      <Route path=":page/:project/edit" element={<ProjectEditorLoader />} />
      {/* catch all for invalid routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();