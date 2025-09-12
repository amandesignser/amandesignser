/**
 * Portfolio Website JavaScript
 * @author Aman Kumar (amandesignser)
 */

// Google Analytics Configuration (KEPT AS REQUESTED)
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-CN24ESW1EW', {
  page_title: document.title,
  page_location: window.location.href,
  send_page_view: true
});

// NEW ENHANCED TRACKING SYSTEM CONFIGURATION
const TRACKING_CONFIG = {

  GOOGLE_SHEET_URL: "https://script.google.com/macros/s/AKfycbyeAuExJQyLS7KtjSl1zOgWD9rxG_UYCXdcqYT2C6aZQbW9l-_nrSkskoBKJnezWzE3/exec",
  
  // Debug mode - set to false for production
  DEBUG: true,
  
  // Data collection settings
  COLLECT_IP_LOCATION: true,
  COLLECT_DEVICE_INFO: true,
  COLLECT_USER_BEHAVIOR: true,
  
  // Privacy settings
  RESPECT_DNT: true, // Do Not Track
  COOKIE_CONSENT_REQUIRED: true
};

// Privacy & Cookie Management
let userConsent = {
  analytics: false,
  tracking: false,
  location: false,
  customized: false
};

// Check existing consent
function checkExistingConsent() {
  const savedConsent = localStorage.getItem('portfolio_consent');
  if (savedConsent) {
    userConsent = JSON.parse(savedConsent);
    return true;
  }
  return false;
}

// Show cookie banner if consent not given
function showCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  if (banner && !checkExistingConsent()) {
    setTimeout(() => {
      banner.classList.add('show');
    }, 2000); // Show after 2 seconds
  }
}

// Cookie consent functions
function acceptCookies() {
  userConsent = {
    analytics: true,
    tracking: true,
    location: true,
    customized: false
  };
  saveConsent();
  hideCookieBanner();
  initializeTracking();
  sendTrackingData('privacy', 'Cookies accepted');
}

function rejectCookies() {
  userConsent = {
    analytics: false,
    tracking: false,
    location: false,
    customized: false
  };
  saveConsent();
  hideCookieBanner();
  sendTrackingData('privacy', 'Cookies rejected');
}

function customizeCookies() {
  userConsent.customized = true;
  // For now, enable only essential tracking
  userConsent.analytics = true;
  userConsent.tracking = false;
  userConsent.location = false;
  saveConsent();
  hideCookieBanner();
  sendTrackingData('privacy', 'Cookies customized');
}

function saveConsent() {
  localStorage.setItem('portfolio_consent', JSON.stringify(userConsent));
  localStorage.setItem('portfolio_consent_date', new Date().toISOString());
}

function hideCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  if (banner) {
    banner.classList.remove('show');
    setTimeout(() => {
      banner.style.display = 'none';
    }, 300);
  }
}

