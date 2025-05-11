import React, {useState, useEffect} from 'react'
import './Project.scss';
import Sidebar from '../../components/Sidebar';

// Define props type
interface ProjectProps {
  category: string;
  project: string;
}

interface ImageData {
  src: string;
  alt: string;
}

// Accept props object and destructure
export default function Project({ category, project }: ProjectProps) {
  const [imageGallery, setImageGallery] = useState<ImageData[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

  /* This uses netlify functions to pull project data from mongoose */
    // const [imageGallery, setImageGallery] = useState([]);
  // // const [projectText, setProjectText] = useState({});
  // useEffect(() => {
  //   // fetch saved positions dynamically
  //   const fetchData = async () => {
  //     try {
  //       const resp = await fetch('/.netlify/functions/getProjectData', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ category: category, project: project }),
  //       });
  //       if (!resp.ok) throw new Error(resp.statusText);
  //       const data = await resp.json();
  //       const projectData = data.data;
  //       setImageGallery(projectData.pictures);
  //       // setProjectText(projectData.text);
  //     } catch (err) {
  //       console.error('Error loading positions:', err);
  //     }
  //   };
  //   fetchData();
  // }, [category, project]);
  
  /* This uses netlify to poll file structure */
  useEffect(() => {
    const fetchProjectImages = async () => {
      try {
        const response = await fetch(`/.netlify/functions/getProjectImages?category=${category}&project=${project}`);
        if (!response.ok) throw new Error('Failed to fetch project images');
        const data = await response.json();
        setImageGallery(data.images);
      } catch (error) {
        console.error('Error loading project images:', error);
      }
    };

    fetchProjectImages();
  }, [category, project]);
  
  const handleImageClick = (image: ImageData) => {
    setSelectedImage(image);
  };

  const handleCloseFullscreen = () => {
    setSelectedImage(null);
  };

  return (
    <div className="Project">
      <Sidebar category={category} project={project} />
      <div className="ImageGallery">
        {imageGallery.map((image, index) => (
          <img 
            key={index} 
            src={image.src} 
            alt={image.alt} 
            style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }} 
            onClick={() => handleImageClick(image)}
          />
        ))}
      </div>
      {selectedImage && (
        <div className="fullscreen-overlay" onClick={handleCloseFullscreen}>
          <div className="fullscreen-content">
            <img 
              src={selectedImage.src} 
              alt={selectedImage.alt}
              style={{ maxWidth: '100%', maxHeight: '100vh' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}