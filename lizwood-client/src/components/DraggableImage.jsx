import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import Draggable from 'react-draggable';

const DraggableImage = forwardRef(({ src, alt, width, height, rotate, className, defaultPosition }, ref) => {
    const nodeRef = useRef(null);
    const [position, setPosition] = useState(defaultPosition);

    const handleDrag = (e, data) => {
        setPosition({ x: data.x, y: data.y });
    };

    useImperativeHandle(ref, () => ({
        getPosition: () => position
    }));

    return (
        <Draggable nodeRef={nodeRef} defaultPosition={defaultPosition} onDrag={handleDrag}>
            <div ref={nodeRef}>
                <img 
                    src={src} 
                    alt={alt} 
                    width={width} 
                    height={height}
                    style={ {rotate: rotate } }
                    className={className} 
                />
            </div>
        </Draggable>
    );
});

export default DraggableImage;
