import React from 'react';
import { useInView } from 'react-intersection-observer';

const About = () => {
    const { ref: textRef, inView: textInView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { ref: valuesRef, inView: valuesInView } = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <section id="about" className="py-16">
            <div className="container">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* About Text */}
                    <div
                        ref={textRef}
                        className={`reveal glass p-8 neon-glow ${textInView ? 'show' : ''}`}
                    >
                        <h2 className="text-3xl font-extrabold gradient-text mb-4">About Me</h2>
                        <p className="text-gray-300 leading-relaxed">
                            I'm Aman Kumar, known professionally as AmanDesignser. I specialize in creating high-performance,
                            accessible, and pixel-perfect user interfaces. My technical expertise spans
                            <strong className="text-cyan-400"> HTML, CSS, JavaScript</strong> with modern development workflows.
                            My goal is to deliver fast, clean, and business-ready web experiences that drive results.
                        </p>
                    </div>

                    {/* Core Values */}
                    <div
                        ref={valuesRef}
                        className={`reveal glass p-8 neon-glow ${valuesInView ? 'show' : ''}`}
                    >
                        <h3 className="text-2xl font-bold gradient-text mb-4">Core Values</h3>
                        <div className="grid grid-cols-2 gap-4 text-gray-300">
                            <div className="items-center gap-3">
                                <span className="text-purple-400">⚡</span>
                                <span>Performance-first approach</span><br />
                                <span className="text-purple-400">📱</span>
                                <span>Fully responsive designs</span><br />
                                <span className="text-purple-400">🧭</span>
                                <span>User-centered decisions</span><br />
                                <span className="text-purple-400">🛠️</span>
                                <span>Clean, maintainable code</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