// Enhanced Visitor & Session Management
function generateId(prefix) {
  return prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

function getVisitorId() {
  let visitorId = localStorage.getItem('portfolio_visitor_id');
  if (!visitorId) {
    visitorId = generateId('visitor');
    localStorage.setItem('portfolio_visitor_id', visitorId);
    localStorage.setItem('portfolio_first_visit', new Date().toISOString());
  }
  return visitorId;
}

function getSessionId() {
  let sessionId = sessionStorage.getItem('portfolio_session_id');
  if (!sessionId) {
    sessionId = generateId('session');
    sessionStorage.setItem('portfolio_session_id', sessionId);
    sessionStorage.setItem('portfolio_session_start', new Date().toISOString());
  }
  return sessionId;
}

// Enhanced Device & Browser Detection
function getEnhancedDeviceInfo() {
  const ua = navigator.userAgent;
  const deviceInfo = {
    // Browser detection
    browser: 'Unknown',
    browserVersion: '',
    
    // OS detection
    os: 'Unknown',
    osVersion: '',
    
    // Device detection
    deviceType: 'Desktop',
    isMobile: /Mobi|Android|iPhone|iPad/.test(ua),
    isTablet: /iPad|Tablet/.test(ua),
    
    // Screen information
    screenWidth: screen.width,
    screenHeight: screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    colorDepth: screen.colorDepth,
    pixelRatio: window.devicePixelRatio || 1,
    
    // Capabilities
    touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    cookiesEnabled: navigator.cookieEnabled,
    javaEnabled: navigator.javaEnabled ? navigator.javaEnabled() : false,
    language: navigator.language || navigator.userLanguage,
    languages: navigator.languages ? navigator.languages.join(',') : '',
    platform: navigator.platform,
    
    // Network information (if available)
    connection: null,
    
    // Performance information
    hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
    maxTouchPoints: navigator.maxTouchPoints || 0
  };

  // Enhanced browser detection
  if (ua.includes('Firefox')) {
    deviceInfo.browser = 'Firefox';
    deviceInfo.browserVersion = ua.match(/Firefox\/([0-9\.]+)/)?.[1] || '';
  } else if (ua.includes('Chrome') && ua.includes('Safari')) {
    deviceInfo.browser = 'Chrome';
    deviceInfo.browserVersion = ua.match(/Chrome\/([0-9\.]+)/)?.[1] || '';
  } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
    deviceInfo.browser = 'Safari';
    deviceInfo.browserVersion = ua.match(/Version\/([0-9\.]+)/)?.[1] || '';
  } else if (ua.includes('Edge')) {
    deviceInfo.browser = 'Edge';
    deviceInfo.browserVersion = ua.match(/Edg\/([0-9\.]+)/)?.[1] || '';
  }

  // Enhanced OS detection
  if (ua.includes('Windows NT 10.0')) deviceInfo.os = 'Windows 10/11';
  else if (ua.includes('Windows NT')) deviceInfo.os = 'Windows';
  else if (ua.includes('Mac OS X')) {
    deviceInfo.os = 'macOS';
    deviceInfo.osVersion = ua.match(/Mac OS X ([0-9_]+)/)?.[1]?.replace(/_/g, '.') || '';
  } else if (ua.includes('Android')) {
    deviceInfo.os = 'Android';
    deviceInfo.osVersion = ua.match(/Android ([0-9\.]+)/)?.[1] || '';
  } else if (ua.includes('iPhone') || ua.includes('iPad')) {
    deviceInfo.os = 'iOS';
    deviceInfo.osVersion = ua.match(/OS ([0-9_]+)/)?.[1]?.replace(/_/g, '.') || '';
  } else if (ua.includes('Linux')) deviceInfo.os = 'Linux';

  // Device type refinement
  if (deviceInfo.isMobile && !deviceInfo.isTablet) deviceInfo.deviceType = 'Mobile';
  else if (deviceInfo.isTablet) deviceInfo.deviceType = 'Tablet';

  // Network information (if supported)
  if ('connection' in navigator) {
    const conn = navigator.connection;
    deviceInfo.connection = {
      effectiveType: conn.effectiveType || 'unknown',
      downlink: conn.downlink || 0,
      rtt: conn.rtt || 0,
      saveData: conn.saveData || false
    };
  }

  return deviceInfo;
}

// Enhanced IP-based Location Detection
async function getLocationData() {
  if (!userConsent.location) {
    return { city: 'Not Allowed', country: 'Privacy Protected' };
  }

  try {
    const response = await fetch('https://ipapi.co/json/', {
      signal: AbortSignal.timeout(8000)
    });

    if (response.ok) {
      const data = await response.json();
      return {
        ip: data.ip || '',
        city: data.city || 'Unknown',
        region: data.region || '',
        country: data.country_name || data.country || 'Unknown',
        countryCode: data.country_code || '',
        timezone: data.timezone || '',
        isp: data.org || '',
        latitude: data.latitude || '',
        longitude: data.longitude || '',
        postal: data.postal || '',
        source: 'ip_api'
      };
    }
  } catch (error) {
    if (TRACKING_CONFIG.DEBUG) {
      console.log('Location detection failed:', error.message);
    }
  }

  return { city: 'Unknown', country: 'Unknown', source: 'failed' };
}

