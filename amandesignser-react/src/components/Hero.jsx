import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const Hero = () => {
    const { ref: leftRef, inView: leftInView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { ref: rightRef, inView: rightInView } = useInView({ triggerOnce: true, threshold: 0.1 });

    // Fallback for manual trigger on load if needed, but IntersectionObserver handles it well.
    // The original script used setTimeout to trigger these on load.
    // We can simulate that by using a small delay or just relying on IO.

    return (
        <section className="py-20" id="home">
            <div className="container">
                <div className="grid md:grid-cols-2 items-center gap-12">
                    {/* Hero Text Content */}
                    <div
                        ref={leftRef}
                        className={`reveal-left ${leftInView ? 'show' : ''}`}
                    >
                        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
                            Hello, I'm <span className="gradient-text">Aman Kumar</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            Professional Web Designer & Frontend Developer. I create <strong className="text-cyan-400">clean, modern</strong> and
                            <strong className="text-cyan-400">responsive</strong> websites that deliver exceptional performance and premium user experiences.
                        </p>
                        <div className="flex flex-wrap gap-4 mb-8">
                            <a href="#portfolio" className="btn-primary">
                                <span>View Portfolio</span>
                                <span>→</span>
                            </a>
                            <a href="mailto:amanbarnd@gmail.com" className="btn-secondary">
                                <span>Get In Touch</span>
                                <span>✉</span>
                            </a>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <span className="status-badge">✅ Available for Projects</span>
                            <span className="status-badge">📍 Based in Agra, India</span>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div
                        ref={rightRef}
                        className={`reveal-right flex justify-center ${rightInView ? 'show' : ''}`}
                    >
                        <div className="relative w-full max-w-sm">
                            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur-xl opacity-30 animate-pulse"></div>
                            <div className="relative rounded-2xl overflow-hidden glass neon-glow">
                                <img
                                    src="/aman.jpg"
                                    loading="eager"
                                    alt="Aman Kumar - Professional Web Designer & Developer"
                                    className="w-full aspect-square object-cover"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
