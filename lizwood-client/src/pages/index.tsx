import type { NextPage } from 'next';
import styles from '../utils/styles/home.module.scss';
import React from 'react';
import { DraggableImage } from '@/components/draggable/DraggableImage';
const images = [
  '/assets/Screenshot 2025-04-06 at 8.51.08 PM.png',
  '/assets/Screenshot 2025-04-06 at 8.05.42 PM.png',
  '/assets/pretty on ti.jpg',
  '/assets/pages.PNG',
  '/assets/LW LOGO.PNG',
  '/assets/Liz Gif.gif',
  '/assets/IMG_4584.JPG',
  '/assets/IMG_3073.jpg',
  '/assets/IMG_0071.jpg',
  '/assets/doily shirt.png',
  '/assets/contact.PNG',
  '/assets/candy hearts shirt.png',
  '/assets/slots.png',
  '/assets/Screenshot 2025-04-06 at 8.58.14 PM.png',
  '/assets/Screenshot 2025-04-06 at 8.56.52 PM.png',
  '/assets/Screenshot 2025-04-06 at 8.56.34 PM.png',
  '/assets/Screenshot 2025-04-06 at 8.55.58 PM.png',
  '/assets/Screenshot 2025-04-06 at 8.52.07 PM.png',
  '/assets/Screenshot 2025-04-06 at 8.51.46 PM.png'
];

const Home: NextPage = () => {
  // const handleLogin = () => {
  //   window.location.href = 'http://localhost:3001/api/auth/discord';
  // }
  return (
    <div className="page page-aligned-center">
      <DraggableImage 
        src="https://placecats.com/millie_neo/300/200.png" 
        alt="A cute cat"
        width={300}
        height={200}
        className="custom-class"
        defaultPosition={{ x: 19.666633122090566, y: 6.021201371602027 }}
        onDrop={(e, data) => {
          console.log('Dropped at:', data.x, data.y);
        }}
      />
    </div>
  );
}

export default Home;