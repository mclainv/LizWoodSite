import React, {useState, useEffect} from 'react'
import './Project.scss';
import Sidebar from '../../components/Sidebar';

// Define props type
interface ProjectProps {
  category: string;
  project: string;
}

// Accept props object and destructure
export default function Project({ category, project }: ProjectProps) {
  const [imageGallery, setImageGallery] = useState([]);
  // const [projectText, setProjectText] = useState({});
  useEffect(() => {
    // fetch saved positions dynamically
    const fetchData = async () => {
      try {
        const resp = await fetch('/.netlify/functions/getProjectData', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: category, project: project }),
        });
        if (!resp.ok) throw new Error(resp.statusText);
        const data = await resp.json();
        const projectData = data.data;
        setImageGallery(projectData.pictures);
        // setProjectText(projectData.text);
      } catch (err) {
        console.error('Error loading positions:', err);
      }
    };
    fetchData();
  }, [category, project]);
  
  return (
    <div className="Project">
      <Sidebar category={category} project={project} />
      <div className="ImageGallery">
        {imageGallery.map((image, index) => (
          <img 
            key={index} 
            src={image.src} 
            alt={image.alt} 
            style={{ width: '100%', height: 'auto', display: 'block' }} 
          />
        ))}
      </div>
    </div>
  );
}