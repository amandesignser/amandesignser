import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const scrollToTop = (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <footer className="border-t border-cyan-500/20 glass py-6">
            <div className="container">
                <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-300">
                    <div>© <span id="year">{currentYear}</span> AmanDesignser • Crafted with precision and passion</div>
                    <a href="#home" className="btn-secondary py-2 px-4 text-sm" onClick={scrollToTop}>
                        <span>Back to Top</span>
                        <span>↑</span>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
