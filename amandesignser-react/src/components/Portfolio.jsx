import React, { useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { sendTrackingData, gtag } from '../utils/tracking';

const ProjectCard = ({ image, title, year, description }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <article
            ref={ref}
            className={`reveal project-card ${inView ? 'show' : ''}`}
        >
            <div className="relative aspect-43 overflow-hidden">
                <img
                    src={image}
                    loading="lazy"
                    alt={description}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                />
            </div>
            <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <span className="year-badge">{year}</span>
                </div>
                <p className="text-gray-300 text-sm">{description}</p>
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
            className={`reveal project-card video-card ${!isPlaying ? 'paused' : ''} ${inView ? 'show' : ''}`}
            onClick={togglePlay}
            id="videoCard"
        >
            <div className="relative aspect-43 overflow-hidden">
                <video
                    ref={videoRef}
                    id="proj2"
                    src={videoSrc}
                    preload="metadata"
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                ></video>
                <button
                    id="videoPlayBtn"
                    className="video-playbtn"
                    aria-label={isPlaying ? 'Pause video' : 'Play project demonstration video'}
                    onClick={togglePlay}
                >
                    {isPlaying ? '⏸ Pause' : '▶ Play Demo'}
                </button>
            </div>
            <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <span className="year-badge">{year}</span>
                </div>
                <p className="text-gray-300 text-sm">{description}</p>
            </div>
        </article>
    );
};

const Portfolio = () => {
    return (
        <section id="portfolio" className="py-16">
            <div className="container">
                <div className="flex items-end justify-between mb-12">
                    <h2 className="text-4xl font-extrabold gradient-text">Selected Projects</h2>
                    <a href="mailto:amanbarnd@gmail.com" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition">
                        Start Your Project →
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
