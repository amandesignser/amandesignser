/**
 * Professional Portfolio Website JavaScript
 * Enhanced Performance & Analytics Tracking System
 * @author Aman Kumar (amandesignser)
 */

// Google Analytics Configuration
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-CN24ESW1EW', {
  page_title: document.title,
  page_location: window.location.href,
  send_page_view: true
});

// Professional Social Media Click Tracking
function trackClick(platform) {
  try {
    gtag('event', 'social_click', {
      event_category: 'Social Media',
      event_label: platform,
      transport_type: 'beacon',
      custom_parameter: 'portfolio_interaction'
    });
    console.log(`Social media click tracked: ${platform}`);
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
}

// Set current year dynamically
document.getElementById('year').textContent = new Date().getFullYear();

// Performance-optimized particle system
function createParticles() {
  const particles = document.getElementById('particles');
  if (!particles) return;
  
  // Adaptive particle count based on device capabilities
  const isMobile = window.innerWidth < 768;
  const isLowPerformance = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
  const particleCount = isMobile ? 12 : (isLowPerformance ? 20 : 35);

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
  
  console.log(`Created ${particleCount} particles for optimal performance`);
}

// Enhanced Mobile Menu with Animation
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
      gtag('event', 'menu_open', {
        event_category: 'Navigation',
        event_label: 'Mobile Menu Opened'
      });
    } else {
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('flex');
      menuBtn.textContent = 'Menu';
      menuBtn.setAttribute('aria-expanded', 'false');
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
  rootMargin: '0px 0px -80px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      
      // Track section visibility
      const sectionId = entry.target.closest('section')?.id || 'unknown';
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

// Initialize reveal animations
document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
});

// Enhanced Video Player with Professional Controls
(function initializeVideoPlayer() {
  const video = document.getElementById('proj2');
  const card = document.getElementById('videoCard');
  const btn = document.getElementById('videoPlayBtn');

  if (!video || !card || !btn) {
    console.warn('Video player elements not found');
    return;
  }

  let isPlaying = false;
  let hasStarted = false;

  const updatePlayState = () => {
    isPlaying = !video.paused;
    card.classList.toggle('paused', video.paused);
    btn.textContent = video.paused ? '▶ Play Demo' : '⏸ Pause';
    btn.setAttribute('aria-label', video.paused ? 'Play project demonstration video' : 'Pause video');
  };

  const trackVideoEvent = (action, position = null) => {
    const eventData = {
      event_category: 'Video Interaction',
      event_label: 'project2.mp4',
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
      console.log(`Video ${action} tracked:`, eventData);
    } catch (error) {
      console.warn('Video tracking error:', error);
    }
  };

  // Auto-play with user interaction detection
  const attemptAutoplay = async () => {
    try {
      await video.play();
      hasStarted = true;
      updatePlayState();
      trackVideoEvent('autoplay');
    } catch (error) {
      console.log('Autoplay prevented by browser policy');
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
          trackVideoEvent('resume');
        }
      }).catch(console.warn);
    } else {
      video.pause();
      trackVideoEvent('pause');
    }
    updatePlayState();
  });

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    
    if (video.paused) {
      video.play().then(() => {
        if (!hasStarted) {
          hasStarted = true;
          trackVideoEvent('first_play');
        } else {
          trackVideoEvent('resume');
        }
      }).catch(console.warn);
    } else {
      video.pause();
      trackVideoEvent('pause');
    }
    updatePlayState();
  });

  // Video event tracking
  video.addEventListener('ended', () => {
    trackVideoEvent('complete');
    updatePlayState();
  });

  video.addEventListener('play', updatePlayState);
  video.addEventListener('pause', updatePlayState);

  // Track video milestones
  const milestones = [25, 50, 75];
  let trackedMilestones = new Set();

  video.addEventListener('timeupdate', () => {
    if (video.duration > 0) {
      const percent = Math.round((video.currentTime / video.duration) * 100);
      
      milestones.forEach(milestone => {
        if (percent >= milestone && !trackedMilestones.has(milestone)) {
          trackedMilestones.add(milestone);
          trackVideoEvent('progress', `${milestone}%`);
        }
      });
    }
  });

  // Initialize video
  updatePlayState();
  
  // Attempt autoplay after a short delay
  setTimeout(attemptAutoplay, 1000);

  console.log('Video player initialized successfully');
})();

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
    gtag('event', 'navigation_click', {
      event_category: 'Navigation',
      event_label: targetId,
      transport_type: 'beacon'
    });
  }
});

