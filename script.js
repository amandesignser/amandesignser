/**
 * Professional Portfolio JavaScript
 * @author Aman Kumar (amandesignser)
 */

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

  // Create particle fragment for better performance
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random positioning and timing for natural movement
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (15 + Math.random() * 10) + 's';

    // Add slight random size variation
    const size = 2 + Math.random() * 1;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';

    // Random horizontal movement
    particle.style.setProperty('--random-x', (Math.random() - 0.5) * 200 + 'px');

    fragment.appendChild(particle);
  }

  particles.appendChild(fragment);
  console.log(`Created ${particleCount} particles for optimal performance`);
}

// Enhanced Mobile Menu with smooth animations
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

if (menuBtn && mobileMenu) {
  // Menu toggle functionality
  menuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    menuOpen = !menuOpen;

    if (menuOpen) {
      mobileMenu.classList.remove('hidden');
      mobileMenu.classList.add('flex');
      menuBtn.textContent = 'Close';
      menuBtn.setAttribute('aria-expanded', 'true');
      
      // Add smooth opening animation
      mobileMenu.style.opacity = '0';
      mobileMenu.style.transform = 'translateY(-10px)';
      
      requestAnimationFrame(() => {
        mobileMenu.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        mobileMenu.style.opacity = '1';
        mobileMenu.style.transform = 'translateY(0)';
      });

    } else {
      // Smooth closing animation
      mobileMenu.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      mobileMenu.style.opacity = '0';
      mobileMenu.style.transform = 'translateY(-10px)';
      
      setTimeout(() => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        menuBtn.textContent = 'Menu';
        menuBtn.setAttribute('aria-expanded', 'false');
      }, 300);
    }
  });

  // Close menu when clicking nav links
  const mobileNavLinks = mobileMenu.querySelectorAll('.nav-link');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (menuOpen) {
        // Smooth close animation
        mobileMenu.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        mobileMenu.style.opacity = '0';
        mobileMenu.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
          mobileMenu.classList.add('hidden');
          mobileMenu.classList.remove('flex');
          menuBtn.textContent = 'Menu';
          menuBtn.setAttribute('aria-expanded', 'false');
          menuOpen = false;
        }, 300);
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (menuOpen && !menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      mobileMenu.style.opacity = '0';
      mobileMenu.style.transform = 'translateY(-10px)';
      
      setTimeout(() => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        menuBtn.textContent = 'Menu';
        menuBtn.setAttribute('aria-expanded', 'false');
        menuOpen = false;
      }, 300);
    }
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
      // Add staggered animation delay for multiple elements
      const delay = Array.from(entry.target.parentElement?.children || [])
        .indexOf(entry.target) * 100;
      
      setTimeout(() => {
        entry.target.classList.add('show');
      }, delay);

      // Unobserve for performance after animation
      setTimeout(() => {
        revealObserver.unobserve(entry.target);
      }, 1000);
    }
  });
}, observerOptions);

// Initialize reveal animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  // Add slight delay to prevent flash
  setTimeout(() => {
    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  }, 100);
});

