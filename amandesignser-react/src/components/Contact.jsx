import React from 'react';
import { trackClick } from '../utils/tracking';

const Contact = () => {
    return (
        <section id="contact" className="py-16 mb-16">
            <div className="container">
                <div className="reveal glass p-8 neon-glow text-center show">
                    <h2 className="text-4xl font-extrabold gradient-text mb-4">Let's Create Something Amazing</h2>
                    <p className="text-xl text-gray-300 mb-8">Have a project in mind? Let's discuss how we can bring your vision to life with exceptional web solutions.</p>

                    <div className="flex flex-wrap justify-center gap-4">
                        {/* Primary Contact Button */}
                        <a href="mailto:amanbarnd@gmail.com" className="btn-primary">
                            <span>Start Conversation</span>
                            <span>📧</span>
                        </a>

                        {/* Social Media Links */}
                        <a
                            href="https://www.facebook.com/share/1EcXP6fpg7/"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackClick('Facebook')}
                            className="btn-secondary"
                            aria-label="Connect on Facebook"
                        >
                            <span>Facebook</span>
                        </a>

                        <a
                            href="https://www.linkedin.com/in/aman-kumar-940bb0233?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackClick('LinkedIn')}
                            className="btn-secondary"
                            aria-label="Connect on LinkedIn"
                        >
                            <span>LinkedIn</span>
                        </a>

                        <a
                            href="https://x.com/amandesignser"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackClick('Twitter')}
                            className="btn-secondary"
                            aria-label="Follow on X (Twitter)"
                        >
                            <span>X (Twitter)</span>
                        </a>

                        <a
                            href="https://instagram.com/amandesignser"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackClick('Instagram')}
                            className="btn-secondary"
                            aria-label="Follow on Instagram"
                        >
                            <span>Instagram</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
