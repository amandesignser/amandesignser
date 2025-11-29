import React, { useEffect } from 'react';

const VoiceWidget = () => {
    useEffect(() => {
        // Dynamically load the script if not already present
        const scriptId = 'elevenlabs-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed@beta";
            script.async = true;
            script.type = "text/javascript";
            document.body.appendChild(script);
        }
    }, []);

    return (
        <div id="voice-widget-container">
            <elevenlabs-convai agent-id="agent_0801kb5prt6xf0h88newvzwrazy2"></elevenlabs-convai>
        </div>
    );
};

export default VoiceWidget;
