export default function FixedImage(
  { src, 
    alt, 
    ogWidth, 
    ogHeight, 
    initialPos = { x: 0, y: 0, z: 1, 
      rotated: 0, width: ogWidth, height: ogHeight } }
  ) {
  return (
    <img
      src={src}
      alt={alt}
      width={initialPos.width}
      height={initialPos.height}
      draggable={false}
      style={{
        position: 'absolute',
        left: initialPos.x,
        top: initialPos.y,
        zIndex: initialPos.z,
        cursor: 'default',
        userSelect: 'none',
        transform: `rotate(${initialPos.rotated}deg)`
    }}
  />
  );
}
