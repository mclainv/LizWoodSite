import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';
import menuPaper from '../assets/menu_paper.png';

const Menu = forwardRef((props, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    useImperativeHandle(ref, () => ({
        open: () => setIsOpen(true)
    }));

    useEffect(() => {
        const handleClickOutside = (event: globalThis.MouseEvent) => {
            if (isOpen && !(event.target as Element).closest('.Menu')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <>
            <div className={`menu-overlay ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(false)} />
            <nav className={`Menu ${isOpen ? 'active' : ''}`} style={{ backgroundImage: `url(${menuPaper})` }}>
                <ul>
                    <div className="spacer" style={{ height: "0px" }}></div>
                    <li>
                        <Link to="/production" onClick={() => setIsOpen(false)}>
                            <img src="/menu/production.png" alt="Production" className="menu-icon" />
                        </Link>
                    </li>
                    <li>
                        <Link to="/concepts" onClick={() => setIsOpen(false)}>
                            <img src="/menu/concepts.png" alt="Concepts" className="menu-icon" />
                        </Link>
                    </li>
                    <li>
                        <Link to="/fineart" onClick={() => setIsOpen(false)}>
                            <img src="/menu/fineart.png" alt="Fineart" className="fineart-icon menu-icon" />
                        </Link>
                    </li>
                    <li>
                        <Link to="/music" onClick={() => setIsOpen(false)}>
                            <img src="/menu/music.png" alt="Music" className="menu-icon" />
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" onClick={() => setIsOpen(false)}>
                            <img src="/menu/about.png" alt="About" className="menu-icon-sm" />
                        </Link>
                    </li>
                    <li className="hidden-li">
                        <Link to="/contact" onClick={() => setIsOpen(false)}>
                            <img src="/menu/contact.png" alt="Contact" className="menu-icon-sm" />
                        </Link>
                    </li>
                    <div className="spacer" style={{ height: "20px" }}></div>
                </ul>
            </nav>
        </>
    );
});

export default Menu;