// Enhanced GPS Location (with user permission)
function requestGPSLocation() {
  return new Promise((resolve) => {
    if (!userConsent.location || !navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp,
          source: 'gps'
        });
      },
      (error) => {
        if (TRACKING_CONFIG.DEBUG) {
          console.log('GPS location failed:', error.message);
        }
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
}

// Core Enhanced Tracking Function
async function sendTrackingData(eventType, eventDetails = '', additionalData = {}) {
  // Check user consent
  if (!userConsent.tracking && eventType !== 'privacy') {
    return;
  }

  // Respect Do Not Track
  if (TRACKING_CONFIG.RESPECT_DNT && navigator.doNotTrack === '1') {
    return;
  }

  try {
    // Get device info
    const deviceInfo = getEnhancedDeviceInfo();
    
    // Get location data
    const locationData = await getLocationData();
    
    // Prepare comprehensive payload
    const payload = {
      // Basic tracking info
      timestamp: new Date().toISOString(),
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      eventType: eventType,
      eventDetails: eventDetails,
      
      // Page info
      pageUrl: window.location.href,
      pageTitle: document.title,
      referrer: document.referrer || 'direct',
      
      // Device & browser info
      browser: deviceInfo.browser,
      browserVersion: deviceInfo.browserVersion,
      os: deviceInfo.os,
      osVersion: deviceInfo.osVersion,
      deviceType: deviceInfo.deviceType,
      screenResolution: `${deviceInfo.screenWidth}x${deviceInfo.screenHeight}`,
      viewportSize: `${deviceInfo.viewportWidth}x${deviceInfo.viewportHeight}`,
      
      // Location info
      city: locationData.city,
      country: locationData.country,
      timezone: locationData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      
      // Technical info
      language: deviceInfo.language,
      userAgent: navigator.userAgent,
      
      // Network info
      connectionType: deviceInfo.connection?.effectiveType || 'unknown',
      
      // Privacy info
      cookiesEnabled: deviceInfo.cookiesEnabled,
      javaEnabled: deviceInfo.javaEnabled,
      
      // Source identifier
      source: 'portfolio_enhanced',
      version: '2.0',
      
      // Additional data
      ...additionalData
    };

    
    // Send to Google Sheets
    const response = await fetch(TRACKING_CONFIG.GOOGLE_SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log("Data sent to Google Sheets:", eventType, eventDetails);
    
    // Also send to Google Analytics
    gtag('event', 'custom_tracking', {
      event_category: eventType,
      event_label: eventDetails,
      transport_type: 'beacon'
    });

  } catch (error) {
    console.error("Tracking failed:", error);
  }
}

// Enhanced Click Tracking with Data Attributes
function initializeClickTracking() {
  document.addEventListener('click', (e) => {
    const element = e.target.closest('[data-track]');
    if (element) {
      const trackingId = element.getAttribute('data-track');
      const elementType = element.tagName.toLowerCase();
      const elementText = element.textContent?.trim().substring(0, 100) || '';
      
      sendTrackingData('click_event', trackingId, {
        elementType: elementType,
        elementText: elementText,
        href: element.href || '',
        position: {
          x: e.clientX,
          y: e.clientY
        }
      });

      // Also send to Google Analytics
      gtag('event', 'click', {
        event_category: 'User Interaction',
        event_label: trackingId,
        transport_type: 'beacon'
      });

      if (TRACKING_CONFIG.DEBUG) {
        console.log('🖱️ Click tracked:', trackingId);
      }
    }
  });
}

// Set current year dynamically
if (document.getElementById('year')) {
  document.getElementById('year').textContent = new Date().getFullYear();
}

// Performance-optimized particle system
function createParticles() {
  const particles = document.getElementById('particles');
  if (!particles) return;

  // Adaptive particle count based on device capabilities
  const isMobile = window.innerWidth < 768;
  const isLowPerformance = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
  const particleCount = isMobile ? 8 : (isLowPerformance ? 15 : 25);

  // Clear existing particles
  particles.innerHTML = '';

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random positioning and timing
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (15 + Math.random() * 10) + 's';

    // Add slight random size variation
    const size = 2 + Math.random() * 1;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';

    particles.appendChild(particle);
  }

  if (TRACKING_CONFIG.DEBUG) {
    console.log(`✨ Created ${particleCount} particles`);
  }
}

// Enhanced Mobile Menu with Tracking
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;

    if (menuOpen) {
      mobileMenu.classList.remove('hidden');
      mobileMenu.classList.add('flex');
      menuBtn.textContent = 'Close';
      menuBtn.setAttribute('aria-expanded', 'true');

      // Track menu interaction
      sendTrackingData('menu_interaction', 'Mobile menu opened');
      gtag('event', 'menu_open', {
        event_category: 'Navigation',
        event_label: 'Mobile Menu Opened'
      });
    } else {
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('flex');
      menuBtn.textContent = 'Menu';
      menuBtn.setAttribute('aria-expanded', 'false');

      sendTrackingData('menu_interaction', 'Mobile menu closed');
    }
  });

  // Close menu when clicking nav links
  const mobileNavLinks = mobileMenu.querySelectorAll('.nav-link');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (menuOpen) {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        menuBtn.textContent = 'Menu';
        menuBtn.setAttribute('aria-expanded', 'false');
        menuOpen = false;
      }
    });
  });
}

