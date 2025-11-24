# Installation Guide

## Quick Start

### Step 1: Get the Extension
1. Clone this repository or download it as a ZIP file
2. If downloaded as ZIP, extract it to a folder on your computer

### Step 2: Load into Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the extension folder
5. The extension will appear with a robot icon 🤖

### Step 3: Configure
1. Click the extension icon in Chrome toolbar
2. Choose your AI provider:
   - **OpenAI**: Get API key at https://platform.openai.com/api-keys
   - **Anthropic**: Get API key at https://console.anthropic.com/
   - **Gemini**: Get API key at https://makersuite.google.com/app/apikey
3. Paste your API key
4. Select your preferred model
5. Click "Save Settings"

### Step 4: Use in Google Meet
1. Join any Google Meet meeting
2. Click the "CC" button to enable captions
3. The extension automatically starts capturing
4. View notes by clicking the extension icon → "View Current Meeting Notes"

## API Keys

### OpenAI (Recommended for Best Quality)
- **Website**: https://platform.openai.com/api-keys
- **Pricing**: Pay per token, ~$0.002-0.03 per 1K tokens
- **Models**: GPT-4, GPT-4 Turbo, GPT-3.5 Turbo
- **Best For**: Highest quality summaries

### Anthropic Claude
- **Website**: https://console.anthropic.com/
- **Pricing**: Pay per token, competitive with OpenAI
- **Models**: Claude 3 Opus, Sonnet, Haiku
- **Best For**: Detailed analysis and longer contexts

### Google Gemini
- **Website**: https://makersuite.google.com/app/apikey
- **Pricing**: Free tier available, then pay-as-you-go
- **Models**: Gemini Pro, Gemini 1.5 Pro
- **Best For**: Good balance, generous free tier

## Troubleshooting

### Extension not appearing after installation
- Make sure Developer mode is enabled
- Try reloading the extension
- Check Chrome console for errors (F12)

### Captions not being captured
- Verify captions are enabled in Google Meet (CC button)
- Refresh the Google Meet page
- Look for the indicator at bottom-right of Meet page

### API errors
- Verify API key is correct (copy-paste carefully)
- Check you have available credits with your AI provider
- Try a different model if one isn't working

### Summary not generating
- Wait 30-60 seconds after meeting starts
- Ensure you have enough caption data (at least 20 captions)
- Click "Refresh" in the notes window

## Privacy Note

This extension:
- ✅ Stores API keys securely in Chrome sync storage
- ✅ Only sends data to your chosen AI provider
- ✅ Does not collect or store data on external servers
- ✅ All processing happens locally in your browser
- ✅ You can clear all data anytime with "Clear All Notes"

## Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Check the main README.md for detailed information
- Review browser console for error messages
