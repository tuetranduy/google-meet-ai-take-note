// Model configurations for different AI providers
const AI_MODELS = {
    openai: [
        { value: 'gpt-4', label: 'GPT-4' },
        { value: 'gpt-4-turbo-preview', label: 'GPT-4 Turbo' },
        { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
    ],
    anthropic: [
        { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
        { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
        { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' }
    ],
    gemini: [
        { value: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash (Experimental)' },
        { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
        { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' }
    ]
};

// Store fetched Gemini models
let fetchedGeminiModels = null;

// Load saved settings when popup opens
document.addEventListener('DOMContentLoaded', async () => {
    const settings = await chrome.storage.sync.get(['aiProvider', 'apiKey', 'model']);
    
    if (settings.aiProvider) {
        document.getElementById('ai-provider').value = settings.aiProvider;
        await updateModelOptions(settings.aiProvider);
    } else {
        await updateModelOptions('openai');
    }
    
    if (settings.apiKey) {
        document.getElementById('api-key').value = settings.apiKey;
    }
    
    if (settings.model) {
        document.getElementById('model').value = settings.model;
    }
});

// Update model dropdown based on selected provider
document.getElementById('ai-provider').addEventListener('change', async (e) => {
    await updateModelOptions(e.target.value);
});

async function updateModelOptions(provider) {
    const modelSelect = document.getElementById('model');
    modelSelect.innerHTML = '<option value="">Loading models...</option>';
    
    let models = AI_MODELS[provider] || AI_MODELS.openai;
    
    // If Gemini is selected and we have an API key, try to fetch models from API
    if (provider === 'gemini') {
        const settings = await chrome.storage.sync.get(['apiKey']);
        if (settings.apiKey) {
            try {
                const response = await chrome.runtime.sendMessage({
                    action: 'fetchGeminiModels',
                    apiKey: settings.apiKey
                });
                
                if (response && response.models && response.models.length > 0) {
                    fetchedGeminiModels = response.models;
                    models = response.models;
                    console.log('Fetched Gemini models from API:', models);
                }
            } catch (error) {
                console.error('Failed to fetch Gemini models, using defaults:', error);
            }
        }
    }
    
    modelSelect.innerHTML = '';
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.value;
        option.textContent = model.label;
        modelSelect.appendChild(option);
    });
}

// Toggle API key visibility
document.getElementById('toggle-key').addEventListener('click', () => {
    const apiKeyInput = document.getElementById('api-key');
    const toggleBtn = document.getElementById('toggle-key');
    
    if (apiKeyInput.type === 'password') {
        apiKeyInput.type = 'text';
        toggleBtn.textContent = 'Hide';
    } else {
        apiKeyInput.type = 'password';
        toggleBtn.textContent = 'Show';
    }
});

// Save settings
document.getElementById('save-settings').addEventListener('click', async () => {
    const provider = document.getElementById('ai-provider').value;
    const apiKey = document.getElementById('api-key').value;
    const model = document.getElementById('model').value;
    
    if (!apiKey) {
        showStatus('Please enter an API key', 'error');
        return;
    }
    
    try {
        await chrome.storage.sync.set({
            aiProvider: provider,
            apiKey: apiKey,
            model: model
        });
        
        // If Gemini provider and we have an API key, refresh models
        if (provider === 'gemini') {
            await updateModelOptions(provider);
        }
        
        showStatus('Settings saved successfully!', 'success');
    } catch (error) {
        showStatus('Error saving settings: ' + error.message, 'error');
    }
});

// View current meeting notes
document.getElementById('view-notes').addEventListener('click', async () => {
    try {
        const result = await chrome.storage.local.get(['meetingNotes', 'meetingTranscript']);
        
        if (!result.meetingNotes && !result.meetingTranscript) {
            showStatus('No meeting notes available. Join a Google Meet with captions enabled.', 'error');
            return;
        }
        
        // Open notes in a new window
        chrome.windows.create({
            url: chrome.runtime.getURL('notes.html'),
            type: 'popup',
            width: 800,
            height: 600
        });
    } catch (error) {
        showStatus('Error viewing notes: ' + error.message, 'error');
    }
});

// Clear all notes
document.getElementById('clear-notes').addEventListener('click', async () => {
    if (confirm('Are you sure you want to clear all meeting notes?')) {
        try {
            await chrome.storage.local.remove(['meetingNotes', 'meetingTranscript', 'meetingTitle', 'meetingDate']);
            showStatus('All notes cleared successfully!', 'success');
        } catch (error) {
            showStatus('Error clearing notes: ' + error.message, 'error');
        }
    }
});

function showStatus(message, type) {
    const statusDiv = document.getElementById('status-message');
    statusDiv.textContent = message;
    statusDiv.className = `status-message ${type}`;
    
    setTimeout(() => {
        statusDiv.className = 'status-message';
    }, 5000);
}
