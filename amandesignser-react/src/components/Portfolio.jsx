import React, { useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { sendTrackingData, gtag } from '../utils/tracking';

const ProjectCard = ({ image, title, year, description }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <article
            ref={ref}
            className={`group relative rounded-2xl overflow-hidden bg-[#111117]/60 backdrop-blur-xl border border-white/10 shadow-[0_0_20px_rgba(0,255,255,0.1)] hover:shadow-[0_0_40px_rgba(0,255,255,0.3)] hover:-translate-y-2 transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={image}
                    loading="lazy"
                    alt={description}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-60"></div>
            </div>
            <div className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{title}</h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold backdrop-blur-md">{year}</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
            </div>
        </article>
    );
};

const VideoProjectCard = ({ videoSrc, title, year, description }) => {
    const { ref: cardRef, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    const togglePlay = (e) => {
        e.stopPropagation();
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play().then(() => {
                setIsPlaying(true);
                if (!hasStarted) {
                    setHasStarted(true);
                    trackVideoEvent('first_play');
                } else {
                    trackVideoEvent('resume');
                }
            }).catch(console.warn);
        } else {
            video.pause();
            setIsPlaying(false);
            trackVideoEvent('pause');
        }
    };

    const trackVideoEvent = (action, position = null) => {
        const video = videoRef.current;
        if (!video) return;

        const eventData = {
            event_category: 'Video Interaction',
            event_label: videoSrc,
            transport_type: 'beacon',
            video_current_time: Math.round(video.currentTime),
            video_duration: Math.round(video.duration),
            video_percent: Math.round((video.currentTime / video.duration) * 100)
        };

        if (position !== null) {
            eventData.video_position = position;
        }

        try {
            gtag('event', `video_${action}`, eventData);
            sendTrackingData('video_interaction', `Video ${action}`, eventData);
        } catch (error) {
            console.warn('Video tracking error:', error);
        }
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleEnded = () => {
            setIsPlaying(false);
            trackVideoEvent('complete');
        };

        video.addEventListener('ended', handleEnded);
        return () => video.removeEventListener('ended', handleEnded);
    }, []);

    return (
        <article
            ref={cardRef}
            className={`group relative rounded-2xl overflow-hidden bg-[#111117]/60 backdrop-blur-xl border border-white/10 shadow-[0_0_20px_rgba(0,255,255,0.1)] hover:shadow-[0_0_40px_rgba(0,255,255,0.3)] hover:-translate-y-2 transition-all duration-500 ${!isPlaying ? 'cursor-pointer' : ''} ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            onClick={togglePlay}
            id="videoCard"
        >
            <div className="relative aspect-[4/3] overflow-hidden">
                <video
                    ref={videoRef}
                    id="proj2"
                    src={videoSrc}
                    preload="metadata"
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                ></video>
                <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 flex items-center justify-center ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <button
                        id="videoPlayBtn"
                        className="bg-cyan-500/90 text-[#0a0a0f] rounded-full px-6 py-3 font-bold border-none cursor-pointer transition-all duration-300 backdrop-blur-md shadow-[0_8px_25px_rgba(0,255,255,0.3)] hover:bg-cyan-400 hover:scale-110 hover:shadow-[0_12px_35px_rgba(0,255,255,0.4)] active:scale-95 flex items-center gap-2"
                        aria-label={isPlaying ? 'Pause video' : 'Play project demonstration video'}
                        onClick={togglePlay}
                    >
                        {isPlaying ? '⏸ Pause' : '▶ Play Demo'}
                    </button>
                </div>
            </div>
            <div className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{title}</h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold backdrop-blur-md">{year}</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
            </div>
        </article>
    );
};

const Portfolio = () => {
    return (
        <section id="portfolio" className="py-20 relative">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-gradient-shift">Selected Projects</h2>
                    <a href="mailto:amanbarnd@gmail.com" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group">
                        Start Your Project <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <ProjectCard
                        image="/project1.jpg"
                        title="Modern Portfolio Website"
                        year="2025"
                        description="Responsive grid system, clean hero section, and smooth micro-interactions for enhanced user experience."
                    />

                    <VideoProjectCard
                        videoSrc="/project2.mp4"
                        title="E-commerce Platform UI"
                        year="2024"
                        description="High-conversion shopping experience with optimized checkout flow and seamless user journey. (Interactive video demo)"
                    />

                    <ProjectCard
                        image="/project3.jpg"
                        title="Business Landing Page"
                        year="2023"
                        description="Professional corporate design with strategic content sections and conversion-focused layout."
                    />
                </div>
            </div>
        </section>
    );
};

export default Portfolio;
