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
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.Menu')) {
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
                    <li>
                        <Link to="/" onClick={() => setIsOpen(false)}>
                            <img src="/images/home-icon.png" alt="Home" className="menu-icon" />
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" onClick={() => setIsOpen(false)}>
                            <img src="/images/about-icon.png" alt="About" className="menu-icon" />
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact" onClick={() => setIsOpen(false)}>
                            <img src="/images/contact-icon.png" alt="Contact" className="menu-icon" />
                        </Link>
                    </li>
                </ul>
            </nav>
        </>
    );
});

export default Menu;