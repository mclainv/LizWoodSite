import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Home from './Home';
import EditHome from './pages/EditHome';
import PageLoader from './PageLoader';
import EditLoader from './EditLoader';
// import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <Routes>
      {/* root */}
      <Route path="/" element={<Home />} />
      {/* any “/foo” */}
      <Route path="/edit" element={<EditHome />} />
      <Route path=":page" element={<PageLoader />} />
      {/* any “/foo/edit” */}
      <Route path=":page/edit" element={<EditLoader />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();