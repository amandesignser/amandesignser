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
        <footer className="border-t border-cyan-500/20 bg-[#0a0a0f]/80 backdrop-blur-md py-8">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-400">
                    <div className="text-center md:text-left">© <span id="year">{currentYear}</span> AmanDesignser • Crafted with precision and passion</div>
                    <a href="#home" className="inline-flex items-center gap-2 px-4 py-2 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/60 transition-all duration-300" onClick={scrollToTop}>
                        <span>Back to Top</span>
                        <span>↑</span>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
