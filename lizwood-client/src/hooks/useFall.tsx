import { useEffect, useRef, useCallback } from 'react';

// interface UnpinnedObject {
//   element: HTMLElement;
//   age: number;
//   velocity: number;
//   x: number;
//   y: number;
// }

export const useFall = () => {
  const unpinnedArr = useRef([]);
  const animationInterval = useRef(null);
  // let imageHeight;
  const dropObj = useCallback((event: MouseEvent, pin: HTMLElement) => {
    // Find the parent div containing both the image and pin
    const parentDiv = pin.closest('div');
    if (!parentDiv) return;

    // Find the image element within the parent div
    const image = parentDiv.querySelector('img:not([alt="pin"])') as HTMLElement;
    if (!image) return;
    // imageHeight = parseInt(image.getAttribute('height') || '150', 10);

    // Prevent page scrolling
    document.body.style.overflow = 'hidden';

    // Store initial position
    unpinnedArr.current.push({
      element: parentDiv,
      age: 0,
      velocity: 0,
      x: parseFloat(parentDiv.style.left || '0'),
      y: parseFloat(parentDiv.style.top || '0')
    });
    
    if (unpinnedArr.current.length === 1) {
      animationInterval.current = window.setInterval(animate, 16);
    }
    // console.log("imageHeight ", imageHeight);
  }, []);

  const animate = () => {
    unpinnedArr.current.forEach((obj, index) => {
      obj.age += 1;

      if (obj.age > 5) {
        obj.velocity += 0.04 * (1 - Math.exp(-obj.age * 0.02));
        let currentTop = parseFloat(obj.element.style.top) || 0;
        currentTop += obj.velocity;
        obj.element.style.top = `${currentTop}px`;

        // Remove if off screen
        if (currentTop /* + imageHeight*/ > document.documentElement.clientHeight) {
          obj.element.style.display = "none";
          unpinnedArr.current.splice(index, 1);
          
          // Clear interval if no more objects
          if (unpinnedArr.current.length === 0 && animationInterval.current) {
            clearInterval(animationInterval.current);
            animationInterval.current = null;
            // Restore scrolling when animation is done
            document.body.style.overflow = '';
          }
        }
      }
    });
  };

  useEffect(() => {
    const pins = document.querySelectorAll<HTMLElement>('img[alt="pin"]');
    
    pins.forEach(pin => {
      pin.addEventListener('click', (event) => dropObj(event, pin));
    });

    // Cleanup
    return () => {
      pins.forEach(pin => {
        pin.removeEventListener('click', (event) => dropObj(event, pin));
      });
      if (animationInterval.current) {
        clearInterval(animationInterval.current);
      }
    };
  }, [dropObj]);

  return null;
};