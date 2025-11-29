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
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-cyan-500/20 ${scrolled ? 'bg-[#0a0a0f]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,255,255,0.1)]' : 'bg-[#0a0a0f]/80 backdrop-blur-sm'}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between py-4">
                    <a href="#home" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-gradient-shift hover:scale-105 transition-transform duration-300" onClick={(e) => handleNavClick(e, '#home')}>
                        AMANDESIGNSER
                    </a>

                    {/* Desktop Navigation Menu */}
                    <div className="hidden md:flex items-center gap-8" id="navMenu">
                        {['About', 'Expertise', 'Portfolio', 'Contact'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase() === 'expertise' ? 'skills' : item.toLowerCase()}`}
                                className="text-gray-400 hover:text-cyan-400 font-medium px-3 py-2 transition-all duration-300 relative group overflow-hidden"
                                onClick={(e) => handleNavClick(e, `#${item.toLowerCase() === 'expertise' ? 'skills' : item.toLowerCase()}`)}
                            >
                                <span className="relative z-10">{item}</span>
                                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-pink-500 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                                <span className="absolute top-0 left-0 w-full h-full bg-cyan-400/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 -z-0 rounded-md"></span>
                            </a>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        id="menuBtn"
                        className="md:hidden px-4 py-2 rounded-lg border border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10 font-semibold transition-colors"
                        aria-label="Open navigation menu"
                        aria-expanded={menuOpen}
                        onClick={toggleMenu}
                    >
                        {menuOpen ? 'Close' : 'Menu'}
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                <div id="mobileMenu" className={`${menuOpen ? 'flex' : 'hidden'} flex-col gap-4 py-6 border-t border-cyan-500/20 animate-fade-in`}>
                    {['About', 'Expertise', 'Portfolio', 'Contact'].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase() === 'expertise' ? 'skills' : item.toLowerCase()}`}
                            className="text-gray-300 hover:text-cyan-400 font-medium text-lg px-4 py-2 rounded-lg hover:bg-white/5 transition-all"
                            onClick={(e) => handleNavClick(e, `#${item.toLowerCase() === 'expertise' ? 'skills' : item.toLowerCase()}`)}
                        >
                            {item}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
