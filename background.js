// Background service worker for AI integration

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'generateSummary') {
        handleGenerateSummary(message.transcript, sender.tab.id);
    } else if (message.action === 'fetchGeminiModels') {
        fetchGeminiModels(message.apiKey)
            .then(models => {
                sendResponse({ models: models });
            })
            .catch(error => {
                console.error('Error in fetchGeminiModels:', error);
                sendResponse({ models: null, error: error.message });
            });
        return true; // Keep the message channel open for async response
    }
});

async function handleGenerateSummary(transcript, tabId) {
    try {
        // Get settings
        const settings = await chrome.storage.sync.get(['aiProvider', 'apiKey', 'model']);
        
        if (!settings.apiKey) {
            console.error('No API key configured');
            return;
        }
        
        const summary = await generateAISummary(
            transcript,
            settings.aiProvider || 'openai',
            settings.apiKey,
            settings.model
        );
        
        // Save summary
        await chrome.storage.local.set({
            meetingNotes: summary,
            lastSummaryGenerated: new Date().toISOString()
        });
        
        // Notify content script
        chrome.tabs.sendMessage(tabId, {
            action: 'summaryGenerated',
            summary: summary
        });
        
        console.log('Summary generated successfully');
    } catch (error) {
        console.error('Error generating summary:', error);
    }
}

async function generateAISummary(transcript, provider, apiKey, model) {
    const prompt = `Please analyze this meeting transcript and provide:

1. A concise summary of the meeting
2. Key points discussed
3. Action items (if any)
4. Important decisions made
5. Next steps or follow-ups

Transcript:
${transcript}

Please format the response in a clear, organized manner with headers and bullet points.`;

    switch (provider) {
        case 'openai':
            return await callOpenAI(prompt, apiKey, model);
        case 'anthropic':
            return await callAnthropic(prompt, apiKey, model);
        case 'gemini':
            return await callGemini(prompt, apiKey, model);
        default:
            throw new Error('Unsupported AI provider');
    }
}

async function callOpenAI(prompt, apiKey, model) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: model || 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that creates clear, organized meeting summaries and notes.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 2000
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
}

async function callAnthropic(prompt, apiKey, model) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: model || 'claude-3-sonnet-20240229',
            max_tokens: 2000,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Anthropic API error: ${error.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.content[0].text;
}

async function callGemini(prompt, apiKey, model) {
    const modelName = model || 'gemini-2.0-flash-exp';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2000
            }
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

// Fetch available Gemini models from the API
async function fetchGeminiModels(apiKey) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, {
            method: 'GET'
        });
        
        if (!response.ok) {
            console.error('Failed to fetch Gemini models');
            return null;
        }
        
        const data = await response.json();
        
        // Filter models that support generateContent
        if (!data.models || !Array.isArray(data.models)) {
            console.error('Invalid response format from Gemini API:', data);
            return null;
        }
        
        const supportedModels = data.models
            .filter(model => 
                model.supportedGenerationMethods && 
                model.supportedGenerationMethods.includes('generateContent')
            )
            .map(model => {
                const modelName = model.name.replace('models/', '');
                return {
                    value: modelName,
                    label: model.displayName || modelName
                };
            });
        
        return supportedModels;
    } catch (error) {
        console.error('Error fetching Gemini models:', error);
        return null;
    }
}

// Install/Update handler
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('Google Meet AI Note Taker installed');
        // Open welcome page or settings
        chrome.tabs.create({
            url: chrome.runtime.getURL('popup.html')
        });
    }
});
