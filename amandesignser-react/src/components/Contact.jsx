import React from 'react';
import { trackClick } from '../utils/tracking';

const Contact = () => {
    return (
        <section id="contact" className="py-20 mb-16 relative">
            <div className="container mx-auto px-6">
                <div className="bg-[#111117]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 text-center shadow-[0_0_20px_rgba(0,255,255,0.1)] hover:shadow-[0_0_40px_rgba(0,255,255,0.2)] transition-all duration-500 transform opacity-100 translate-y-0">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-gradient-shift mb-6">Let's Create Something Amazing</h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">Have a project in mind? Let's discuss how we can bring your vision to life with exceptional web solutions.</p>

                    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                        {/* Primary Contact Button */}
                        <a href="mailto:amanbarnd@gmail.com" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-bold text-white text-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all duration-300 relative overflow-hidden group">
                            <span className="relative z-10">Start Conversation</span>
                            <span className="relative z-10">📧</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </a>

                        {/* Social Media Links */}
                        <a
                            href="https://www.facebook.com/share/1EcXP6fpg7/"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackClick('Facebook')}
                            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-cyan-500 rounded-xl font-bold text-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)] hover:scale-105 transition-all duration-300"
                            aria-label="Connect on Facebook"
                        >
                            <span>Facebook</span>
                        </a>

                        <a
                            href="https://www.linkedin.com/in/aman-kumar-940bb0233?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackClick('LinkedIn')}
                            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-cyan-500 rounded-xl font-bold text-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)] hover:scale-105 transition-all duration-300"
                            aria-label="Connect on LinkedIn"
                        >
                            <span>LinkedIn</span>
                        </a>

                        <a
                            href="https://x.com/amandesignser"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackClick('Twitter')}
                            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-cyan-500 rounded-xl font-bold text-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)] hover:scale-105 transition-all duration-300"
                            aria-label="Follow on X (Twitter)"
                        >
                            <span>X (Twitter)</span>
                        </a>

                        <a
                            href="https://instagram.com/amandesignser"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackClick('Instagram')}
                            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-cyan-500 rounded-xl font-bold text-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)] hover:scale-105 transition-all duration-300"
                            aria-label="Follow on Instagram"
                        >
                            <span>Instagram</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
