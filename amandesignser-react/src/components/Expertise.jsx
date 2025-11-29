import React from 'react';
import { useInView } from 'react-intersection-observer';

const ExpertiseCard = ({ icon, title, description, colorClass }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <div
            ref={ref}
            className={`bg-[#111117]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center shadow-[0_0_20px_rgba(0,255,255,0.1)] hover:shadow-[0_0_40px_rgba(0,255,255,0.3)] hover:-translate-y-2 transition-all duration-500 group ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-cyan-500/10 border-2 border-cyan-500/30 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/60 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 text-4xl">
                    <i className="material-icons flex items-center justify-center w-full h-full">{icon}</i>
                </span>
            </div>
            <h3 className={`text-xl md:text-2xl font-bold mb-4 ${colorClass}`}>{title}</h3>
            <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                {description}
            </p>
        </div>
    );
};

const Expertise = () => {
    return (
        <section id="skills" className="py-20 relative">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-center mb-16 animate-gradient-shift">My Expertise</h2>
                <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
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