// Professional Intersection Observer for Reveal Animations
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');

      // Track section visibility
      const sectionId = entry.target.closest('section')?.getAttribute('data-section') || 'unknown';
      
      sendTrackingData('section_view', `Section viewed: ${sectionId}`, {
        sectionId: sectionId,
        elementClass: entry.target.className,
        intersectionRatio: entry.intersectionRatio
      });

      gtag('event', 'section_view', {
        event_category: 'User Engagement',
        event_label: `Section: ${sectionId}`,
        transport_type: 'beacon'
      });

      // Unobserve for performance
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Enhanced Video Player with Professional Controls and Tracking
function initializeVideoPlayer() {
  const video = document.getElementById('proj2');
  const card = document.getElementById('videoCard');
  const btn = document.getElementById('videoPlayBtn');

  if (!video || !card || !btn) {
    if (TRACKING_CONFIG.DEBUG) {
      console.warn('Video player elements not found');
    }
    return;
  }

  let isPlaying = false;
  let hasStarted = false;
  let watchTime = 0;
  let lastTimeUpdate = 0;

  const updatePlayState = () => {
    isPlaying = !video.paused;
    card.classList.toggle('paused', video.paused);
    btn.textContent = video.paused ? '▶ Play Demo' : '⏸ Pause';
    btn.setAttribute('aria-label', video.paused ? 'Play project demonstration video' : 'Pause video');
  };

  const trackVideoEvent = (action, additionalData = {}) => {
    const eventData = {
      action: action,
      videoId: 'project2_demo',
      currentTime: Math.round(video.currentTime),
      duration: Math.round(video.duration),
      watchTime: watchTime,
      ...additionalData
    };

    if (video.duration > 0) {
      eventData.percentComplete = Math.round((video.currentTime / video.duration) * 100);
    }

    try {
      gtag('event', `video_${action}`, {
        event_category: 'Video Interaction',
        event_label: 'project2.mp4',
        value: eventData.currentTime,
        transport_type: 'beacon'
      });

      sendTrackingData('video_interaction', `Video ${action}`, eventData);

      if (TRACKING_CONFIG.DEBUG) {
        console.log(`Video ${action} tracked:`, eventData);
      }
    } catch (error) {
      if (TRACKING_CONFIG.DEBUG) {
        console.warn('Video tracking error:', error);
      }
    }
  };

  // Auto-play attempt
  const attemptAutoplay = async () => {
    try {
      await video.play();
      hasStarted = true;
      updatePlayState();
      trackVideoEvent('autoplay');
    } catch (error) {
      if (TRACKING_CONFIG.DEBUG) {
        console.log('Autoplay prevented by browser policy');
      }
      updatePlayState();
    }
  };

  // Event listeners
  card.addEventListener('click', (e) => {
    if (e.target === btn) return;

    if (video.paused) {
      video.play().then(() => {
        if (!hasStarted) {
          hasStarted = true;
          trackVideoEvent('first_play');
        } else {
          trackVideoEvent('resume', { resumeTime: video.currentTime });
        }
      }).catch(console.warn);
    } else {
      video.pause();
      trackVideoEvent('pause', { pauseTime: video.currentTime });
    }
    updatePlayState();
  });

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    card.click(); // Reuse the same logic
  });

  // Enhanced video event tracking
  video.addEventListener('ended', () => {
    trackVideoEvent('complete', { totalWatchTime: watchTime });
    updatePlayState();
  });

  video.addEventListener('play', () => {
    lastTimeUpdate = Date.now();
    updatePlayState();
  });

  video.addEventListener('pause', updatePlayState);

  // Track video milestones and watch time
  const milestones = [25, 50, 75];
  let trackedMilestones = new Set();

  video.addEventListener('timeupdate', () => {
    // Calculate actual watch time
    if (!video.paused && lastTimeUpdate > 0) {
      const now = Date.now();
      const timeDiff = now - lastTimeUpdate;
      if (timeDiff < 2000) { // Only count if less than 2 seconds gap
        watchTime += timeDiff / 1000;
      }
      lastTimeUpdate = now;
    }

    // Track milestones
    if (video.duration > 0) {
      const percent = Math.round((video.currentTime / video.duration) * 100);

      milestones.forEach(milestone => {
        if (percent >= milestone && !trackedMilestones.has(milestone)) {
          trackedMilestones.add(milestone);
          trackVideoEvent('milestone', { 
            milestone: `${milestone}%`,
            watchTimeAtMilestone: watchTime 
          });
        }
      });
    }
  });

  // Initialize video
  updatePlayState();
  setTimeout(attemptAutoplay, 1500);

  if (TRACKING_CONFIG.DEBUG) {
    console.log('Video player initialized with tracking');
  }
}

