import React from 'react';
import { useInView } from 'react-intersection-observer';

const About = () => {
    const { ref: textRef, inView: textInView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { ref: valuesRef, inView: valuesInView } = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <section id="about" className="py-20 relative">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
                    {/* About Text */}
                    <div
                        ref={textRef}
                        className={`bg-[#111117]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 shadow-[0_0_20px_rgba(0,255,255,0.1)] hover:shadow-[0_0_30px_rgba(0,255,255,0.2)] transition-all duration-700 transform ${textInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    >
                        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-6">About Me</h2>
                        <p className="text-gray-300 leading-relaxed text-lg">
                            I'm Aman Kumar, known professionally as AmanDesignser. I specialize in creating high-performance,
                            accessible, and pixel-perfect user interfaces. My technical expertise spans
                            <strong className="text-cyan-400 font-semibold"> HTML, CSS, JavaScript</strong> with modern development workflows.
                            My goal is to deliver fast, clean, and business-ready web experiences that drive results.
                        </p>
                    </div>

                    {/* Core Values */}
                    <div
                        ref={valuesRef}
                        className={`bg-[#111117]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 shadow-[0_0_20px_rgba(0,255,255,0.1)] hover:shadow-[0_0_30px_rgba(0,255,255,0.2)] transition-all duration-700 delay-200 transform ${valuesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    >
                        <h3 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-6">Core Values</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-300">
                            <div className="flex items-center gap-3 group">
                                <span className="text-2xl group-hover:scale-125 transition-transform duration-300">⚡</span>
                                <span className="font-medium group-hover:text-cyan-400 transition-colors">Performance-first approach</span>
                            </div>
                            <div className="flex items-center gap-3 group">
                                <span className="text-2xl group-hover:scale-125 transition-transform duration-300">📱</span>
                                <span className="font-medium group-hover:text-cyan-400 transition-colors">Fully responsive designs</span>
                            </div>
                            <div className="flex items-center gap-3 group">
                                <span className="text-2xl group-hover:scale-125 transition-transform duration-300">🧭</span>
                                <span className="font-medium group-hover:text-cyan-400 transition-colors">User-centered decisions</span>
                            </div>
                            <div className="flex items-center gap-3 group">
                                <span className="text-2xl group-hover:scale-125 transition-transform duration-300">🛠️</span>
                                <span className="font-medium group-hover:text-cyan-400 transition-colors">Clean, maintainable code</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
