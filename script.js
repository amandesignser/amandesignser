/**
 * tracking-core.js (Part 1)
 * Core utilities, consent, visitor/session ids, device + location helpers,
 * and sendTrackingData implementation.
 * Author: Aman Kumar (amandesignser) — improved & hardened
 */

const TRACKING_CONFIG = {
  GOOGLE_SHEET_URL: "https://script.google.com/macros/s/AKfycbxGsajC0YY6ljUZxs7wZI306yOXVUDkEYz3AGz06vuzQjKd5OvKUweKbRT4hJTv-Wlw/exec",
  DEBUG: true,
  COLLECT_IP_LOCATION: true,
  COLLECT_DEVICE_INFO: true,
  COLLECT_USER_BEHAVIOR: true,
  RESPECT_DNT: true,
  COOKIE_CONSENT_REQUIRED: true
};

// Minimal safe gtag wrapper (no crashes if GA not loaded)
function safeGtag(...args) {
  try {
    if (typeof gtag === 'function') {
      gtag(...args);
    } else if (TRACKING_CONFIG.DEBUG) {
      console.warn('gtag not available — skipping GA event', args);
    }
  } catch (e) {
    if (TRACKING_CONFIG.DEBUG) console.warn('safeGtag error', e);
  }
}

// Normalize Do Not Track values across browsers
function isDoNotTrackEnabled() {
  try {
    const dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
    return dnt === '1' || dnt === 'yes' || dnt === 'true';
  } catch (e) {
    return false;
  }
}

// -------- Consent management --------
let userConsent = {
  analytics: false,
  tracking: false,
  location: false,
  customized: false
};

function checkExistingConsent() {
  try {
    const saved = localStorage.getItem('portfolio_consent');
    if (saved) {
      userConsent = JSON.parse(saved);
      return true;
    }
  } catch (e) {
    if (TRACKING_CONFIG.DEBUG) console.warn('checkExistingConsent parse error', e);
  }
  return false;
}

function saveConsent() {
  try {
    localStorage.setItem('portfolio_consent', JSON.stringify(userConsent));
    localStorage.setItem('portfolio_consent_date', new Date().toISOString());
  } catch (e) {
    if (TRACKING_CONFIG.DEBUG) console.warn('saveConsent failed', e);
  }
}

// -------- IDs & session helpers --------
function generateId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
}

function getVisitorId() {
  try {
    let v = localStorage.getItem('portfolio_visitor_id');
    if (!v) {
      v = generateId('visitor');
      localStorage.setItem('portfolio_visitor_id', v);
      localStorage.setItem('portfolio_first_visit', new Date().toISOString());
    }
    return v;
  } catch (e) {
    if (TRACKING_CONFIG.DEBUG) console.warn('getVisitorId error', e);
    return generateId('visitor_fallback');
  }
}

function getSessionId() {
  try {
    let s = sessionStorage.getItem('portfolio_session_id');
    if (!s) {
      s = generateId('session');
      sessionStorage.setItem('portfolio_session_id', s);
      sessionStorage.setItem('portfolio_session_start', new Date().toISOString());
    }
    return s;
  } catch (e) {
    if (TRACKING_CONFIG.DEBUG) console.warn('getSessionId error', e);
    return generateId('session_fallback');
  }
}

