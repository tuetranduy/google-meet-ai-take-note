// Load and display meeting notes

document.addEventListener('DOMContentLoaded', loadNotes);

// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        switchTab(targetTab);
    });
});

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

async function loadNotes() {
    try {
        const data = await chrome.storage.local.get([
            'meetingNotes',
            'meetingTranscript',
            'meetingTitle',
            'meetingDate'
        ]);
        
        // Update meeting info
        if (data.meetingTitle) {
            document.getElementById('meeting-title').textContent = data.meetingTitle;
        } else {
            document.getElementById('meeting-title').textContent = 'Untitled Meeting';
        }
        
        if (data.meetingDate) {
            const date = new Date(data.meetingDate);
            document.getElementById('meeting-date').textContent = date.toLocaleString();
        } else {
            document.getElementById('meeting-date').textContent = 'Unknown';
        }
        
        // Display summary
        const summaryContent = document.getElementById('summary-content');
        if (data.meetingNotes) {
            summaryContent.innerHTML = formatMarkdown(data.meetingNotes);
        } else if (data.meetingTranscript) {
            summaryContent.innerHTML = '<div class="loading">AI summary is being generated... Please wait a moment and refresh.</div>';
        } else {
            summaryContent.innerHTML = `
                <div class="no-notes">
                    <div class="no-notes-icon">📭</div>
                    <p>No meeting notes available yet.</p>
                    <p>Join a Google Meet meeting and enable captions to start capturing notes.</p>
                </div>
            `;
        }
        
        // Display transcript
        const transcriptContent = document.getElementById('transcript-content');
        if (data.meetingTranscript) {
            transcriptContent.innerHTML = `<div class="transcript-text">${escapeHtml(data.meetingTranscript)}</div>`;
        } else {
            transcriptContent.innerHTML = `
                <div class="no-notes">
                    <div class="no-notes-icon">📭</div>
                    <p>No transcript available yet.</p>
                    <p>Join a Google Meet meeting and enable captions to start capturing the transcript.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading notes:', error);
        showError('Error loading notes: ' + error.message);
    }
}

// Copy notes to clipboard
document.getElementById('copy-notes').addEventListener('click', async () => {
    try {
        const activeTab = document.querySelector('.tab.active').dataset.tab;
        let textToCopy = '';
        
        const data = await chrome.storage.local.get(['meetingNotes', 'meetingTranscript', 'meetingTitle', 'meetingDate']);
        
        if (activeTab === 'summary' && data.meetingNotes) {
            textToCopy = `Meeting: ${data.meetingTitle || 'Untitled'}\nDate: ${new Date(data.meetingDate).toLocaleString()}\n\n${data.meetingNotes}`;
        } else if (activeTab === 'transcript' && data.meetingTranscript) {
            textToCopy = `Meeting: ${data.meetingTitle || 'Untitled'}\nDate: ${new Date(data.meetingDate).toLocaleString()}\n\nTranscript:\n${data.meetingTranscript}`;
        }
        
        if (textToCopy) {
            await navigator.clipboard.writeText(textToCopy);
            showNotification('Copied to clipboard!');
        } else {
            showNotification('No content to copy');
        }
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        showNotification('Failed to copy');
    }
});

// Download notes as text file
document.getElementById('download-notes').addEventListener('click', async () => {
    try {
        const data = await chrome.storage.local.get(['meetingNotes', 'meetingTranscript', 'meetingTitle', 'meetingDate']);
        
        const title = data.meetingTitle || 'Meeting';
        const date = data.meetingDate ? new Date(data.meetingDate).toLocaleString() : 'Unknown date';
        
        let content = `Meeting: ${title}\nDate: ${date}\n\n`;
        
        if (data.meetingNotes) {
            content += '=== AI SUMMARY ===\n\n' + data.meetingNotes + '\n\n';
        }
        
        if (data.meetingTranscript) {
            content += '=== FULL TRANSCRIPT ===\n\n' + data.meetingTranscript;
        }
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `meeting-notes-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Notes downloaded!');
    } catch (error) {
        console.error('Error downloading notes:', error);
        showNotification('Failed to download');
    }
});

// Refresh notes
document.getElementById('refresh-notes').addEventListener('click', () => {
    loadNotes();
    showNotification('Notes refreshed!');
});

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showError(message) {
    const summaryContent = document.getElementById('summary-content');
    summaryContent.innerHTML = `<div class="no-notes"><div class="no-notes-icon">⚠️</div><p>${escapeHtml(message)}</p></div>`;
}

function formatMarkdown(text) {
    // Simple markdown formatting
    let formatted = escapeHtml(text);
    
    // Headers
    formatted = formatted.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    formatted = formatted.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    formatted = formatted.replace(/^# (.+)$/gm, '<h2>$1</h2>');
    
    // Bold
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Lists
    formatted = formatted.replace(/^\* (.+)$/gm, '<li>$1</li>');
    formatted = formatted.replace(/^- (.+)$/gm, '<li>$1</li>');
    formatted = formatted.replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>');
    
    // Wrap consecutive list items
    formatted = formatted.replace(/(<li>.*<\/li>\n?)+/g, match => {
        return '<ul>' + match + '</ul>';
    });
    
    // Paragraphs
    formatted = formatted.replace(/\n\n/g, '</p><p>');
    formatted = '<p>' + formatted + '</p>';
    
    // Clean up empty paragraphs
    formatted = formatted.replace(/<p>\s*<\/p>/g, '');
    formatted = formatted.replace(/<p>\s*<ul>/g, '<ul>');
    formatted = formatted.replace(/<\/ul>\s*<\/p>/g, '</ul>');
    formatted = formatted.replace(/<p>\s*<h([23])>/g, '<h$1>');
    formatted = formatted.replace(/<\/h([23])>\s*<\/p>/g, '</h$1>');
    
    return formatted;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