// Enhanced Smooth Scrolling with Performance Optimization
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;

  e.preventDefault();
  const targetId = anchor.getAttribute('href');
  const target = document.querySelector(targetId);

  if (target) {
    const headerOffset = 80;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    // Track navigation click
    sendTrackingData('navigation', `Scrolled to: ${targetId}`, {
      targetSection: targetId,
      scrollDistance: Math.abs(offsetPosition - window.pageYOffset)
    });

    gtag('event', 'navigation_click', {
      event_category: 'Navigation',
      event_label: targetId,
      transport_type: 'beacon'
    });
  }
});

// Enhanced Time Tracking System
let pageMetrics = {
  startTime: Date.now(),
  totalTimeSpent: 0,
  activeTime: 0,
  isActive: true,
  lastActivity: Date.now(),
  scrollDepth: 0,
  maxScrollDepth: 0,
  clickCount: 0,
  keystrokes: 0
};

// Track page visibility for accurate time measurement
document.addEventListener('visibilitychange', () => {
  const now = Date.now();

  if (document.hidden) {
    // Page became hidden
    if (pageMetrics.isActive) {
      const sessionTime = Math.round((now - pageMetrics.startTime) / 1000);
      pageMetrics.totalTimeSpent += sessionTime;
      pageMetrics.isActive = false;
      
      sendTrackingData('visibility_change', 'Page hidden', {
        sessionTime: sessionTime,
        totalTime: pageMetrics.totalTimeSpent,
        scrollDepth: pageMetrics.maxScrollDepth
      });
    }
  } else {
    // Page became visible
    pageMetrics.startTime = now;
    pageMetrics.isActive = true;
    pageMetrics.lastActivity = now;
    
    sendTrackingData('visibility_change', 'Page visible');
  }
});

// Enhanced Activity Tracking
function trackActivity(activityType) {
  pageMetrics.lastActivity = Date.now();
  
  switch (activityType) {
    case 'click':
      pageMetrics.clickCount++;
      break;
    case 'key':
      pageMetrics.keystrokes++;
      break;
    case 'scroll':
      // Updated in scroll handler
      break;
  }
}

// Click activity tracking
document.addEventListener('click', () => trackActivity('click'));

// Keyboard activity tracking
document.addEventListener('keydown', () => trackActivity('key'));

// Enhanced Scroll Depth Tracking
function initializeScrollTracking() {
  const scrollMilestones = [10, 25, 50, 75, 90, 100];
  const trackedMilestones = new Set();
  let scrollStartTime = Date.now();
  let totalScrollTime = 0;

  const trackScrollDepth = debounce(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (documentHeight <= 0) return;

    const scrollPercent = Math.round((scrollTop / documentHeight) * 100);
    pageMetrics.scrollDepth = scrollPercent;
    pageMetrics.maxScrollDepth = Math.max(pageMetrics.maxScrollDepth, scrollPercent);

    trackActivity('scroll');

    scrollMilestones.forEach(milestone => {
      if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
        trackedMilestones.add(milestone);

        sendTrackingData('scroll_milestone', `Scrolled ${milestone}%`, {
          scrollPercent: milestone,
          timeToReach: Math.round((Date.now() - scrollStartTime) / 1000),
          documentHeight: documentHeight + window.innerHeight,
          scrollSpeed: scrollPercent > 0 ? Math.round(milestone / ((Date.now() - scrollStartTime) / 1000)) : 0
        });

        gtag('event', 'scroll_depth', {
          event_category: 'User Engagement',
          event_label: `${milestone}%`,
          value: milestone
        });
      }
    });
  }, 300);

  window.addEventListener('scroll', trackScrollDepth, { passive: true });
}

