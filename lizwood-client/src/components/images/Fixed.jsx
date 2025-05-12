import cursorImage from '../../assets/cursor-small.png';

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
    if (src.toString().includes('CONTACT')) {
      onClick = () => {
        window.location.href = 'mailto:lizwood224@gmail.com';
      }
    }
    if (src.toString().includes('linkedin')) {
      onClick = () => {
        window.open('https://www.linkedin.com/in/llizwood/', '_blank');
      }
    }
    if (src.toString().includes('insta')) {
      onClick = () => {
        window.open('https://www.instagram.com/llizwood/', '_blank');
      }
    }
    if (src.toString().includes('liz-print')) {
      onClick = () => {
        window.location.href = '/about';
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
        cursor: onClick ? 'pointer' : `url(${cursorImage}), pointer`,
        userSelect: 'none',
        transform: `rotate(${initialPos.rotated}deg)`
    }}
  />
  );
}