// -------- device info (safe) --------
function getEnhancedDeviceInfo() {
  const ua = navigator.userAgent || '';
  const deviceInfo = {
    browser: 'Unknown',
    browserVersion: '',
    os: 'Unknown',
    osVersion: '',
    deviceType: 'Desktop',
    isMobile: /Mobi|Android|iPhone|iPad/.test(ua),
    isTablet: /iPad|Tablet/.test(ua),
    screenWidth: screen?.width || 0,
    screenHeight: screen?.height || 0,
    viewportWidth: window?.innerWidth || 0,
    viewportHeight: window?.innerHeight || 0,
    colorDepth: screen?.colorDepth || 0,
    pixelRatio: window.devicePixelRatio || 1,
    touchSupport: ('ontouchstart' in window) || (navigator.maxTouchPoints > 0),
    cookiesEnabled: navigator.cookieEnabled,
    javaEnabled: typeof navigator.javaEnabled === 'function' ? navigator.javaEnabled() : false,
    language: navigator.language || navigator.userLanguage || '',
    languages: Array.isArray(navigator.languages) ? navigator.languages.join(',') : '',
    platform: navigator.platform || '',
    connection: null,
    hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
    maxTouchPoints: navigator.maxTouchPoints || 0
  };

  if (ua.includes('Firefox')) {
    deviceInfo.browser = 'Firefox';
    deviceInfo.browserVersion = (ua.match(/Firefox\/([0-9\.]+)/) || [])[1] || '';
  } else if (ua.includes('Chrome') && ua.includes('Safari') && !ua.includes('Edg')) {
    deviceInfo.browser = 'Chrome';
    deviceInfo.browserVersion = (ua.match(/Chrome\/([0-9\.]+)/) || [])[1] || '';
  } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
    deviceInfo.browser = 'Safari';
    deviceInfo.browserVersion = (ua.match(/Version\/([0-9\.]+)/) || [])[1] || '';
  } else if (ua.includes('Edg')) {
    deviceInfo.browser = 'Edge';
    deviceInfo.browserVersion = (ua.match(/Edg\/([0-9\.]+)/) || [])[1] || '';
  }

  if (ua.includes('Windows NT 10.0')) deviceInfo.os = 'Windows 10/11';
  else if (ua.includes('Windows NT')) deviceInfo.os = 'Windows';
  else if (ua.includes('Mac OS X')) {
    deviceInfo.os = 'macOS';
    deviceInfo.osVersion = (ua.match(/Mac OS X ([0-9_]+)/) || [])[1]?.replace(/_/g, '.') || '';
  } else if (ua.includes('Android')) {
    deviceInfo.os = 'Android';
    deviceInfo.osVersion = (ua.match(/Android ([0-9\.]+)/) || [])[1] || '';
  } else if (ua.includes('iPhone') || ua.includes('iPad')) {
    deviceInfo.os = 'iOS';
    deviceInfo.osVersion = (ua.match(/OS ([0-9_]+)/) || [])[1]?.replace(/_/g, '.') || '';
  } else if (ua.includes('Linux')) deviceInfo.os = 'Linux';

  if (deviceInfo.isMobile && !deviceInfo.isTablet) deviceInfo.deviceType = 'Mobile';
  else if (deviceInfo.isTablet) deviceInfo.deviceType = 'Tablet';

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

// -------- safe fetch with timeout (AbortController) --------
async function safeFetch(url, options = {}, timeoutMs = 8000) {
  // If AbortController exists, use it; otherwise try fetch normally
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    const resp = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return resp;
  } catch (err) {
    // In case abort or fetch fails, rethrow so callers can handle gracefully
    if (TRACKING_CONFIG.DEBUG) console.warn('safeFetch failed', err?.message || err);
    throw err;
  }
}

// -------- location helpers --------
async function getLocationData() {
  if (!TRACKING_CONFIG.COLLECT_IP_LOCATION) return { city: 'Disabled', country: 'Disabled' };
  if (!userConsent.location) return { city: 'Not Allowed', country: 'Privacy Protected' };

  // Try ipapi.co first — but guard against CORS/timeout issues
  try {
    const resp = await safeFetch('https://ipapi.co/json/', {}, 8000);
    if (resp && resp.ok) {
      const data = await resp.json();
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
        source: 'ipapi'
      };
    }
  } catch (e) {
    if (TRACKING_CONFIG.DEBUG) console.warn('ipapi fetch failed', e?.message || e);
  }

  // fallback: return minimal info
  return { city: 'Unknown', country: 'Unknown', source: 'failed' };
}

function requestGPSLocation() {
  return new Promise((resolve) => {
    if (!userConsent.location || !('geolocation' in navigator)) {
      resolve(null);
      return;
    }

    let resolved = false;
    const success = (position) => {
      if (resolved) return;
      resolved = true;
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
    };

    const fail = (err) => {
      if (resolved) return;
      resolved = true;
      if (TRACKING_CONFIG.DEBUG) console.warn('GPS failed', err?.message || err);
      resolve(null);
    };

    try {
      navigator.geolocation.getCurrentPosition(success, fail, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000
      });

      // extra safety: timeout fallback in case callback never fires
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          if (TRACKING_CONFIG.DEBUG) console.warn('GPS fallback timeout');
          resolve(null);
        }
      }, 17_000);
    } catch (e) {
      if (TRACKING_CONFIG.DEBUG) console.warn('requestGPSLocation exception', e);
      resolve(null);
    }
  });
}