// Send comprehensive session data periodically
setInterval(() => {
  if (pageMetrics.isActive && !document.hidden) {
    const currentSession = Math.round((Date.now() - pageMetrics.startTime) / 1000);
    const totalTime = pageMetrics.totalTimeSpent + currentSession;
    
    // Only send if meaningful engagement
    if (totalTime >= 30 || pageMetrics.clickCount >= 3 || pageMetrics.maxScrollDepth >= 25) {
      sendTrackingData('engagement_update', 'Periodic engagement report', {
        totalTimeSpent: totalTime,
        currentSessionTime: currentSession,
        maxScrollDepth: pageMetrics.maxScrollDepth,
        clickCount: pageMetrics.clickCount,
        keystrokes: pageMetrics.keystrokes,
        isActive: pageMetrics.isActive,
        timeSinceLastActivity: Math.round((Date.now() - pageMetrics.lastActivity) / 1000)
      });
    }
  }
}, 120000); // Every 2 minutes

// Send final comprehensive session data
function sendFinalSessionData() {
  const now = Date.now();
  const finalSessionTime = pageMetrics.isActive ? Math.round((now - pageMetrics.startTime) / 1000) : 0;
  const finalTotalTime = pageMetrics.totalTimeSpent + finalSessionTime;

  if (finalTotalTime >= 10) { // Only if spent at least 10 seconds
    sendTrackingData('session_complete', 'Final session data', {
      totalTimeSpent: finalTotalTime,
      maxScrollDepth: pageMetrics.maxScrollDepth,
      clickCount: pageMetrics.clickCount,
      keystrokes: pageMetrics.keystrokes,
      exitType: 'page_unload',
      engagementScore: calculateEngagementScore(),
      sessionQuality: getSessionQuality(finalTotalTime, pageMetrics.maxScrollDepth, pageMetrics.clickCount)
    });
  }
}

// Calculate engagement score
function calculateEngagementScore() {
  let score = 0;
  
  // Time factor (max 40 points)
  const totalTime = pageMetrics.totalTimeSpent + (pageMetrics.isActive ? Math.round((Date.now() - pageMetrics.startTime) / 1000) : 0);
  score += Math.min(40, totalTime / 5); // 1 point per 5 seconds, max 40
  
  // Scroll factor (max 30 points)
  score += (pageMetrics.maxScrollDepth / 100) * 30;
  
  // Interaction factor (max 30 points)
  score += Math.min(30, pageMetrics.clickCount * 3 + pageMetrics.keystrokes * 0.5);
  
  return Math.round(score);
}

// Get session quality
function getSessionQuality(time, scroll, clicks) {
  if (time >= 120 && scroll >= 75 && clicks >= 5) return 'high';
  if (time >= 60 && scroll >= 50 && clicks >= 3) return 'medium';
  if (time >= 30 && scroll >= 25) return 'low';
  return 'minimal';
}

// Multiple exit listeners
window.addEventListener('beforeunload', sendFinalSessionData);
window.addEventListener('pagehide', sendFinalSessionData);

// Enhanced Navbar Scroll Effect
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (navbar) {
    if (scrollTop > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  lastScrollTop = scrollTop;
}, { passive: true });

// Enhanced Error Handling and Reporting
window.addEventListener('error', (event) => {
  const errorData = {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack || 'No stack trace',
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString()
  };

  gtag('event', 'javascript_error', {
    event_category: 'Error',
    event_label: event.message,
    transport_type: 'beacon'
  });

  sendTrackingData('error', 'JavaScript error', errorData);
});

window.addEventListener('unhandledrejection', (event) => {
  const rejectionData = {
    reason: event.reason?.message || 'Unknown promise rejection',
    stack: event.reason?.stack || 'No stack trace',
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString()
  };

  gtag('event', 'promise_rejection', {
    event_category: 'Error',
    event_label: rejectionData.reason
  });

  sendTrackingData('error', 'Promise rejection', rejectionData);
});

