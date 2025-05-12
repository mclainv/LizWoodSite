import React, {useState} from 'react'
import ReactPlayer from 'react-player'
import './Project.scss';
import Sidebar from '../../components/Sidebar';
import { projectImages } from '../../data/projectImages';
import pointerImage from '../../assets/pointer-small.png';

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

  /* This uses netlify to poll project images */
    // useEffect(() => {
  //   const fetchProjectImages = async () => {
  //     try {
  //       const response = await fetch(`/.netlify/functions/getProjectImages?category=${category}&project=${project}`);
  //       if (!response.ok) throw new Error('Failed to fetch project images');
  //       const data = await response.json();
  //       setImageGallery(data.images);
  //     } catch (error) {
  //       console.error('Error loading project images:', error);
  //     }
  //   };

  //   fetchProjectImages();
  // }, [category, project]);

  // Get images from the generated data
  const imageGallery = projectImages[category]?.[project] || [];
  
  // Ensure description image is second
  const sortedGallery = [...imageGallery];
  const descIndex = sortedGallery.findIndex(img => 
    img.src.toLowerCase().includes('description')
  );
  
  // If we found a description image and it's not already at index 1 (second position)
  if (descIndex > -1 && descIndex !== 1) {
    // Remove the description image
    const descImage = sortedGallery.splice(descIndex, 1)[0];
    // Insert it at index 1 (second position)
    sortedGallery.splice(1, 0, descImage);
  }

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
        {sortedGallery.map((image, index) => (
          //here
          !image.src.includes('mp4') && !image.src.includes('MP4') ? (
            <img 
              key={index} 
              src={image.src} 
              alt={image.alt} 
              width="100%"
              height="auto"
              style={{ width: '100%', height: 'auto', display: 'block', cursor: `url(${pointerImage}) 10 0, pointer` }} 
              onClick={() => handleImageClick(image)}
            />
          ) : image.src.includes('mp4') ? (
            <div className="video-container">
              <ReactPlayer 
                key={index} 
                url={image.src}
                controls
                playing={true}
                onReady={() => console.log('ready')}
                muted={true}
                width="100%"
                height="auto"
                style={{ width: '100%', height: 'auto', display: 'block', cursor: `url(${pointerImage}) 10 0, pointer` }}
              />
            </div>
          ) : null
        ))}
      </div>
      {selectedImage && (
        <div className="fullscreen-overlay" style={{ cursor: `url(${pointerImage}) 10 0, pointer` }} onClick={handleCloseFullscreen}>
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