// -------- sendTrackingData (robust) --------
async function sendTrackingData(eventType, eventDetails = '', additionalData = {}) {
  try {
    // privacy checks
    if (TRACKING_CONFIG.RESPECT_DNT && isDoNotTrackEnabled()) {
      if (TRACKING_CONFIG.DEBUG) console.log('Do Not Track enabled — skipping tracking');
      return;
    }
    // ensure consent for non-privacy events
    if (!userConsent.tracking && eventType !== 'privacy') {
      if (TRACKING_CONFIG.DEBUG) console.log('User did not allow tracking — event skipped', eventType);
      return;
    }

    // Build base payload
    const deviceInfo = TRACKING_CONFIG.COLLECT_DEVICE_INFO ? getEnhancedDeviceInfo() : {};
    const locationData = (TRACKING_CONFIG.COLLECT_IP_LOCATION) ? await getLocationData() : {};

    const payload = {
      timestamp: new Date().toISOString(),
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      eventType,
      eventDetails,
      pageUrl: (typeof window !== 'undefined' && window.location) ? window.location.href : '',
      pageTitle: (typeof document !== 'undefined' && document.title) ? document.title : '',
      referrer: (typeof document !== 'undefined' && document.referrer) ? document.referrer : 'direct',
      browser: deviceInfo.browser || '',
      browserVersion: deviceInfo.browserVersion || '',
      os: deviceInfo.os || '',
      osVersion: deviceInfo.osVersion || '',
      deviceType: deviceInfo.deviceType || '',
      screenResolution: deviceInfo.screenWidth && deviceInfo.screenHeight ? `${deviceInfo.screenWidth}x${deviceInfo.screenHeight}` : '',
      viewportSize: deviceInfo.viewportWidth && deviceInfo.viewportHeight ? `${deviceInfo.viewportWidth}x${deviceInfo.viewportHeight}` : '',
      city: locationData.city || '',
      country: locationData.country || '',
      timezone: locationData.timezone || (Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone || ''),
      language: deviceInfo.language || '',
      userAgent: navigator.userAgent || '',
      connectionType: deviceInfo.connection?.effectiveType || 'unknown',
      cookiesEnabled: deviceInfo.cookiesEnabled || false,
      javaEnabled: deviceInfo.javaEnabled || false,
      source: 'portfolio_enhanced',
      version: '2.1',
      ...additionalData
    };

    // Primary: try sending via fetch (Apps Script sometimes requires mode:no-cors; keep but handle)
    try {
      // Use no-cors for public Apps Script endpoints to avoid CORS error — but this hides response status.
      await fetch(TRACKING_CONFIG.GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (TRACKING_CONFIG.DEBUG) console.log('Tracking posted (no-cors):', eventType, eventDetails);
    } catch (e) {
      if (TRACKING_CONFIG.DEBUG) console.warn('Primary fetch failed, will fallback to image beacon', e);
      // fallback: tiny image beacon (GET) with encoded payload (useful if POST blocked)
      try {
        const beaconUrl = TRACKING_CONFIG.GOOGLE_SHEET_URL + '?payload=' + encodeURIComponent(JSON.stringify({
          ...payload,
          fallback: true
        }));
        const img = new Image();
        img.src = beaconUrl;
      } catch (ex) {
        if (TRACKING_CONFIG.DEBUG) console.warn('beacon fallback failed', ex);
      }
    }

    // Also try navigator.sendBeacon for unload-safe delivery (best-effort)
    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon(TRACKING_CONFIG.GOOGLE_SHEET_URL, blob);
      }
    } catch (e) {
      if (TRACKING_CONFIG.DEBUG) console.warn('sendBeacon failed', e);
    }

    // Google Analytics event (safe wrapper)
    safeGtag('event', 'custom_tracking', {
      event_category: eventType,
      event_label: eventDetails,
      transport_type: 'beacon'
    });

  } catch (error) {
    if (TRACKING_CONFIG.DEBUG) console.error('sendTrackingData general error', error);
  }
}