// Professional Page Load Performance Tracking
window.addEventListener('load', () => {
  // Initialize particles
  createParticles();

  // Show initial hero content with staggered animation
  setTimeout(() => {
    document.querySelector('.reveal-left')?.classList.add('show');
  }, 200);
  
  setTimeout(() => {
    document.querySelector('.reveal-right')?.classList.add('show');
  }, 400);

  // Track performance metrics
  if ('performance' in window) {
    const perfData = performance.getEntriesByType('navigation')[0];
    if (perfData) {
      const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
      const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
      
      gtag('event', 'page_performance', {
        event_category: 'Performance',
        custom_parameter_1: Math.round(loadTime),
        custom_parameter_2: Math.round(domContentLoaded),
        transport_type: 'beacon'
      });
    }
  }

  console.log('Portfolio website loaded successfully');
});

// Enhanced Analytics Tracking System
(function initializeAdvancedTracking() {
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycby60lD7E-wO75H47SORUGQDm_MNbVG9O6hNGmzgPBQou5uQhHB3uyT7y8oDUg8HwJmn/exec";
  const DEBUG = false;

  function log(...args) { 
    if (DEBUG) console.log("[Professional Tracker]", ...args); 
  }

  function generateId(prefix = "visitor") {
    return prefix + "_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
  }

  function debounce(fn, wait = 300) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), wait);
    };
  }

  function parseUserAgent(ua) {
    const result = { 
      browser: "Unknown", 
      browserVersion: "", 
      os: "Unknown", 
      deviceType: "Desktop" 
    };
    
    try {
      // Browser detection
      if (/Firefox\/([0-9\.]+)/.test(ua)) {
        result.browser = "Firefox";
        result.browserVersion = ua.match(/Firefox\/([0-9\.]+)/)[1];
      } else if (/Edg\/([0-9\.]+)/.test(ua)) {
        result.browser = "Edge";
        result.browserVersion = ua.match(/Edg\/([0-9\.]+)/)[1];
      } else if (/Chrome\/([0-9\.]+)/.test(ua) && /Safari\//.test(ua)) {
        result.browser = "Chrome";
        result.browserVersion = ua.match(/Chrome\/([0-9\.]+)/)[1];
      } else if (/Safari\/([0-9\.]+)/.test(ua) && /Version\/([0-9\.]+)/.test(ua)) {
        result.browser = "Safari";
        result.browserVersion = ua.match(/Version\/([0-9\.]+)/)[1];
      } else if (/OPR\/([0-9\.]+)/.test(ua)) {
        result.browser = "Opera";
        result.browserVersion = ua.match(/OPR\/([0-9\.]+)/)[1];
      }

      // OS detection
      if (/Windows NT/.test(ua)) result.os = "Windows";
      else if (/Android/.test(ua)) result.os = "Android";
      else if (/iPhone|iPad|iPod/.test(ua)) result.os = "iOS";
      else if (/Mac OS X/.test(ua)) result.os = "macOS";
      else if (/Linux/.test(ua)) result.os = "Linux";

      // Device type detection
      if (/Mobi|Android|iPhone/.test(ua)) result.deviceType = "Mobile";
      else if (/iPad|Tablet/.test(ua)) result.deviceType = "Tablet";
      else result.deviceType = "Desktop";
    } catch (error) {
      log("User agent parsing error:", error);
    }
    
    return result;
  }

  function detectAdBlocker() {
    try {
      const testElement = document.createElement("div");
      testElement.innerHTML = "&nbsp;";
      testElement.className = "adsbox";
      testElement.style.cssText = "position:absolute;left:-9999px;width:1px;height:1px;";
      document.body.appendChild(testElement);
      
      const isBlocked = (
        getComputedStyle(testElement).display === "none" ||
        testElement.offsetParent === null ||
        testElement.offsetHeight === 0 ||
        testElement.offsetWidth === 0
      );
      
      testElement.remove();
      return isBlocked;
    } catch (error) {
      log("AdBlock detection error:", error);
      return false;
    }
  }

  // Professional tracking state management
  const TRACKING_STATE = {
    visitorId: null,
    sessionId: null,
    isFirstVisit: false,
    sessionStartTime: Date.now(),
    pageLoadTime: Date.now(),
    ipInfo: null,
    geoLocation: null,
    userAgent: null,
    screenInfo: `${screen.width}x${screen.height}@${screen.colorDepth}bit`,
    language: navigator.language || "unknown",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    networkInfo: getNetworkInfo(),
    adBlockerDetected: false,
    scrollDepthTracked: new Set(),
    timeSpentIntervals: [],
    lastActiveTime: Date.now()
  };

  function getNetworkInfo() {
    if (navigator.connection) {
      return {
        effectiveType: navigator.connection.effectiveType || "unknown",
        downlink: navigator.connection.downlink || 0,
        rtt: navigator.connection.rtt || 0
      };
    }
    return { effectiveType: "unknown", downlink: 0, rtt: 0 };
  }

  // Initialize visitor and session IDs
  function initializeIds() {
    try {
      let visitorId = localStorage.getItem("portfolio_visitor_id");
      if (!visitorId) {
        visitorId = generateId("visitor");
        localStorage.setItem("portfolio_visitor_id", visitorId);
        TRACKING_STATE.isFirstVisit = true;
      }
      TRACKING_STATE.visitorId = visitorId;

      let sessionId = sessionStorage.getItem("portfolio_session_id");
      if (!sessionId) {
        sessionId = generateId("session");
        sessionStorage.setItem("portfolio_session_id", sessionId);
      }
      TRACKING_STATE.sessionId = sessionId;

      log("IDs initialized:", { visitorId, sessionId, isFirstVisit: TRACKING_STATE.isFirstVisit });
    } catch (error) {
      log("ID initialization error:", error);
      // Fallback to memory-based IDs
      TRACKING_STATE.visitorId = generateId("visitor");
      TRACKING_STATE.sessionId = generateId("session");
    }
  }

  // Enhanced IP and location detection
  async function loadLocationData() {
    if (TRACKING_STATE.ipInfo) return TRACKING_STATE.ipInfo;
    
    try {
      const response = await fetch("https://ipapi.co/json/", { 
        timeout: 5000,
        signal: AbortSignal.timeout(5000)
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      TRACKING_STATE.ipInfo = {
        ip: data.ip || "",
        city: data.city || "Unknown",
        region: data.region || "",
        country: data.country_name || data.country || "Unknown",
        isp: data.org || data.orgname || "",
        latitude: data.latitude || data.lat || "",
        longitude: data.longitude || data.lon || "",
        timezone: data.timezone || ""
      };
      
      log("Location data loaded:", TRACKING_STATE.ipInfo);
      return TRACKING_STATE.ipInfo;
    } catch (error) {
      log("Primary IP service failed, trying fallback:", error);
      
      try {
        const fallbackResponse = await fetch("https://api.ipify.org?format=json", {
          timeout: 3000,
          signal: AbortSignal.timeout(3000)
        });
        const fallbackData = await fallbackResponse.json();
        
        TRACKING_STATE.ipInfo = {
          ip: fallbackData.ip || "",
          city: "Unknown",
          region: "",
          country: "Unknown",
          isp: "",
          latitude: "",
          longitude: "",
          timezone: ""
        };
        
        return TRACKING_STATE.ipInfo;
      } catch (fallbackError) {
        log("All IP services failed:", fallbackError);
        TRACKING_STATE.ipInfo = {
          ip: "", city: "Unknown", region: "", country: "Unknown",
          isp: "", latitude: "", longitude: "", timezone: ""
        };
        return TRACKING_STATE.ipInfo;
      }
    }
  }

  // Professional GPS location request with delayed execution
  function requestGeolocation(timeout = 8000) {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        log("Geolocation not supported");
        return resolve(null);
      }

      let hasResolved = false;
      const timer = setTimeout(() => {
        if (!hasResolved) {
          hasResolved = true;
          log("Geolocation request timed out");
          resolve(null);
        }
      }, timeout);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (hasResolved) return;
          hasResolved = true;
          clearTimeout(timer);
          
          TRACKING_STATE.geoLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          
          log("GPS location obtained:", TRACKING_STATE.geoLocation);
          resolve(TRACKING_STATE.geoLocation);
        },
        (error) => {
          if (hasResolved) return;
          hasResolved = true;
          clearTimeout(timer);
          log("Geolocation error:", error.message);
          resolve(null);
        },
        {
          enableHighAccuracy: false,
          timeout: timeout,
          maximumAge: 300000 // 5 minutes cache
        }
      );
    });
  }

  // Professional data collection and transmission
  async function sendTrackingData(eventType, eventDetails = "", additionalData = {}) {
    try {
      const locationInfo = await loadLocationData();
      if (!TRACKING_STATE.userAgent) {
        TRACKING_STATE.userAgent = parseUserAgent(navigator.userAgent);
      }

      const trackingPayload = {
        // Core tracking data
        timestamp: new Date().toISOString(),
        visitorId: TRACKING_STATE.visitorId,
        sessionId: TRACKING_STATE.sessionId,
        isFirstVisit: TRACKING_STATE.isFirstVisit,
        
        // Event data
        eventType: eventType,
        eventDetails: eventDetails,
        
        // Page data
        pageUrl: window.location.href,
        pageTitle: document.title,
        referrer: document.referrer || "",
        
        // Location data
        ipAddress: locationInfo.ip,
        city: locationInfo.city,
        region: locationInfo.region,
        country: locationInfo.country,
        isp: locationInfo.isp,
        latitude: TRACKING_STATE.geoLocation?.latitude || locationInfo.latitude || "",
        longitude: TRACKING_STATE.geoLocation?.longitude || locationInfo.longitude || "",
        gpsAccuracy: TRACKING_STATE.geoLocation?.accuracy || "",
        
        // Technical data
        userAgent: navigator.userAgent,
        browser: TRACKING_STATE.userAgent.browser,
        browserVersion: TRACKING_STATE.userAgent.browserVersion,
        operatingSystem: TRACKING_STATE.userAgent.os,
        deviceType: TRACKING_STATE.userAgent.deviceType,
        screenResolution: TRACKING_STATE.screenInfo,
        language: TRACKING_STATE.language,
        timezone: TRACKING_STATE.timezone,
        networkType: TRACKING_STATE.networkInfo.effectiveType,
        connectionSpeed: TRACKING_STATE.networkInfo.downlink,
        adBlockerDetected: TRACKING_STATE.adBlockerDetected ? "yes" : "no",
        
        // Performance data
        sessionDuration: Math.round((Date.now() - TRACKING_STATE.sessionStartTime) / 1000),
        pageLoadTime: Math.round((Date.now() - TRACKING_STATE.pageLoadTime) / 1000),
        
        // Source identification
        source: "professional_portfolio",
        version: "2.0",
        
        
        // Additional custom data
        ...additionalData
      };

      // Use beacon API for critical events
      if (navigator.sendBeacon && (eventType === 'time_spent' || eventType === 'page_exit')) {
        const success = navigator.sendBeacon(WEB_APP_URL, JSON.stringify(trackingPayload));
        log(`Beacon sent (${eventType}):`, success);
      } else {
        // Use fetch with keepalive for other events
        await fetch(WEB_APP_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(trackingPayload),
          keepalive: true
        });
      }

      log(`Tracking data sent (${eventType}):`, eventDetails);
    } catch (error) {
      console.error("Tracking transmission error:", error);
    }
  }

  // Enhanced scroll depth tracking
  const SCROLL_MILESTONES = [10, 25, 50, 75, 90, 100];
  const trackScrollDepth = debounce(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    if (documentHeight <= 0) return;
    
    const scrollPercent = Math.round((scrollTop / documentHeight) * 100);
    
    SCROLL_MILESTONES.forEach(milestone => {
      if (scrollPercent >= milestone && !TRACKING_STATE.scrollDepthTracked.has(milestone)) {
        TRACKING_STATE.scrollDepthTracked.add(milestone);
        sendTrackingData("scroll_depth", `${milestone}% reached`, {
          scrollPercent: scrollPercent,
          scrollPosition: scrollTop
        });
      }
    });
  }, 500);

  // Professional time spent tracking with session-based approach
  function initializeTimeTracking() {
    const TIME_INTERVAL = 30000; // Send updates every 30 seconds
    const ACTIVITY_TIMEOUT = 300000; // 5 minutes of inactivity timeout
    let lastSentTime = TRACKING_STATE.pageLoadTime;
    let isUserActive = true;
    let activityTimer;

    // Track user activity
    const resetActivityTimer = () => {
      isUserActive = true;
      TRACKING_STATE.lastActiveTime = Date.now();
      
      clearTimeout(activityTimer);
      activityTimer = setTimeout(() => {
        isUserActive = false;
      }, ACTIVITY_TIMEOUT);
    };

    // Add activity listeners
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
      document.addEventListener(event, resetActivityTimer, { passive: true });
    });

    // Send time spent updates at intervals
    const sendTimeUpdate = () => {
      const currentTime = Date.now();
      const totalTimeSpent = Math.round((currentTime - TRACKING_STATE.pageLoadTime) / 1000);
      const intervalTimeSpent = Math.round((currentTime - lastSentTime) / 1000);

      // Only send if user has been active and significant time has passed
      if (intervalTimeSpent >= 30 && isUserActive) {
        sendTrackingData("time_spent", `${totalTimeSpent} seconds total`, {
          totalTimeSpent: totalTimeSpent,
          intervalTimeSpent: intervalTimeSpent,
          isActive: document.hasFocus(),
          isUserActive: isUserActive,
          sessionDuration: Math.round((currentTime - TRACKING_STATE.sessionStartTime) / 1000)
        });
        lastSentTime = currentTime;
      }
    };

    // Set up interval for time tracking
    setInterval(sendTimeUpdate, TIME_INTERVAL);

    // Send final time on page exit
    const sendFinalTime = () => {
      const totalTime = Math.round((Date.now() - TRACKING_STATE.pageLoadTime) / 1000);
      const sessionDuration = Math.round((Date.now() - TRACKING_STATE.sessionStartTime) / 1000);
      
      sendTrackingData("page_exit", `Final session: ${totalTime}s`, {
        totalTimeSpent: totalTime,
        sessionDuration: sessionDuration,
        exitType: "page_unload",
        finalScrollPosition: window.pageYOffset
      });
    };

    // Multiple exit event listeners for better tracking
    window.addEventListener('beforeunload', sendFinalTime);
    window.addEventListener('pagehide', sendFinalTime);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        sendFinalTime();
      }
    });

    // Initialize activity tracking
    resetActivityTimer();
    log("Time tracking system initialized");
  }

  // Initialize professional tracking system
  async function initializeProfessionalTracking() {
    try {
      // Initialize core components
      initializeIds();
      TRACKING_STATE.userAgent = parseUserAgent(navigator.userAgent);
      TRACKING_STATE.adBlockerDetected = detectAdBlocker();
      
      // Load location data asynchronously
      loadLocationData().catch(err => log("Location loading failed:", err));
      
      // Request GPS permission after delay to avoid immediate popup
      setTimeout(() => {
        requestGeolocation(8000).catch(err => log("GPS request failed:", err));
      }, 5000); // 5 second delay
      
      // Initialize time tracking system
      initializeTimeTracking();

      // Set up scroll tracking
      window.addEventListener('scroll', trackScrollDepth, { passive: true });

      // Track initial pageview
      await sendTrackingData("pageview", "Professional portfolio loaded", {
        loadTime: Date.now() - TRACKING_STATE.pageLoadTime,
        userAgent: navigator.userAgent
      });

      log("Professional tracking system initialized successfully");
    } catch (error) {
      console.error("Tracking initialization error:", error);
    }
  }

  // Start tracking system after page load to avoid blocking
  setTimeout(initializeProfessionalTracking, 2000);
})();

