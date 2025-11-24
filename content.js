// Content script to capture Google Meet captions and transcripts

let captionObserver = null;
let transcriptText = [];
let lastCaptionTime = Date.now();
let meetingTitle = '';
let isCapturing = false;

// Initialize when the page loads
function initialize() {
    console.log('Google Meet AI Note Taker: Initializing...');
    
    // Get meeting title
    const titleElement = document.querySelector('[data-meeting-title]') || 
                        document.querySelector('h1[class*="title"]');
    if (titleElement) {
        meetingTitle = titleElement.textContent.trim();
    }
    
    // Wait for captions to be enabled
    startCaptionCapture();
    
    // Add UI indicator
    addMeetingIndicator();
}

function addMeetingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'ai-note-taker-indicator';
    indicator.innerHTML = `
        <div style="position: fixed; bottom: 20px; right: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; padding: 12px 20px; border-radius: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); 
                    z-index: 10000; font-family: Arial, sans-serif; font-size: 14px; display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">🤖</span>
            <span id="indicator-text">AI Note Taker Ready</span>
        </div>
    `;
    document.body.appendChild(indicator);
}

function updateIndicator(text, color) {
    const indicatorText = document.getElementById('indicator-text');
    if (indicatorText) {
        indicatorText.textContent = text;
        const indicator = document.getElementById('ai-note-taker-indicator');
        if (indicator && color) {
            indicator.firstElementChild.style.background = color;
        }
    }
}

function startCaptionCapture() {
    // Look for caption container - Google Meet uses different selectors
    const captionSelectors = [
        '[jsname="YSxPC"]', // Main caption container
        '[jsname="tgaKEf"]', // Alternative caption container
        '.a4cQT', // Caption text class
        '[class*="caption"]'
    ];
    
    let captionContainer = null;
    for (const selector of captionSelectors) {
        captionContainer = document.querySelector(selector);
        if (captionContainer) {
            console.log('Found caption container with selector:', selector);
            break;
        }
    }
    
    if (!captionContainer) {
        // Captions might not be enabled yet, try again later
        setTimeout(startCaptionCapture, 2000);
        return;
    }
    
    isCapturing = true;
    updateIndicator('Capturing captions...', 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)');
    
    // Observe changes to caption container
    captionObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const captionText = node.textContent.trim();
                    if (captionText && captionText.length > 0) {
                        handleNewCaption(captionText);
                    }
                }
            });
            
            // Also check for text changes
            if (mutation.type === 'characterData' || mutation.type === 'childList') {
                const captionText = mutation.target.textContent?.trim() || 
                                  mutation.target.parentElement?.textContent?.trim();
                if (captionText && captionText.length > 0) {
                    handleNewCaption(captionText);
                }
            }
        });
    });
    
    captionObserver.observe(captionContainer, {
        childList: true,
        subtree: true,
        characterData: true
    });
    
    // Also set up periodic save
    setInterval(saveTranscript, 30000); // Save every 30 seconds
}

function handleNewCaption(caption) {
    lastCaptionTime = Date.now();
    
    // Avoid duplicates
    if (transcriptText.length > 0 && transcriptText[transcriptText.length - 1] === caption) {
        return;
    }
    
    transcriptText.push(caption);
    console.log('Captured caption:', caption);
    
    // Save to storage periodically
    if (transcriptText.length % 10 === 0) {
        saveTranscript();
    }
}

async function saveTranscript() {
    if (transcriptText.length === 0) {
        return;
    }
    
    const fullTranscript = transcriptText.join(' ');
    
    try {
        await chrome.storage.local.set({
            meetingTranscript: fullTranscript,
            meetingTitle: meetingTitle || 'Google Meet',
            meetingDate: new Date().toISOString(),
            lastUpdated: Date.now()
        });
        
        console.log('Transcript saved:', transcriptText.length, 'captions');
        
        // Request AI summary if enough content
        if (transcriptText.length >= 20) {
            requestAISummary();
        }
    } catch (error) {
        console.error('Error saving transcript:', error);
    }
}

async function requestAISummary() {
    try {
        // Send message to background script to generate summary
        chrome.runtime.sendMessage({
            action: 'generateSummary',
            transcript: transcriptText.join(' ')
        });
    } catch (error) {
        console.error('Error requesting summary:', error);
    }
}

// Detect when meeting ends
function detectMeetingEnd() {
    const checkInterval = setInterval(() => {
        const timeSinceLastCaption = Date.now() - lastCaptionTime;
        
        // If no captions for 2 minutes, consider meeting ended
        if (timeSinceLastCaption > 120000 && transcriptText.length > 0) {
            console.log('Meeting appears to have ended');
            saveTranscript();
            requestAISummary();
            updateIndicator('Meeting ended - Summary generated', 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)');
            clearInterval(checkInterval);
        }
    }, 30000);
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'summaryGenerated') {
        updateIndicator('AI Summary Ready!', 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)');
    }
});

// Start initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

// Start monitoring for meeting end
detectMeetingEnd();

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (captionObserver) {
        captionObserver.disconnect();
    }
    saveTranscript();
});