// Expose some functions to global so other file (part 2) can call them:
window.PortfolioTrackingCore = {
  TRACKING_CONFIG,
  userConsent,
  checkExistingConsent,
  saveConsent,
  getVisitorId,
  getSessionId,
  getEnhancedDeviceInfo,
  getLocationData,
  requestGPSLocation,
  sendTrackingData,
  safeGtag,
  isDoNotTrackEnabled,
  generateId
};

/**
 * tracking-main.js (Part 2)
 * Event handlers, observers, UI hooks and initialization.
 * Depends on tracking-core.js being loaded first.
 */

(function () {
  const core = window.PortfolioTrackingCore;
  if (!core) {
    console.error('PortfolioTrackingCore not loaded — tracking-main aborted');
    return;
  }

  const {
    TRACKING_CONFIG,
    userConsent,
    checkExistingConsent,
    saveConsent,
    getVisitorId,
    getSessionId,
    getEnhancedDeviceInfo,
    sendTrackingData,
    safeGtag
  } = core;

  // Cookie banner helper (safe DOM checks)
  function showCookieBannerIfNeeded() {
    try {
      const banner = document.getElementById('cookieBanner');
      if (!banner) return;
      if (!checkExistingConsent()) {
        setTimeout(() => banner.classList && banner.classList.add('show'), 2000);
      } else {
        // if consent exists, hide banner gracefully
        banner.style.display = 'none';
      }
    } catch (e) {
      if (TRACKING_CONFIG.DEBUG) console.warn('showCookieBannerIfNeeded error', e);
    }
  }

  // Public consent actions (connect these to your banner buttons)
  window.acceptCookies = function () {
    core.userConsent = {
      analytics: true,
      tracking: true,
      location: true,
      customized: false
    };
    saveConsent();
    const b = document.getElementById('cookieBanner');
    if (b) { b.classList.remove('show'); setTimeout(()=> b.style.display='none', 300); }
    sendTrackingData('privacy', 'Cookies accepted');
    initializeTracking();
  };

  window.rejectCookies = function () {
    core.userConsent = {
      analytics: false,
      tracking: false,
      location: false,
      customized: false
    };
    saveConsent();
    const b = document.getElementById('cookieBanner');
    if (b) { b.classList.remove('show'); setTimeout(()=> b.style.display='none', 300); }
    sendTrackingData('privacy', 'Cookies rejected');
  };

  window.customizeCookies = function () {
    core.userConsent = {
      analytics: true,
      tracking: false,
      location: false,
      customized: true
    };
    saveConsent();
    const b = document.getElementById('cookieBanner');
    if (b) { b.classList.remove('show'); setTimeout(()=> b.style.display='none', 300); }
    sendTrackingData('privacy', 'Cookies customized');
    initializeTracking();
  };

  // ----- Click tracking (data-track attribute) -----
  function initializeClickTracking() {
    document.addEventListener('click', (e) => {
      try {
        const element = e.target.closest && e.target.closest('[data-track]');
        if (!element) return;

        const trackingId = element.getAttribute('data-track') || 'unknown';
        const elementType = element.tagName?.toLowerCase() || '';
        const elementText = (element.textContent || '').trim().slice(0, 100);

        sendTrackingData('click_event', trackingId, {
          elementType, elementText,
          href: element.href || '',
          position: { x: e.clientX, y: e.clientY }
        });

        safeGtag('event', 'click', {
          event_category: 'User Interaction',
          event_label: trackingId,
          transport_type: 'beacon'
        });

        if (TRACKING_CONFIG.DEBUG) console.log('Click tracked:', trackingId);
      } catch (err) {
        if (TRACKING_CONFIG.DEBUG) console.warn('click tracking error', err);
      }
    }, { passive: true });
  }

  // ----- Scroll tracking (debounced) -----
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

  function initializeScrollTracking() {
    const scrollMilestones = [10,25,50,75,90,100];
    const tracked = new Set();
    const start = Date.now();

    const track = debounce(() => {
      try {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        const percent = Math.round((scrollTop / docHeight) * 100);
        pageMetrics.scrollDepth = percent;
        pageMetrics.maxScrollDepth = Math.max(pageMetrics.maxScrollDepth, percent);

        scrollMilestones.forEach(m => {
          if (percent >= m && !tracked.has(m)) {
            tracked.add(m);
            sendTrackingData('scroll_milestone', `Scrolled ${m}%`, {
              scrollPercent: m,
              timeToReach: Math.round((Date.now() - start)/1000),
              documentHeight: document.documentElement.scrollHeight
            });

            safeGtag('event', 'scroll_depth', {
              event_category: 'User Engagement',
              event_label: `${m}%`,
              value: m
            });
          }
        });
      } catch (e) {
        if (TRACKING_CONFIG.DEBUG) console.warn('scroll track error', e);
      }
    }, 300);

    window.addEventListener('scroll', track, { passive: true });
  }

  // ----- Visibility & active time tracking -----
  document.addEventListener('visibilitychange', () => {
    const now = Date.now();
    if (document.hidden) {
      if (pageMetrics.isActive) {
        const sessionTime = Math.round((now - pageMetrics.startTime) / 1000);
        pageMetrics.totalTimeSpent += sessionTime;
        pageMetrics.isActive = false;
        sendTrackingData('visibility_change', 'Page hidden', {
          sessionTime, totalTime: pageMetrics.totalTimeSpent, scrollDepth: pageMetrics.maxScrollDepth
        });
      }
    } else {
      pageMetrics.startTime = now;
      pageMetrics.isActive = true;
      pageMetrics.lastActivity = now;
      sendTrackingData('visibility_change', 'Page visible');
    }
  });

  // ----- Periodic engagement update & final session data -----
  setInterval(() => {
    try {
      if (pageMetrics.isActive && !document.hidden) {
        const currentSession = Math.round((Date.now() - pageMetrics.startTime) / 1000);
        const totalTime = pageMetrics.totalTimeSpent + currentSession;
        if (totalTime >= 30 || pageMetrics.clickCount >= 3 || pageMetrics.maxScrollDepth >= 25) {
          sendTrackingData('engagement_update', 'Periodic engagement report', {
            totalTimeSpent: totalTime,
            currentSessionTime: currentSession,
            maxScrollDepth: pageMetrics.maxScrollDepth,
            clickCount: pageMetrics.clickCount,
            keystrokes: pageMetrics.keystrokes
          });
        }
      }
    } catch (e) {
      if (TRACKING_CONFIG.DEBUG) console.warn('periodic engagement error', e);
    }
  }, 120000); // 2 minutes

  function calculateEngagementScore() {
    let score = 0;
    const totalTime = pageMetrics.totalTimeSpent + (pageMetrics.isActive ? Math.round((Date.now() - pageMetrics.startTime)/1000) : 0);
    score += Math.min(40, totalTime / 5);
    score += (pageMetrics.maxScrollDepth / 100) * 30;
    score += Math.min(30, pageMetrics.clickCount * 3 + pageMetrics.keystrokes * 0.5);
    return Math.round(score);
  }

  function getSessionQuality(time, scroll, clicks) {
    if (time >= 120 && scroll >= 75 && clicks >= 5) return 'high';
    if (time >= 60 && scroll >= 50 && clicks >= 3) return 'medium';
    if (time >= 30 && scroll >= 25) return 'low';
    return 'minimal';
  }

  function sendFinalSessionData() {
    try {
      const now = Date.now();
      const finalSessionTime = pageMetrics.isActive ? Math.round((now - pageMetrics.startTime) / 1000) : 0;
      const finalTotalTime = pageMetrics.totalTimeSpent + finalSessionTime;

      if (finalTotalTime >= 10) {
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
    } catch (e) {
      if (TRACKING_CONFIG.DEBUG) console.warn('sendFinalSessionData error', e);
    }
  }

  window.addEventListener('beforeunload', sendFinalSessionData);
  window.addEventListener('pagehide', sendFinalSessionData);

  // ----- Intersection observer for reveal animations -----
  const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        const sectionId = entry.target.closest('section')?.getAttribute('data-section') || 'unknown';
        sendTrackingData('section_view', `Section viewed: ${sectionId}`, {
          sectionId, elementClass: entry.target.className, intersectionRatio: entry.intersectionRatio
        });
        safeGtag('event', 'section_view', {
          event_category: 'User Engagement',
          event_label: `Section: ${sectionId}`,
          transport_type: 'beacon'
        });
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // ----- Video player tracking (safe) -----
  function initializeVideoPlayer() {
    const video = document.getElementById('proj2');
    const card = document.getElementById('videoCard');
    const btn = document.getElementById('videoPlayBtn');
    if (!video || !card || !btn) {
      if (TRACKING_CONFIG.DEBUG) console.warn('Video elements missing — skipping video tracking');
      return;
    }

    let isPlaying = false, hasStarted = false, watchTime = 0, lastTimeUpdate = 0;
    const milestones = [25,50,75];
    const trackedMilestones = new Set();

    const updatePlayState = () => {
      isPlaying = !video.paused;
      card.classList.toggle('paused', video.paused);
      btn.textContent = video.paused ? '▶ Play Demo' : '⏸ Pause';
    };

    const trackVideoEvent = (action, additional={}) => {
      const data = {
        action, videoId: 'project2_demo',
        currentTime: Math.round(video.currentTime),
        duration: Math.round(video.duration || 0),
        watchTime, percentComplete: video.duration ? Math.round((video.currentTime / video.duration) * 100) : 0,
        ...additional
      };
      safeGtag('event', `video_${action}`, {
        event_category: 'Video Interaction',
        event_label: 'project2.mp4',
        value: data.currentTime,
        transport_type: 'beacon'
      });
      sendTrackingData('video_interaction', `Video ${action}`, data);
      if (TRACKING_CONFIG.DEBUG) console.log('Video event', action, data);
    };

    const attemptAutoplay = async () => {
      try { await video.play(); hasStarted = true; updatePlayState(); trackVideoEvent('autoplay'); }
      catch (e) { if (TRACKING_CONFIG.DEBUG) console.log('Autoplay blocked'); updatePlayState(); }
    };

    card.addEventListener('click', (e) => {
      if (e.target === btn) return;
      if (video.paused) {
        video.play().then(() => {
          if (!hasStarted) { hasStarted=true; trackVideoEvent('first_play'); } else trackVideoEvent('resume');
        }).catch(()=>{});
      } else {
        video.pause();
        trackVideoEvent('pause', { pauseTime: video.currentTime });
      }
      updatePlayState();
    });

    btn.addEventListener('click', (e) => { e.stopPropagation(); card.click(); });

    video.addEventListener('ended', () => { trackVideoEvent('complete', { totalWatchTime: watchTime }); updatePlayState(); });
    video.addEventListener('play', () => { lastTimeUpdate = Date.now(); updatePlayState(); });
    video.addEventListener('pause', updatePlayState);

    video.addEventListener('timeupdate', () => {
      if (!video.paused && lastTimeUpdate > 0) {
        const now = Date.now();
        const diff = now - lastTimeUpdate;
        if (diff < 2000) watchTime += diff / 1000;
        lastTimeUpdate = now;
      }
      if (video.duration > 0) {
        const percent = Math.round((video.currentTime / video.duration) * 100);
        milestones.forEach(m => {
          if (percent >= m && !trackedMilestones.has(m)) {
            trackedMilestones.add(m);
            trackVideoEvent('milestone', { milestone: `${m}%`, watchTimeAtMilestone: watchTime });
          }
        });
      }
    });

    updatePlayState();
    setTimeout(attemptAutoplay, 1500);
    if (TRACKING_CONFIG.DEBUG) console.log('Video player initialized with tracking');
  }

  // ----- Performance monitoring (CWV) -----
  function monitorPerformance() {
    if (!('PerformanceObserver' in window)) return;
    try {
      const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          try {
            if (entry.entryType === 'largest-contentful-paint') {
              sendTrackingData('performance', 'LCP measured', { lcp: Math.round(entry.startTime), name: entry.name || 'unknown' });
            } else if (entry.entryType === 'first-input' || entry.entryType === 'first-input-delay') {
              sendTrackingData('performance', 'FID measured', { fid: Math.round(entry.processingStart - entry.startTime || 0), name: entry.name });
            } else if (entry.entryType === 'layout-shift') {
              if (!entry.hadRecentInput && entry.value > 0) {
                sendTrackingData('performance', 'CLS detected', { cls: entry.value });
              }
            }
          } catch (e) { if (TRACKING_CONFIG.DEBUG) console.warn('perf entry handling error', e); }
        }
      });
      perfObserver.observe({ entryTypes: ['largest-contentful-paint','first-input','layout-shift'] });
    } catch (e) {
      if (TRACKING_CONFIG.DEBUG) console.warn('monitorPerformance observe failed', e);
    }
  }

  // ----- Navbar scroll effect (safe) -----
  let lastScrollTop = 0;
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    try {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      if (navbar) {
        if (st > 100) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
      }
      lastScrollTop = st;
    } catch (e) { if (TRACKING_CONFIG.DEBUG) console.warn('navbar scroll error', e); }
  }, { passive: true });

  // ----- Error reporting -----
  window.addEventListener('error', (event) => {
    try {
      const errorData = {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack || 'No stack',
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString()
      };
      safeGtag('event','javascript_error',{ event_category:'Error', event_label:event.message, transport_type:'beacon' });
      sendTrackingData('error', 'JavaScript error', errorData);
    } catch (e) { if (TRACKING_CONFIG.DEBUG) console.warn('error handler fail', e); }
  });

  window.addEventListener('unhandledrejection', (event) => {
    try {
      const rejectionData = {
        reason: event.reason?.message || 'Unknown promise rejection',
        stack: event.reason?.stack || 'No stack',
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString()
      };
      safeGtag('event','promise_rejection',{ event_category:'Error', event_label:rejectionData.reason });
      sendTrackingData('error', 'Promise rejection', rejectionData);
    } catch (e) { if (TRACKING_CONFIG.DEBUG) console.warn('unhandledrejection handler fail', e); }
  });

  // ----- Initialization -----
  function initializeTracking() {
    if (TRACKING_CONFIG.DEBUG) console.log('Tracking initialize — consent:', core.userConsent);
    // send init event
    sendTrackingData('tracking_initialized', 'Enhanced tracking system started', {
      consent: core.userConsent
    });
  }

  // DOMContentLoaded / load hooks
  document.addEventListener('DOMContentLoaded', () => {
    try {
      showCookieBannerIfNeeded();

      if (checkExistingConsent()) {
        // But note: checkExistingConsent mutates core.userConsent in core — ensure we use it
        if (core.userConsent.tracking || core.userConsent.analytics) initializeTracking();
      }

      // apply reveal observer to existing elements
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

      initializeScrollTracking();
      initializeClickTracking();

      if (TRACKING_CONFIG.DEBUG) console.log('Portfolio website DOM loaded with enhanced tracking (main)');
    } catch (e) {
      if (TRACKING_CONFIG.DEBUG) console.warn('DOMContentLoaded init error', e);
    }
  });

  window.addEventListener('load', () => {
    try {
      // particle creation may be heavy — guard
      try { if (typeof createParticles === 'function') createParticles(); } catch (e) {}
      initializeVideoPlayer();
      monitorPerformance();

      // show initial elements
      setTimeout(()=> document.querySelector('.reveal-left')?.classList.add('show'), 200);
      setTimeout(()=> document.querySelector('.reveal-right')?.classList.add('show'), 400);

      setTimeout(()=> {
        sendTrackingData('page_loaded', 'Initial page load complete', {
          loadTime: Date.now() - pageMetrics.startTime,
          deviceInfo: getEnhancedDeviceInfo(),
          initialViewport: { width: window.innerWidth, height: window.innerHeight }
        });
      }, 3000);

      if (TRACKING_CONFIG.DEBUG) console.log('Portfolio website fully loaded with main tracking');
    } catch (e) {
      if (TRACKING_CONFIG.DEBUG) console.warn('window.load init error', e);
    }
  });

  // expose init for manual call if needed
  window.initializePortfolioTracking = initializeTracking;

})();