// Professional error handling and reporting
window.addEventListener('error', (event) => {
  gtag('event', 'javascript_error', {
    event_category: 'Error',
    event_label: event.message,
    custom_parameter: event.filename + ':' + event.lineno
  });
});

window.addEventListener('unhandledrejection', (event) => {
  gtag('event', 'promise_rejection', {
    event_category: 'Error',
    event_label: event.reason?.message || 'Unknown promise rejection'
  });
});

// Enhanced navbar scroll effect
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

// Professional console branding
console.log(
  '%c🚀 Professional Portfolio by amandesignser %c\n' +
  '%cBuilt with modern web technologies and performance optimization\n' +
  '%cFeel free to explore the code and connect with me!\n' +
  '%c📧 amanbarnd@gmail.com',
  'color: #00ffff; font-size: 16px; font-weight: bold;',
  'color: #ffffff;',
  'color: #ff00ff; font-size: 12px;',
  'color: #00ff00; font-size: 12px;',
  'color: #ffff00; font-size: 12px;'
);

// Final initialization
document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio website DOM fully loaded! 🎉');
});

window.addEventListener('load', () => {
  console.log('Portfolio website fully loaded and optimized! ✨');
});

// Performance monitoring
if ('performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (perfData) {
        console.log(`Page load performance: ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`);
      }
    }, 0);
  });
}