// Enhanced Video Player with professional controls
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
  let userInteracted = false;

  // Update play/pause state
  const updatePlayState = () => {
    isPlaying = !video.paused;
    card.classList.toggle('paused', video.paused);
    btn.textContent = video.paused ? '▶ Play Demo' : '⏸ Pause';
    btn.setAttribute('aria-label', video.paused ? 'Play project demonstration video' : 'Pause video');
  };

  // Handle video loading states
  video.addEventListener('loadstart', () => {
    btn.textContent = '⏳ Loading...';
    btn.disabled = true;
  });

  video.addEventListener('canplay', () => {
    btn.disabled = false;
    updatePlayState();
  });

  // Auto-play attempt (respects browser policies)
  const attemptAutoplay = async () => {
    try {
      video.muted = true; // Ensure muted for autoplay
      await video.play();
      hasStarted = true;
      updatePlayState();
      console.log('Video autoplay successful');
    } catch (error) {
      console.log('Autoplay prevented by browser policy - user interaction required');
      updatePlayState();
    }
  };

  // Click handlers for video control
  const toggleVideo = async (e) => {
    e?.stopPropagation();
    userInteracted = true;

    try {
      if (video.paused) {
        await video.play();
        if (!hasStarted) {
          hasStarted = true;
          console.log('Video first play by user interaction');
        }
      } else {
        video.pause();
      }
      updatePlayState();
    } catch (error) {
      console.warn('Video play failed:', error);
    }
  };

  // Event listeners
  card.addEventListener('click', (e) => {
    if (e.target === btn) return;
    toggleVideo(e);
  });

  btn.addEventListener('click', toggleVideo);

  // Keyboard accessibility
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleVideo();
    }
  });

  // Video event listeners
  video.addEventListener('ended', () => {
    updatePlayState();
    console.log('Video playback completed');
  });

  video.addEventListener('play', updatePlayState);
  video.addEventListener('pause', updatePlayState);
  
  video.addEventListener('error', (e) => {
    console.error('Video error:', e);
    btn.textContent = '❌ Error';
    btn.disabled = true;
  });

  // Volume control (keep muted for better UX)
  video.addEventListener('volumechange', () => {
    if (video.volume > 0) {
      video.muted = true; // Force muted for better user experience
    }
  });

  // Initialize video
  updatePlayState();

  // Attempt autoplay after a short delay
  setTimeout(() => {
    if (!userInteracted) {
      attemptAutoplay();
    }
  }, 1500);

  console.log('Video player initialized successfully');
})();

// Enhanced Smooth Scrolling with performance optimization
function initializeSmoothScrolling() {
  let isScrolling = false;

  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    e.preventDefault();
    
    if (isScrolling) return; // Prevent multiple scroll operations
    
    const targetId = anchor.getAttribute('href');
    const target = document.querySelector(targetId);

    if (target) {
      isScrolling = true;
      
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      // Use smooth scrolling with callback
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Reset scrolling flag after animation completes
      setTimeout(() => {
        isScrolling = false;
      }, 1000);

      console.log(`Smooth scroll to: ${targetId}`);
    }
  });
}

// Enhanced Navbar Scroll Effects
function initializeNavbarEffects() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScrollTop = 0;
  let scrollTimer = null;

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add/remove scrolled class based on position
    if (scrollTop > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Optional: Hide/show navbar based on scroll direction
    if (scrollTop > lastScrollTop && scrollTop > 200) {
      // Scrolling down - could hide navbar if desired
      navbar.style.transform = 'translateY(-5px)';
    } else {
      // Scrolling up - show navbar
      navbar.style.transform = 'translateY(0)';
    }

    lastScrollTop = scrollTop;

    // Clear any existing timer
    if (scrollTimer) {
      clearTimeout(scrollTimer);
    }

    // Set timer to reset navbar transform after scrolling stops
    scrollTimer = setTimeout(() => {
      navbar.style.transform = 'translateY(0)';
    }, 150);
  };

  // Throttled scroll listener for better performance
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// Enhanced Page Load Performance and Initialization
window.addEventListener('load', () => {
  // Initialize all features
  createParticles();
  initializeSmoothScrolling();
  initializeNavbarEffects();

  // Show initial hero content with staggered animation
  setTimeout(() => {
    const heroLeft = document.querySelector('.reveal-left');
    if (heroLeft) heroLeft.classList.add('show');
  }, 300);

  setTimeout(() => {
    const heroRight = document.querySelector('.reveal-right');
    if (heroRight) heroRight.classList.add('show');
  }, 500);

  // Performance logging (development only)
  if ('performance' in window) {
    const perfData = performance.getEntriesByType('navigation')[0];
    if (perfData) {
      const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
      const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
      
      console.log(`Page Performance: Load time: ${Math.round(loadTime)}ms, DOM ready: ${Math.round(domContentLoaded)}ms`);
    }
  }

  console.log('Portfolio website loaded successfully - Clean version without tracking');
});

// Enhanced Error Handling
window.addEventListener('error', (event) => {
  console.error('JavaScript Error:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', {
    reason: event.reason,
    stack: event.reason?.stack
  });
});

// Utility Functions
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

function throttle(func, limit = 100) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Device and Performance Detection
function getDeviceCapabilities() {
  const capabilities = {
    isMobile: /Mobi|Android|iPhone|iPad/.test(navigator.userAgent),
    isTablet: /iPad|Tablet/.test(navigator.userAgent),
    hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    cores: navigator.hardwareConcurrency || 4,
    connection: navigator.connection?.effectiveType || 'unknown',
    memory: navigator.deviceMemory || 'unknown',
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };

  console.log('Device Capabilities:', capabilities);
  return capabilities;
}

