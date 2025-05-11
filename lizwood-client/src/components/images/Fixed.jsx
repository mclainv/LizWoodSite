export default function FixedImage(
  { src, 
    alt, 
    ogWidth, 
    ogHeight, 
    onMenuOpen,
    initialPos = { x: 0, y: 0, z: 1, 
      rotated: 0, width: ogWidth, height: ogHeight } }
  ) {
    let onClick;
    if (src.toString().includes('EXPLORE')) {
      onClick = () => {
        onMenuOpen();
      }
    }
    if (src.toString().includes('LW-LOGO')) {
      onClick = () => {
        window.location.href = '/';
      }
    }
  return (
    <img
      src={src}
      alt={alt}
      width={initialPos.width}
      height={initialPos.height}
      draggable={false}
      onClick={onClick}
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