import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Expertise from './components/Expertise';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Particles from './components/Particles';
import VoiceWidget from './components/VoiceWidget';
import { sendTrackingData } from './utils/tracking';

function App() {
  useEffect(() => {
    // Initial page load tracking
    sendTrackingData('pageview', 'Portfolio website loaded');

    // Performance monitoring
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
          const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
          const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;

          sendTrackingData('page_performance', 'Page loaded', {
            loadTime: Math.round(loadTime),
            domContentLoaded: Math.round(domContentLoaded)
          });
        }
      });
    }

    // Console branding
    console.log(
      '%c🚀 Professional Portfolio by amandesignser %c\n' +
      '%cBuilt with modern web technologies and performance optimization\n' +
      '%cFeel free to explore the code and connect with me!\n' +
      '%c📧 amanbarnd@gmail.com',
      'color: #00ffff; font-size: 16px; font-weight: bold;',
      'color: #ffffff;',
      'color: #ff00ff; font-size: 12px;',
      'color: #00ff00; font-size: 12px;'
    );
  }, []);

  return (
    <div className="App">
      <Particles />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Expertise />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
      <VoiceWidget />
    </div>
  );
}

export default App;