// Initialize device detection
const deviceCaps = getDeviceCapabilities();

// Adjust animations based on device capabilities
if (deviceCaps.reducedMotion) {
  document.documentElement.style.setProperty('--transition-smooth', 'none');
  document.documentElement.style.setProperty('--transition-spring', 'none');
  console.log('Reduced motion preferences detected - animations disabled');
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

// Advanced Scroll Depth and Reading Progress
function initializeScrollProgress() {
  const progressIndicator = document.createElement('div');
  progressIndicator.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #00ffff, #ff00ff, #00ff00);
    background-size: 200% 100%;
    animation: gradientShift 3s ease-in-out infinite;
    z-index: 9999;
    transition: width 0.1s ease;
  `;
  document.body.appendChild(progressIndicator);

  const updateProgress = throttle(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;
    
    progressIndicator.style.width = Math.min(scrollPercent, 100) + '%';
  }, 16); // ~60fps

  window.addEventListener('scroll', updateProgress, { passive: true });
  console.log('Scroll progress indicator initialized');
}

// Enhanced Form Handling (for future contact forms)
function initializeFormHandling() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn?.textContent;
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        submitBtn.style.opacity = '0.7';
      }

      // Simulate form processing
      try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        console.log('Form data prepared:', data);
        
        // Add your form submission logic here
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Success feedback
        if (submitBtn) {
          submitBtn.textContent = 'Sent Successfully!';
          submitBtn.style.background = 'linear-gradient(135deg, #00ff00, #00ffff)';
        }
        
        form.reset();
        
      } catch (error) {
        console.error('Form submission error:', error);
        
        if (submitBtn) {
          submitBtn.textContent = 'Error - Try Again';
          submitBtn.style.background = 'linear-gradient(135deg, #ff0000, #ff00ff)';
        }
      } finally {
        // Reset button after 3 seconds
        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.style.opacity = '1';
            submitBtn.style.background = '';
          }
        }, 3000);
      }
    });

    // Real-time form validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', validateInput);
      input.addEventListener('input', debounce(validateInput, 500));
    });
  });
}

function validateInput(e) {
  const input = e.target;
  const value = input.value.trim();
  
  // Remove existing validation styles
  input.classList.remove('valid', 'invalid');
  
  // Basic validation rules
  let isValid = true;
  
  if (input.required && !value) {
    isValid = false;
  }
  
  if (input.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    isValid = emailRegex.test(value);
  }
  
  if (input.type === 'tel' && value) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    isValid = phoneRegex.test(value.replace(/\s/g, ''));
  }
  
  // Apply validation styles
  input.classList.add(isValid ? 'valid' : 'invalid');
  
  // Show validation message
  let message = input.nextElementSibling;
  if (!message || !message.classList.contains('validation-message')) {
    message = document.createElement('div');
    message.className = 'validation-message';
    input.parentNode.insertBefore(message, input.nextSibling);
  }
  
  if (!isValid) {
    if (input.required && !value) {
      message.textContent = 'This field is required';
    } else if (input.type === 'email') {
      message.textContent = 'Please enter a valid email address';
    } else if (input.type === 'tel') {
      message.textContent = 'Please enter a valid phone number';
    }
    message.style.color = '#ff0066';
  } else {
    message.textContent = '';
  }
}

// Advanced Performance Monitoring
function initializePerformanceMonitoring() {
  if (!('PerformanceObserver' in window)) {
    console.log('PerformanceObserver not supported');
    return;
  }

  // Core Web Vitals Monitoring
  const vitals = {
    lcp: null,
    fid: null,
    cls: null
  };

  // Largest Contentful Paint (LCP)
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    vitals.lcp = lastEntry.startTime;
    console.log('LCP:', vitals.lcp + 'ms');
  });

  try {
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    console.log('LCP monitoring not supported');
  }

  // First Input Delay (FID)
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach(entry => {
      vitals.fid = entry.processingStart - entry.startTime;
      console.log('FID:', vitals.fid + 'ms');
    });
  });

  try {
    fidObserver.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    console.log('FID monitoring not supported');
  }

  // Cumulative Layout Shift (CLS)
  let clsScore = 0;
  const clsObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach(entry => {
      if (!entry.hadRecentInput) {
        clsScore += entry.value;
      }
    });
    vitals.cls = clsScore;
    console.log('CLS:', vitals.cls);
  });

  try {
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    console.log('CLS monitoring not supported');
  }

  // Memory Usage Monitoring
  if ('memory' in performance) {
    const logMemoryUsage = () => {
      const memory = performance.memory;
      console.log('Memory Usage:', {
        used: Math.round(memory.usedJSHeapSize / 1048576) + 'MB',
        total: Math.round(memory.totalJSHeapSize / 1048576) + 'MB',
        limit: Math.round(memory.jsHeapSizeLimit / 1048576) + 'MB'
      });
    };
    
    // Log memory usage every 30 seconds
    setInterval(logMemoryUsage, 30000);
    setTimeout(logMemoryUsage, 5000); // Initial log after 5 seconds
  }
}

// Advanced Image Lazy Loading and Optimization
function initializeImageOptimization() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Add loading animation
          img.style.opacity = '0';
          img.style.transition = 'opacity 0.3s ease';
          
          // Handle image loading
          const handleLoad = () => {
            img.style.opacity = '1';
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          };
          
          const handleError = () => {
            img.style.opacity = '0.5';
            img.alt = 'Image failed to load';
            imageObserver.unobserve(img);
          };
          
          img.addEventListener('load', handleLoad);
          img.addEventListener('error', handleError);
          
          // If image is already cached and loaded
          if (img.complete) {
            handleLoad();
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });

    // Observe all images
    document.querySelectorAll('img').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// Enhanced Keyboard Navigation
function initializeKeyboardNavigation() {
  let focusableElements = [];
  let currentFocusIndex = -1;

  const updateFocusableElements = () => {
    focusableElements = Array.from(document.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(el => {
      return el.offsetWidth > 0 && el.offsetHeight > 0 && !el.hidden;
    });
  };

  document.addEventListener('keydown', (e) => {
    // Skip if user is typing in an input
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
      return;
    }

    switch (e.key) {
      case 'Tab':
        updateFocusableElements();
        break;
        
      case 'Escape':
        // Close mobile menu if open
        if (menuOpen) {
          document.getElementById('menuBtn')?.click();
        }
        // Remove focus from current element
        document.activeElement?.blur();
        break;
        
      case 'Enter':
      case ' ':
        // Activate focused element if it's not naturally clickable
        if (e.target.classList.contains('project-card')) {
          e.preventDefault();
          e.target.click();
        }
        break;
    }
  });

  // Focus management for better accessibility
  document.addEventListener('focusin', (e) => {
    updateFocusableElements();
    currentFocusIndex = focusableElements.indexOf(e.target);
  });
}

// Theme and Preference Management
function initializeThemeManager() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  // Handle color scheme changes
  const handleColorSchemeChange = (e) => {
    console.log('Color scheme preference:', e.matches ? 'dark' : 'light');
    // Theme is already dark by default, but you can add light theme logic here
  };
  
  // Handle motion preference changes
  const handleMotionPreferenceChange = (e) => {
    const root = document.documentElement;
    if (e.matches) {
      root.style.setProperty('--transition-smooth', 'none');
      root.style.setProperty('--transition-spring', 'none');
      root.style.setProperty('--transition-bounce', 'none');
      console.log('Reduced motion preferences applied');
    } else {
      root.style.removeProperty('--transition-smooth');
      root.style.removeProperty('--transition-spring');
      root.style.removeProperty('--transition-bounce');
      console.log('Full animations restored');
    }
  };

  prefersDark.addListener(handleColorSchemeChange);
  prefersReducedMotion.addListener(handleMotionPreferenceChange);
  
  // Initial setup
  handleColorSchemeChange(prefersDark);
  handleMotionPreferenceChange(prefersReducedMotion);
}

// Advanced Network Status Monitoring
function initializeNetworkMonitoring() {
  if ('connection' in navigator) {
    const connection = navigator.connection;
    
    const logConnectionInfo = () => {
      console.log('Network Status:', {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink + ' Mbps',
        rtt: connection.rtt + 'ms',
        saveData: connection.saveData
      });
    };
    
    connection.addEventListener('change', () => {
      logConnectionInfo();
      
      // Adjust particle count based on connection speed
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        // Reduce particles for slow connections
        createParticles();
      }
    });
    
    // Initial log
    logConnectionInfo();
  }

  // Online/Offline status
  const handleOnline = () => {
    console.log('Connection restored');
    document.body.classList.remove('offline');
  };
  
  const handleOffline = () => {
    console.log('Connection lost');
    document.body.classList.add('offline');
  };
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  // Check initial status
  if (!navigator.onLine) {
    handleOffline();
  }
}

// Professional Service Worker Registration (for caching)
function initializeServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        // Only register if service worker file exists
        const response = await fetch('/sw.js', { method: 'HEAD' });
        if (response.ok) {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered successfully:', registration.scope);
          
          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('New content available, please refresh');
                }
              });
            }
          });
        }
      } catch (error) {
        console.log('Service Worker registration skipped:', error.message);
      }
    });
  }
}

// Enhanced User Experience Features
function initializeUXEnhancements() {
  // Add smooth focus transitions
  const style = document.createElement('style');
  style.textContent = `
    .validation-message {
      font-size: 0.875rem;
      margin-top: 0.25rem;
      transition: opacity 0.3s ease;
    }
    
    input.valid, textarea.valid {
      border-color: #00ff00 !important;
      box-shadow: 0 0 10px rgba(0, 255, 0, 0.2) !important;
    }
    
    input.invalid, textarea.invalid {
      border-color: #ff0066 !important;
      box-shadow: 0 0 10px rgba(255, 0, 102, 0.2) !important;
    }
    
    .offline {
      filter: grayscale(50%);
    }
    
    .offline::after {
      content: "You're offline";
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(255, 0, 0, 0.9);
      color: white;
      padding: 10px 15px;
      border-radius: 5px;
      font-size: 14px;
      z-index: 10000;
    }
  `;
  document.head.appendChild(style);
  
  // Add loading states for external links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="http"]');
    if (link && link.target === '_blank') {
      const originalText = link.textContent;
      link.textContent = 'Opening...';
      link.style.opacity = '0.7';
      
      setTimeout(() => {
        link.textContent = originalText;
        link.style.opacity = '1';
      }, 2000);
    }
  });
}

// Initialize All Advanced Features
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit to ensure page is ready
  setTimeout(() => {
    initializeScrollProgress();
    initializeFormHandling();
    initializeImageOptimization();
    initializeKeyboardNavigation();
    initializeThemeManager();
    initializeNetworkMonitoring();
    initializeUXEnhancements();
    initializePerformanceMonitoring();
    initializeServiceWorker();
    
    console.log('All advanced features initialized successfully');
  }, 1000);
});

// Page Visibility API for performance optimization
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden - pause non-essential animations
    document.querySelectorAll('.particle').forEach(particle => {
      particle.style.animationPlayState = 'paused';
    });
    console.log('Page hidden - animations paused');
  } else {
    // Page is visible - resume animations
    document.querySelectorAll('.particle').forEach(particle => {
      particle.style.animationPlayState = 'running';
    });
    console.log('Page visible - animations resumed');
  }
});

// Battery API for power-aware features
if ('getBattery' in navigator) {
  navigator.getBattery().then((battery) => {
    const handleBatteryChange = () => {
      const level = Math.round(battery.level * 100);
      console.log(`Battery: ${level}% (${battery.charging ? 'charging' : 'not charging'})`);
      
      // Reduce animations if battery is low and not charging
      if (level < 20 && !battery.charging) {
        document.documentElement.style.setProperty('--transition-smooth', 'none');
        console.log('Low battery detected - animations reduced');
      }
    };
    
    battery.addEventListener('chargingchange', handleBatteryChange);
    battery.addEventListener('levelchange', handleBatteryChange);
    handleBatteryChange(); // Initial check
  }).catch(() => {
    console.log('Battery API not supported');
  });
}

// Final Performance Summary
setTimeout(() => {
  if ('performance' in window) {
    const timing = performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
    const firstPaint = performance.getEntriesByType('paint')[0]?.startTime || 'N/A';
    
    console.log('🚀 Portfolio Performance Summary:', {
      'Total Load Time': loadTime + 'ms',
      'DOM Ready': domReady + 'ms', 
      'First Paint': firstPaint + 'ms',
      'Status': 'All systems operational'
    });
  }
}, 3000);