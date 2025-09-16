/**
 * Professional Portfolio Website JavaScript
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

// FIXED TRACKING SYSTEM - Simple & Working
const TRACKING_CONFIG = {
  WEB_APP_URL: "https://script.google.com/macros/s/AKfycby60lD7E-wO75H47SORUGQDm_MNbVG9O6hNGmzgPBQou5uQhHB3uyT7y8oDUg8HwJmn/exec",
  DEBUG: false
};

// Simple visitor ID management
function getVisitorId() {
  let visitorId = localStorage.getItem('portfolio_visitor_id');
  if (!visitorId) {
    visitorId = 'v_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
    localStorage.setItem('portfolio_visitor_id', visitorId);
  }
  return visitorId;
}

// Session ID management
function getSessionId() {
  let sessionId = sessionStorage.getItem('portfolio_session_id');
  if (!sessionId) {
    sessionId = 's_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
    sessionStorage.setItem('portfolio_session_id', sessionId);
  }
  return sessionId;
}

// FIXED: Simple tracking function that works
async function sendTrackingData(eventType, eventDetails = '', additionalData = {}) {
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
      screenResolution: `${screen.width}x${screen.height}`,
      source: 'portfolio_website',
      ...additionalData
    };

    // Use fetch with no-cors mode for Google Sheets
    const response = await fetch(TRACKING_CONFIG.WEB_APP_URL, {
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
}

// Professional Social Media Click Tracking - FIXED
function trackClick(platform) {
  try {
    // Google Analytics tracking
    gtag('event', 'social_click', {
      event_category: 'Social Media',
      event_label: platform,
      transport_type: 'beacon'
    });

    // Custom tracking
    sendTrackingData('social_click', `${platform} clicked`);
    
    console.log(`Social media click tracked: ${platform}`);
  } catch (error) {
    console.warn('Social tracking error:', error);
  }
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
      
      sendTrackingData('menu_interaction', 'Mobile menu opened');
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
        
        sendTrackingData('navigation', `Clicked: ${link.textContent}`);
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
      
      sendTrackingData('section_view', `Section viewed: ${sectionId}`);
      
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
      sendTrackingData('video_interaction', `Video ${action}`, eventData);
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
    
    sendTrackingData('navigation', `Scrolled to: ${targetId}`);
  }
});

// FIXED: Simple Time Tracking - No Spam
let pageStartTime = Date.now();
let totalTimeSpent = 0;
let isPageActive = true;

// Track page visibility for accurate time measurement
document.addEventListener('visibilitychange', () => {
  const now = Date.now();
  
  if (document.hidden) {
    // Page became hidden - add to total time
    if (isPageActive) {
      totalTimeSpent += Math.round((now - pageStartTime) / 1000);
      isPageActive = false;
    }
  } else {
    // Page became visible - restart timer
    pageStartTime = now;
    isPageActive = true;
  }
});

// Send time spent data periodically (every 60 seconds) - PREVENTS SPAM
setInterval(() => {
  if (isPageActive && !document.hidden) {
    const currentSession = Math.round((Date.now() - pageStartTime) / 1000);
    const total = totalTimeSpent + currentSession;
    
    if (total >= 30) { // Only send if meaningful time spent
      sendTrackingData('time_spent', `${total} seconds total`, {
        totalTimeSpent: total,
        currentSession: currentSession,
        isActive: true
      });
    }
  }
}, 60000); // Every 60 seconds instead of frequent updates

// Send final time on page exit - SINGLE FINAL ENTRY
function sendFinalTimeSpent() {
  const now = Date.now();
  if (isPageActive) {
    totalTimeSpent += Math.round((now - pageStartTime) / 1000);
  }
  
  if (totalTimeSpent >= 10) { // Only if spent at least 10 seconds
    sendTrackingData('session_end', `Final time: ${totalTimeSpent} seconds`, {
      totalTimeSpent: totalTimeSpent,
      exitType: 'page_unload'
    });
  }
}

// Multiple exit listeners for comprehensive coverage
window.addEventListener('beforeunload', sendFinalTimeSpent);
window.addEventListener('pagehide', sendFinalTimeSpent);

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
      
      sendTrackingData('page_performance', 'Page loaded', {
        loadTime: Math.round(loadTime),
        domContentLoaded: Math.round(domContentLoaded)
      });
    }
  }

  // Send initial pageview
  sendTrackingData('pageview', 'Portfolio website loaded');
  
  console.log('Portfolio website loaded with fixed tracking system');
});

// FIXED: Advanced Location Tracking - NO IMMEDIATE POPUP
(function initializeLocationTracking() {
  let locationRequested = false;
  let ipLocationData = null;
  
  // Load IP-based location data silently
  async function getIPLocation() {
    if (ipLocationData) return ipLocationData;
    
    try {
      const response = await fetch('https://ipapi.co/json/', {
        signal: AbortSignal.timeout(8000)
      });
      
      if (response.ok) {
        const data = await response.json();
        ipLocationData = {
          ip: data.ip || '',
          city: data.city || 'Unknown',
          region: data.region || '',
          country: data.country_name || data.country || 'Unknown',
          isp: data.org || data.orgname || '',
          latitude: data.latitude || data.lat || '',
          longitude: data.longitude || data.lon || ''
        };
        
        // Send IP location data
        sendTrackingData('location_ip', 'IP location detected', {
          city: ipLocationData.city,
          country: ipLocationData.country,
          source: 'ip_api'
        });
      }
    } catch (error) {
      console.log('IP location detection failed (silent):', error.message);
    }
    
    return ipLocationData;
  }
  
  // Request GPS location ONLY after significant user engagement
  function requestGPSLocationLater() {
    if (locationRequested) return;
    
    const requestGPS = () => {
      if (locationRequested || !navigator.geolocation) return;
      locationRequested = true;
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const gpsData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          
          sendTrackingData('location_gps', 'GPS location obtained', {
            latitude: gpsData.latitude,
            longitude: gpsData.longitude,
            accuracy: gpsData.accuracy,
            source: 'gps'
          });
          
          console.log('GPS location obtained silently');
        },
        (error) => {
          console.log('GPS location denied/failed (silent):', error.message);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 600000
        }
      );
    };
    
    // Trigger GPS request only after significant engagement
    let scrollDepth = 0;
    let interactionCount = 0;
    
    // Track scroll engagement
    const handleScroll = () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollDepth = Math.max(scrollDepth, (currentScroll / maxScroll) * 100);
      
      // Request GPS after 50% scroll
      if (scrollDepth > 50 && !locationRequested) {
        setTimeout(requestGPS, 3000); // 3 second delay
        window.removeEventListener('scroll', handleScroll);
      }
    };
    
    // Track user interactions
    const handleInteraction = () => {
      interactionCount++;
      // Request GPS after 5 meaningful interactions
      if (interactionCount >= 5 && !locationRequested) {
        setTimeout(requestGPS, 2000); // 2 second delay
        document.removeEventListener('click', handleInteraction);
      }
    };
    
    // Set up delayed triggers
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleInteraction);
    
    // Fallback: Request after 3 minutes of page activity
    setTimeout(() => {
      if (!locationRequested) {
        requestGPS();
      }
    }, 180000); // 3 minutes
  }
  
  // Initialize location tracking
  getIPLocation().catch(() => {});
  requestGPSLocationLater();
})();

// Enhanced Scroll Depth Tracking
(function initializeScrollTracking() {
  const scrollMilestones = [25, 50, 75, 100];
  const trackedMilestones = new Set();
  
  const trackScrollDepth = debounce(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    if (documentHeight <= 0) return;
    
    const scrollPercent = Math.round((scrollTop / documentHeight) * 100);
    
    scrollMilestones.forEach(milestone => {
      if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
        trackedMilestones.add(milestone);
        
        gtag('event', 'scroll_depth', {
          event_category: 'User Engagement',
          event_label: `${milestone}%`,
          value: milestone
        });
        
        sendTrackingData('scroll_depth', `Scrolled ${milestone}%`, {
          scrollPercent: milestone,
          documentHeight: documentHeight
        });
      }
    });
  }, 500);
  
  window.addEventListener('scroll', trackScrollDepth, { passive: true });
})();

// Professional Error Handling and Reporting
window.addEventListener('error', (event) => {
  gtag('event', 'javascript_error', {
    event_category: 'Error',
    event_label: event.message,
    custom_parameter: event.filename + ':' + event.lineno
  });
  
  sendTrackingData('error', 'JavaScript error', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    stack: event.error?.stack || 'No stack trace'
  });
});

window.addEventListener('unhandledrejection', (event) => {
  gtag('event', 'promise_rejection', {
    event_category: 'Error',
    event_label: event.reason?.message || 'Unknown promise rejection'
  });
  
  sendTrackingData('error', 'Promise rejection', {
    reason: event.reason?.message || 'Unknown',
    stack: event.reason?.stack || 'No stack trace'
  });
});

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

// Utility: Debounce function
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

// Enhanced Device and Browser Detection
function getDeviceInfo() {
  const ua = navigator.userAgent;
  const deviceInfo = {
    browser: 'Unknown',
    browserVersion: '',
    os: 'Unknown',
    deviceType: 'Desktop',
    isMobile: /Mobi|Android|iPhone|iPad/.test(ua),
    isTablet: /iPad|Tablet/.test(ua),
    touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0
  };
  
  // Browser detection
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
  
  // OS detection
  if (ua.includes('Windows')) deviceInfo.os = 'Windows';
  else if (ua.includes('Mac OS')) deviceInfo.os = 'macOS';
  else if (ua.includes('Android')) deviceInfo.os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) deviceInfo.os = 'iOS';
  else if (ua.includes('Linux')) deviceInfo.os = 'Linux';
  
  // Device type
  if (deviceInfo.isMobile && !deviceInfo.isTablet) deviceInfo.deviceType = 'Mobile';
  else if (deviceInfo.isTablet) deviceInfo.deviceType = 'Tablet';
  
  return deviceInfo;
}

// Send device info on page load
setTimeout(() => {
  const deviceInfo = getDeviceInfo();
  sendTrackingData('device_info', 'Device detected', deviceInfo);
}, 2000);

// Enhanced Form Interaction Tracking (if forms are added later)
function trackFormInteractions() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const formData = new FormData(form);
      const formInfo = {
        formId: form.id || 'unnamed_form',
        fieldCount: formData.size
      };
      
      sendTrackingData('form_submit', 'Form submitted', formInfo);
    });
  });
}

// Enhanced Performance Monitoring
function monitorPerformance() {
  if ('performance' in window) {
    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          sendTrackingData('performance', 'LCP measured', {
            lcp: Math.round(entry.startTime),
            metric: 'largest-contentful-paint'
          });
        } else if (entry.entryType === 'first-input') {
          sendTrackingData('performance', 'FID measured', {
            fid: Math.round(entry.processingStart - entry.startTime),
            metric: 'first-input-delay'
          });
        } else if (entry.entryType === 'layout-shift') {
          if (!entry.hadRecentInput) {
            sendTrackingData('performance', 'CLS measured', {
              cls: entry.value,
              metric: 'cumulative-layout-shift'
            });
          }
        }
      }
    });
    
    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (e) {
      console.log('Performance observer not supported');
    }
  }
}

// Professional Console Branding
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

// Final Initialization
document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio website DOM fully loaded with advanced features!');
  trackFormInteractions();
});

window.addEventListener('load', () => {
  console.log('Portfolio website fully optimized - tracking system fixed!');
  monitorPerformance();
  
  // Send final initialization tracking
  sendTrackingData('initialization_complete', 'All systems loaded', {
    loadTime: Date.now() - pageStartTime,
    features: ['tracking', 'analytics', 'performance', 'location', 'error_handling']
  });
});

// Network Connection Monitoring
if ('connection' in navigator) {
  const connection = navigator.connection;
  
  sendTrackingData('connection_info', 'Network detected', {
    effectiveType: connection.effectiveType || 'unknown',
    downlink: connection.downlink || 0,
    rtt: connection.rtt || 0,
    saveData: connection.saveData || false
  });
  
  connection.addEventListener('change', () => {
    sendTrackingData('connection_change', 'Network changed', {
      effectiveType: connection.effectiveType || 'unknown',
      downlink: connection.downlink || 0
    });
  });
}

// Memory Usage Monitoring (if available)
if ('memory' in performance) {
  const memoryInfo = performance.memory;
  sendTrackingData('memory_info', 'Memory usage', {
    usedJSHeapSize: Math.round(memoryInfo.usedJSHeapSize / 1048576), // MB
    totalJSHeapSize: Math.round(memoryInfo.totalJSHeapSize / 1048576), // MB
    jsHeapSizeLimit: Math.round(memoryInfo.jsHeapSizeLimit / 1048576) // MB
  });
}

// Battery Status Monitoring (if available)
if ('getBattery' in navigator) {
  navigator.getBattery().then((battery) => {
    sendTrackingData('battery_info', 'Battery status', {
      level: Math.round(battery.level * 100),
      charging: battery.charging,
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime
    });
  }).catch(() => {});
}