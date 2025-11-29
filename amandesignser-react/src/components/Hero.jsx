import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const Hero = () => {
    const { ref: leftRef, inView: leftInView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { ref: rightRef, inView: rightInView } = useInView({ triggerOnce: true, threshold: 0.1 });

    // Fallback for manual trigger on load if needed, but IntersectionObserver handles it well.
    // The original script used setTimeout to trigger these on load.
    // We can simulate that by using a small delay or just relying on IO.

    return (
        <section className="py-20 min-h-screen flex items-center relative overflow-hidden" id="home">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-2 items-center gap-12 lg:gap-20">
                    {/* Hero Text Content */}
                    <div
                        ref={leftRef}
                        className={`transform transition-all duration-1000 ease-out ${leftInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                    >
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
                            Hello, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-gradient-shift">Aman Kumar</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-lg">
                            Professional Web Designer & Frontend Developer. I create <strong className="text-cyan-400 font-semibold">clean, modern</strong> and
                            <strong className="text-cyan-400 font-semibold"> responsive</strong> websites that deliver exceptional performance and premium user experiences.
                        </p>
                        <div className="flex flex-wrap gap-4 mb-10">
                            <a href="#portfolio" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-bold text-white text-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all duration-300 relative overflow-hidden group">
                                <span className="relative z-10">View Portfolio</span>
                                <span className="relative z-10 group-hover:translate-x-1 transition-transform">→</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </a>
                            <a href="mailto:amanbarnd@gmail.com" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-cyan-500 rounded-xl font-bold text-cyan-400 text-lg hover:bg-cyan-500/10 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)] hover:scale-105 transition-all duration-300">
                                <span>Get In Touch</span>
                                <span>✉</span>
                            </a>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-sm font-medium backdrop-blur-md hover:bg-green-500/20 transition-colors cursor-default">
                                ✅ Available for Projects
                            </span>
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-sm font-medium backdrop-blur-md hover:bg-purple-500/20 transition-colors cursor-default">
                                📍 Based in Agra, India
                            </span>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div
                        ref={rightRef}
                        className={`flex justify-center transform transition-all duration-1000 ease-out delay-200 ${rightInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
                    >
                        <div className="relative w-full max-w-md group">
                            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur-2xl opacity-30 group-hover:opacity-50 animate-pulse transition-opacity duration-500"></div>
                            <div className="relative rounded-3xl overflow-hidden bg-[#111117]/60 backdrop-blur-xl border border-white/10 shadow-[0_0_20px_rgba(0,255,255,0.2)] group-hover:shadow-[0_0_40px_rgba(0,255,255,0.4)] transition-all duration-500 transform group-hover:-translate-y-2">
                                <img
                                    src="/aman.jpg"
                                    loading="eager"
                                    alt="Aman Kumar - Professional Web Designer & Developer"
                                    className="w-full aspect-square object-cover transform transition-transform duration-700 group-hover:scale-110"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-60"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
