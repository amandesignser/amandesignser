import React from 'react';
import { useInView } from 'react-intersection-observer';

const ExpertiseCard = ({ icon, title, description, colorClass }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <div
            ref={ref}
            className={`reveal glass p-6 md:p-8 text-center neon-glow expertise-card ${inView ? 'show' : ''}`}
        >
            <div className="expertise-icon mb-6">
                <span className="gradient-text">
                    <i className="material-icons expertise-icon-symbol">{icon}</i>
                </span>
            </div>
            <h3 className={`text-lg md:text-xl font-bold mb-4 ${colorClass}`}>{title}</h3>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                {description}
            </p>
        </div>
    );
};

const Expertise = () => {
    return (
        <section id="skills" className="py-16">
            <div className="container">
                <h2 className="text-4xl font-extrabold gradient-text text-center mb-12">My Expertise</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <ExpertiseCard
                        icon="palette"
                        title="UI/UX Design"
                        description="Crafting intuitive, elegant interfaces with clear visual hierarchy and delightful micro-interactions that enhance user engagement and drive conversions."
                        colorClass="text-cyan-400"
                    />
                    <ExpertiseCard
                        icon="code"
                        title="Frontend Development"
                        description="Building robust, scalable web applications with clean HTML/CSS/JavaScript, component-based architecture, and modern accessibility standards."
                        colorClass="text-pink-400"
                    />
                    <ExpertiseCard
                        icon="speed"
                        title="Performance & SEO"
                        description="Optimizing for lightning-fast load times, semantic markup, comprehensive meta/OG implementation, and Lighthouse-perfect scores."
                        colorClass="text-green-400"
                    />
                </div>
            </div>
        </section>
    );
};

export default Expertise;
