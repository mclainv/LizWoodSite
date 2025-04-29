// import { useRouter } from 'next/router';
// import styles from './index.module.scss'
// import { Rnd } from 'react-rnd';
import Draggable from 'react-draggable';
import Image from "next/image";
import { useRef, FC } from 'react';

interface DraggableImageProps {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    defaultPosition?: { x: number; y: number };
    onDrop?: (e: MouseEvent, data: { x: number; y: number }) => void;
}

export const DraggableImage: FC<DraggableImageProps> = ({ src, alt, width, height, className, defaultPosition, onDrop }) => {
    const nodeRef = useRef(null);
    // eslint-disable-next-line
    const Draggable1: any = Draggable;

    const handleStop = (e: MouseEvent, data: { x: number; y: number }) => {
        if (onDrop) {
            onDrop(e, data);
        }
    };

    return (
        <div>
            <div>
                <Draggable1 nodeRef={nodeRef} defaultPosition={defaultPosition} onStop={handleStop}>
                    <div ref={nodeRef}>
                        <Image 
                            src={src} 
                            alt={alt}
                            width={width}
                            height={height}
                            className={className}
                        />
                    </div>
                </Draggable1>
            </div>
        </div>
    );
}