// Google Analytics config
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config','G-CN24ESW1EW');
function trackClick(platform){
  try{
    gtag('event','click',{event_category:'Social Links',event_label:platform});
  }catch(e){}
}

// Set current year
document.getElementById('year').textContent = new Date().getFullYear();

// Create floating particles
function createParticles() {
  const particles = document.getElementById('particles');
  const particleCount = window.innerWidth < 768 ? 15 : 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (15 + Math.random() * 10) + 's';
    particles.appendChild(particle);
  }
}

// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
  mobileMenu.classList.toggle('flex');
});

// Intersection Observer for reveal animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all reveal elements
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  observer.observe(el);
});

// Video handling
(function() {
  const video = document.getElementById('proj2');
  const card = document.getElementById('videoCard');
  const btn = document.getElementById('videoPlayBtn');

  if (!video || !card || !btn) return;

  const toggleOverlay = () => card.classList.toggle('play', video.play);

  // Initially autoplay and show overlay
  video.play();
  toggleOverlay();

  const fireGA = (action) => {
    if (typeof gtag === "function") {
      gtag('event', 'video_' + action, {
        event_category: 'Portfolio',
        event_label: 'project2.mp4'
      });
    }
  };

  // Click handlers
  card.addEventListener('click', (e) => {
    if (e.target === btn) return; // Let button handle it
    
    if (video.paused) {
      video.play();
      fireGA('play');
    } else {
      video.pause();
      fireGA('pause');
    }
    toggleOverlay();
  });

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (video.paused) {
      video.play();
      fireGA('play');
    } else {
      video.pause();
      fireGA('pause');
    }
    toggleOverlay();
  });

  // Video event listeners
  video.addEventListener('ended', () => {
    fireGA('ended');
    toggleOverlay();
  });
  video.addEventListener('play', toggleOverlay);
  video.addEventListener('pause', toggleOverlay);
})();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Initialize particles when page loads
window.addEventListener('load', () => {
  createParticles();
  
  // Show initial hero content immediately
  document.querySelector('.reveal-left').classList.add('show');
  document.querySelector('.reveal-right').classList.add('show');
});

