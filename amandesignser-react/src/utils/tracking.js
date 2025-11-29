/**
 * Professional Portfolio Tracking System
 * Ported to React
 */

const TRACKING_CONFIG = {
    WEB_APP_URL: "https://script.google.com/macros/s/AKfycby60lD7E-wO75H47SORUGQDm_MNbVG9O6hNGmzgPBQou5uQhHB3uyT7y8oDUg8HwJmn/exec",
    DEBUG: false
};

// Google Analytics
export const gtag = (...args) => {
    if (window.dataLayer) {
        window.dataLayer.push(args);
    }
};

// Simple visitor ID management
export const getVisitorId = () => {
    let visitorId = localStorage.getItem('portfolio_visitor_id');
    if (!visitorId) {
        visitorId = 'v_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
        localStorage.setItem('portfolio_visitor_id', visitorId);
    }
    return visitorId;
};

// Session ID management
export const getSessionId = () => {
    let sessionId = sessionStorage.getItem('portfolio_session_id');
    if (!sessionId) {
        sessionId = 's_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
        sessionStorage.setItem('portfolio_session_id', sessionId);
    }
    return sessionId;
};

// Main tracking function
export const sendTrackingData = async (eventType, eventDetails = '', additionalData = {}) => {
    try {
        const payload = {
            timestamp: new Date().toISOString(),
            visitorId: getVisitorId(),
            sessionId: getSessionId(),
            eventType: eventType,
            eventDetails: eventDetails,
            pageUrl: window.location.href,
            pageTitle: document.title,
            referrer: document.referrer || '',
            userAgent: navigator.userAgent,
            language: navigator.language || 'unknown',
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            source: 'portfolio_website_react',
            ...additionalData
        };

        // Use fetch with no-cors mode for Google Sheets
        await fetch(TRACKING_CONFIG.WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (TRACKING_CONFIG.DEBUG) {
            console.log('Tracking data sent:', eventType, eventDetails);
        }
    } catch (error) {
        if (TRACKING_CONFIG.DEBUG) {
            console.warn('Tracking failed:', error);
        }
    }
};

// Social Media Click Tracking
export const trackClick = (platform) => {
    try {
        gtag('event', 'social_click', {
            event_category: 'Social Media',
            event_label: platform,
            transport_type: 'beacon'
        });

        sendTrackingData('social_click', `${platform} clicked`);
        console.log(`Social media click tracked: ${platform}`);
    } catch (error) {
        console.warn('Social tracking error:', error);
    }
};
