import React, { useState, useEffect } from 'react';
import { trackClick, sendTrackingData, gtag } from '../utils/tracking';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setScrolled(scrollTop > 100);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        const newState = !menuOpen;
        setMenuOpen(newState);

        if (newState) {
            gtag('event', 'menu_open', {
                event_category: 'Navigation',
                event_label: 'Mobile Menu Opened'
            });
            sendTrackingData('menu_interaction', 'Mobile menu opened');
        }
    };

    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (menuOpen) setMenuOpen(false);

            // Track
            gtag('event', 'navigation_click', {
                event_category: 'Navigation',
                event_label: targetId,
                transport_type: 'beacon'
            });
            sendTrackingData('navigation', `Scrolled to: ${targetId}`);
        }
    };

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <div className="flex items-center justify-between py-4">
                    <a href="#home" className="navbar-brand" onClick={(e) => handleNavClick(e, '#home')}>
                        AMANDESIGNSER
                    </a>

                    {/* Desktop Navigation Menu */}
                    <div className="navbar-nav desktop md:flex items-center gap-6 hidden" id="navMenu">
                        <a href="#about" className="nav-link" onClick={(e) => handleNavClick(e, '#about')}>About</a>
                        <a href="#skills" className="nav-link" onClick={(e) => handleNavClick(e, '#skills')}>Expertise</a>
                        <a href="#portfolio" className="nav-link" onClick={(e) => handleNavClick(e, '#portfolio')}>Portfolio</a>
                        <a href="#contact" className="nav-link" onClick={(e) => handleNavClick(e, '#contact')}>Contact</a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        id="menuBtn"
                        className="mobile-menu-btn md:hidden px-4 py-3 rounded-lg border border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10 font-semibold"
                        aria-label="Open navigation menu"
                        aria-expanded={menuOpen}
                        onClick={toggleMenu}
                    >
                        {menuOpen ? 'Close' : 'Menu'}
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                <div id="mobileMenu" className={`${menuOpen ? 'flex' : 'hidden'} flex-col gap-3 py-4 border-t border-cyan-500/20`}>
                    <a href="#about" className="nav-link" onClick={(e) => handleNavClick(e, '#about')}>About</a>
                    <a href="#skills" className="nav-link" onClick={(e) => handleNavClick(e, '#skills')}>Expertise</a>
                    <a href="#portfolio" className="nav-link" onClick={(e) => handleNavClick(e, '#portfolio')}>Portfolio</a>
                    <a href="#contact" className="nav-link" onClick={(e) => handleNavClick(e, '#contact')}>Contact</a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