// Load heavy tracking script after everything else
setTimeout(function() {
  /***** Client-side Universal Tracker *****/
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycby60lD7E-wO75H47SORUGQDm_MNbVG9O6hNGmzgPBQou5uQhHB3uyT7y8oDUg8HwJmn/exec";
  const DEBUG = false;

  function log(...args){ if(DEBUG) console.log("[Tracker]", ...args); }

  function uid(prefix = "wr") {
    return prefix + "_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2,8);
  }

  function debounce(fn, wait = 200){
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(()=>fn(...args), wait); };
  }

  function parseUA(ua) {
    const res = { browser: "Unknown", browserVersion: "", os: "Unknown", deviceType: "Desktop" };
    try {
      if (/Firefox\/([0-9\.]+)/.test(ua)) {
        res.browser = "Firefox"; res.browserVersion = ua.match(/Firefox\/([0-9\.]+)/)[1];
      } else if (/Edg\/([0-9\.]+)/.test(ua)) {
        res.browser = "Edge"; res.browserVersion = ua.match(/Edg\/([0-9\.]+)/)[1];
      } else if (/Chrome\/([0-9\.]+)/.test(ua) && /Safari\//.test(ua)) {
        res.browser = "Chrome"; res.browserVersion = ua.match(/Chrome\/([0-9\.]+)/)[1];
      } else if (/Safari\/([0-9\.]+)/.test(ua) && /Version\/([0-9\.]+)/.test(ua)) {
        res.browser = "Safari"; res.browserVersion = ua.match(/Version\/([0-9\.]+)/)[1];
      } else if (/OPR\/([0-9\.]+)/.test(ua)) {
        res.browser = "Opera"; res.browserVersion = ua.match(/OPR\/([0-9\.]+)/)[1];
      }

      if (/Windows NT/.test(ua)) res.os = "Windows";
      else if (/Android/.test(ua)) res.os = "Android";
      else if (/iPhone|iPad|iPod/.test(ua)) res.os = "iOS";
      else if (/Mac OS X/.test(ua)) res.os = "macOS";
      else if (/Linux/.test(ua)) res.os = "Linux";

      if (/Mobi|Android|iPhone/.test(ua)) res.deviceType = "Mobile";
      else if (/iPad|Tablet/.test(ua)) res.deviceType = "Tablet";
      else res.deviceType = "Desktop";
    } catch(e){
      log("parseUA error", e);
    }
    return res;
  }

  function detectAdBlock() {
    try {
      const bait = document.createElement("div");
      bait.className = "adsbox";
      bait.style.width = "1px";
      bait.style.height = "1px";
      bait.style.position = "absolute";
      bait.style.left = "-9999px";
      document.body.appendChild(bait);
      const blocked = (getComputedStyle(bait).display === "none" || bait.offsetParent === null || bait.offsetHeight === 0);
      bait.remove();
      return blocked;
    } catch(e){
      return false;
    }
  }

  // Global state
  const TRACK = {
    visitorId: null,
    sessionId: null,
    isFirstVisit: false,
    sessionStart: Date.now(),
    ipInfo: null,
    geoPos: null,
    uaInfo: null,
    screen: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language || navigator.userLanguage || "unknown",
    networkType: (navigator.connection && (navigator.connection.effectiveType || navigator.connection.type)) || "unknown",
    adBlock: false,
    scrollSent: new Set()
  };

  // Initialize visitor/session IDs
  (function initIds(){
    let vid = localStorage.getItem("wr_vid");
    if (!vid) {
      vid = uid("visitor");
      localStorage.setItem("wr_vid", vid);
      TRACK.isFirstVisit = true;
    } else TRACK.isFirstVisit = false;
    TRACK.visitorId = vid;

    let sid = sessionStorage.getItem("wr_sid");
    if (!sid) {
      sid = uid("session");
      sessionStorage.setItem("wr_sid", sid);
    }
    TRACK.sessionId = sid;
  })();

  // Load IP info
  async function loadIpInfo(){
    if (TRACK.ipInfo) return TRACK.ipInfo;
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      TRACK.ipInfo = {
        ip: data.ip || "",
        city: data.city || "Unknown",
        region: data.region || "",
        country_name: data.country_name || (data.country || "Unknown"),
        org: data.org || data.orgname || "",
        latitude: data.latitude || data.lat || "",
        longitude: data.longitude || data.lon || ""
      };
      return TRACK.ipInfo;
    } catch (e) {
      try {
        const r2 = await fetch("https://api.ipify.org?format=json");
        const j = await r2.json();
        TRACK.ipInfo = { ip: j.ip || "", city:"Unknown", region:"", country_name:"Unknown", org:"", latitude:"", longitude:"" };
        return TRACK.ipInfo;
      } catch (ee) {
        TRACK.ipInfo = { ip: "", city:"Unknown", region:"", country_name:"Unknown", org:"", latitude:"", longitude:"" };
        return TRACK.ipInfo;
      }
    }
  }

  // Request GPS
  function requestGeoOnce(timeout = 5000) {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null);
      let settled = false;
      const timer = setTimeout(()=>{ if(!settled){ settled = true; resolve(null); } }, timeout);
      navigator.geolocation.getCurrentPosition((pos) => {
        if (settled) return;
        settled = true; clearTimeout(timer);
        TRACK.geoPos = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        resolve(TRACK.geoPos);
      }, (err) => {
        if (settled) return;
        settled = true; clearTimeout(timer);
        resolve(null);
      }, { enableHighAccuracy: false, timeout: timeout, maximumAge: 60000 });
    });
  }

  // Send tracking data
  async function sendTracking(eventType, eventDetails = "", extra = {}) {
    try {
      const ip = await loadIpInfo();
      if (!TRACK.uaInfo) TRACK.uaInfo = parseUA(navigator.userAgent);

      const payload = {
        timestamp: new Date().toISOString(),
        visitorId: TRACK.visitorId,
        sessionId: TRACK.sessionId,
        isFirstVisit: TRACK.isFirstVisit,
        eventType: eventType,
        eventDetails: eventDetails,
        pageUrl: window.location.href,
        referrer: document.referrer || "",
        ipAddress: ip.ip || "",
        isp: ip.org || "",
        city: ip.city || "",
        region: ip.region || "",
        country: ip.country_name || "",
        latitude: TRACK.geoPos ? TRACK.geoPos.lat : (ip.latitude || ""),
        longitude: TRACK.geoPos ? TRACK.geoPos.lon : (ip.longitude || ""),
        gps: TRACK.geoPos ? `${TRACK.geoPos.lat},${TRACK.geoPos.lon}` : "",
        location: (ip.city ? ip.city + ", " + ip.country_name : ip.country_name || ""),
        userAgent: navigator.userAgent,
        browser: TRACK.uaInfo.browser || "",
        browserVersion: TRACK.uaInfo.browserVersion || "",
        os: TRACK.uaInfo.os || "",
        deviceType: TRACK.uaInfo.deviceType || "",
        screen: TRACK.screen,
        language: TRACK.language,
        networkType: TRACK.networkType || "unknown",
        adBlock: TRACK.adBlock ? "yes" : "no",
        timeSpentSec: extra.timeSpentSec || "",
        source: "portfolio"
      };

      for (const k in extra) if (!(k in payload)) payload[k] = extra[k];

      // Use beacon API for better performance
      if (navigator.sendBeacon && (eventType === 'time_spent' || eventType === 'pageview')) {
        navigator.sendBeacon(WEB_APP_URL, JSON.stringify(payload));
      } else {
        await fetch(WEB_APP_URL, {
          method: "POST",
          body: JSON.stringify(payload)
        });
      }

      log("sent", eventType, eventDetails);
    } catch (e) {
      console.error("sendTracking error:", e);
    }
  }

  // Initialize tracker
  (async function initializeTracker(){
    TRACK.uaInfo = parseUA(navigator.userAgent);
    TRACK.adBlock = detectAdBlock();
    TRACK.networkType = (navigator.connection && (navigator.connection.effectiveType || navigator.connection.type)) || TRACK.networkType;
    await loadIpInfo();
    requestGeoOnce(5000);
    sendTracking("pageview", "Page loaded");
  })();

  // Track menu button clicks
  const menuButton = document.getElementById("menuBtn");
  if (menuButton) {
    menuButton.addEventListener("click", () => {
      sendTracking("click", "menuBtn clicked");
      log("menuBtn clicked");
    });
  }

  // Scroll depth tracking
  const SCROLL_THRESHOLDS = [25,50,75,100];
  window.addEventListener("scroll", debounce(() => {
    const scrolled = window.scrollY + window.innerHeight;
    const total = document.documentElement.scrollHeight;
    if (total <= 0) return;
    const percent = Math.round((scrolled / total) * 100);
    SCROLL_THRESHOLDS.forEach(t => {
      if (percent >= t && !TRACK.scrollSent.has(t)) {
        TRACK.scrollSent.add(t);
        sendTracking("scroll_depth", `Reached ${t}%`);
      }
    });
  }, 300));

  // Time spent tracking
  const PAGE_START = Date.now();
  function sendTimeSpentAndClose() {
    const secs = Math.round((Date.now() - PAGE_START) / 1000);
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(WEB_APP_URL, JSON.stringify({
          timestamp: new Date().toISOString(),
          visitorId: TRACK.visitorId,
          sessionId: TRACK.sessionId,
          isFirstVisit: TRACK.isFirstVisit,
          eventType: "time_spent",
          eventDetails: `${secs} seconds`,
          pageUrl: window.location.href,
          timeSpentSec: secs,
          source: "portfolio"
        }));
      } else {
        fetch(WEB_APP_URL, {
          method: "POST",
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            visitorId: TRACK.visitorId,
            sessionId: TRACK.sessionId,
            isFirstVisit: TRACK.isFirstVisit,
            eventType: "time_spent",
            eventDetails: `${secs} seconds`,
            pageUrl: window.location.href,
            timeSpentSec: secs,
            source: "portfolio"
          }),
          keepalive: true
        });
      }
    } catch (e) {
      log("timeSpent send failed", e);
    }
  }

  window.addEventListener('pagehide', sendTimeSpentAndClose);
  window.addEventListener('beforeunload', sendTimeSpentAndClose);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') sendTimeSpentAndClose();
  });
}, 2000);