// Performance Monitoring
function monitorPerformance() {
  if (!('performance' in window)) return;

  // Core Web Vitals monitoring
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const performanceData = {
        metric: entry.entryType,
        value: Math.round(entry.startTime || entry.value || 0),
        name: entry.name || 'unknown',
        timestamp: Date.now()
      };

      if (entry.entryType === 'largest-contentful-paint') {
        sendTrackingData('performance', 'LCP measured', {
          ...performanceData,
          lcp: Math.round(entry.startTime),
          element: entry.element?.tagName || 'unknown'
        });
      } else if (entry.entryType === 'first-input') {
        sendTrackingData('performance', 'FID measured', {
          ...performanceData,
          fid: Math.round(entry.processingStart - entry.startTime),
          inputType: entry.name
        });
      } else if (entry.entryType === 'layout-shift') {
        if (!entry.hadRecentInput && entry.value > 0) {
          sendTrackingData('performance', 'CLS detected', {
            ...performanceData,
            cls: entry.value,
            sources: entry.sources?.length || 0
          });
        }
      }
    }
  });

  try {
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
  } catch (e) {
    if (TRACKING_CONFIG.DEBUG) {
      console.log('Performance observer not supported');
    }
  }
}

// Initialize all systems on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Show cookie banner
  showCookieBanner();
  
  // Initialize tracking systems
  if (checkExistingConsent()) {
    initializeTracking();
  }
  
  // Initialize reveal animations
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
  
  // Initialize scroll tracking
  initializeScrollTracking();
  
  // Initialize click tracking
  initializeClickTracking();
  
  if (TRACKING_CONFIG.DEBUG) {
    console.log('Portfolio website DOM loaded with enhanced tracking');
  }
});

// Initialize all systems on window load
window.addEventListener('load', () => {
  // Create particles
  createParticles();
  
  // Initialize video player
  initializeVideoPlayer();
  
  // Monitor performance
  monitorPerformance();
  
  // Show initial hero content with staggered animation
  setTimeout(() => {
    document.querySelector('.reveal-left')?.classList.add('show');
  }, 200);

  setTimeout(() => {
    document.querySelector('.reveal-right')?.classList.add('show');
  }, 400);

  // Send initial comprehensive page load data
  setTimeout(() => {
    sendTrackingData('page_loaded', 'Initial page load complete', {
      loadTime: Date.now() - pageMetrics.startTime,
      deviceInfo: getEnhancedDeviceInfo(),
      initialViewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      features: [
        'enhanced_tracking',
        'privacy_compliance', 
        'performance_monitoring',
        'user_behavior_analytics',
        'error_tracking'
      ]
    });
  }, 3000);

  if (TRACKING_CONFIG.DEBUG) {
    console.log('Portfolio website fully loaded with all tracking systems active');
  }
});

// Initialize tracking function
function initializeTracking() {
  if (TRACKING_CONFIG.DEBUG) {
    console.log('Tracking initialized with consent:', userConsent);
  }
  
  // Send initialization event
  sendTrackingData('tracking_initialized', 'Enhanced tracking system started', {
    consent: userConsent,
    features: Object.keys(TRACKING_CONFIG).filter(key => TRACKING_CONFIG[key] === true)
  });
}

// Utility function: Debounce
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Professional Console Branding
console.log(
  '%c🚀 Enhanced Portfolio by amandesignser %c\n' +
  '%cBuilt with advanced tracking, privacy compliance & performance optimization\n' +
  '%cFeel free to explore the code and connect with me!\n' +
  '%c📧 amanbarnd@gmail.com',
  'color: #00ffff; font-size: 16px; font-weight: bold;',
  'color: #ffffff;',
  'color: #ff00ff; font-size: 12px;',
  'color: #00ff00; font-size: 12px;',
  'color: #ffff00; font-size: 12px;'
);

/**
 * Enhanced Portfolio Website JavaScript Complete
 * Features: Privacy-compliant tracking, comprehensive analytics,
 * performance monitoring, error handling, user behavior analysis
 * @author Aman Kumar (amandesignser)
 * @version 2.0
 */