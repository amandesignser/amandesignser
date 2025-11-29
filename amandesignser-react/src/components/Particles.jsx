import React, { useEffect, useRef } from 'react';

const Particles = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const createParticles = () => {
            const particles = containerRef.current;
            if (!particles) return;

            // Adaptive particle count based on device capabilities
            const isMobile = window.innerWidth < 768;
            const isLowPerformance = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
            const particleCount = isMobile ? 12 : (isLowPerformance ? 20 : 35);

            // Clear existing particles
            particles.innerHTML = '';

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';

                // Random positioning and timing
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 20 + 's';
                particle.style.animationDuration = (15 + Math.random() * 10) + 's';

                // Add slight random size variation
                const size = 2 + Math.random() * 1;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';

                particles.appendChild(particle);
            }
        };

        createParticles();

        // Optional: Re-create on resize (debounced)
        let timeout;
        const handleResize = () => {
            clearTimeout(timeout);
            timeout = setTimeout(createParticles, 500);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return <div className="particles" ref={containerRef} id="particles"></div>;
};

export default Particles;
