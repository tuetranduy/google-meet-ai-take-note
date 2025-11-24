# 🤖 Google Meet AI Note Taker

An intelligent Chrome extension that automatically captures, transcribes, and summarizes Google Meet meetings using AI. Supports multiple AI providers including OpenAI, Anthropic Claude, and Google Gemini.

## ✨ Features

- **Automatic Caption Capture**: Automatically captures live captions from Google Meet meetings
- **AI-Powered Summaries**: Generates comprehensive meeting summaries with key points, action items, and decisions
- **Multiple AI Providers**: Choose from:
  - OpenAI (GPT-4, GPT-4 Turbo, GPT-3.5)
  - Anthropic (Claude 3 Opus, Sonnet, Haiku)
  - Google Gemini (Gemini Pro, Gemini 1.5 Pro)
- **Full Transcript**: Save and review the complete meeting transcript
- **Easy Export**: Copy to clipboard or download notes as text files
- **Secure API Key Storage**: Your API keys are stored securely in Chrome's sync storage
- **Real-time Indicator**: Visual indicator on Google Meet showing the extension is active

## 📋 Prerequisites

- Google Chrome browser (version 88 or later)
- A Google Meet account
- API key from one of the supported AI providers:
  - **OpenAI**: Get your API key at [platform.openai.com](https://platform.openai.com/api-keys)
  - **Anthropic**: Get your API key at [console.anthropic.com](https://console.anthropic.com/)
  - **Google Gemini**: Get your API key at [makersuite.google.com](https://makersuite.google.com/app/apikey)

## 🚀 Installation

### Option 1: Install from Source (Development Mode)

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/tuetranduy/google-meet-ai-take-note.git
   cd google-meet-ai-take-note
   ```

2. **Open Chrome Extensions page**
   - Open Chrome and navigate to `chrome://extensions/`
   - Or click the three dots menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the extension**
   - Click "Load unpacked"
   - Select the `google-meet-ai-take-note` folder
   - The extension should now appear in your extensions list

5. **Pin the extension** (Optional but recommended)
   - Click the puzzle piece icon in Chrome toolbar
   - Find "Google Meet AI Note Taker" and click the pin icon

## ⚙️ Configuration

1. **Click the extension icon** in your Chrome toolbar

2. **Select your AI Provider**
   - Choose from OpenAI, Anthropic, or Google Gemini

3. **Enter your API Key**
   - Paste your API key from your chosen provider
   - Click the "Show" button to verify you entered it correctly

4. **Select the Model** (Optional)
   - Choose the specific AI model you want to use
   - Default models work great for most use cases

5. **Click "Save Settings"**
   - Your settings will be saved and synced across your Chrome browsers

## 📝 Usage

1. **Join a Google Meet meeting**
   - Go to [meet.google.com](https://meet.google.com) and join any meeting

2. **Enable captions**
   - Click the "CC" (Captions) button in the Google Meet interface
   - Or press 'c' on your keyboard

3. **Start capturing**
   - The extension automatically starts capturing captions
   - You'll see a visual indicator at the bottom-right of the screen showing "AI Note Taker Ready"
   - The indicator will change to "Capturing captions..." when active

4. **View your notes**
   - During or after the meeting, click the extension icon
   - Click "View Current Meeting Notes"
   - A new window will open showing:
     - **AI Summary**: Key points, action items, and decisions
     - **Full Transcript**: Complete meeting transcript

5. **Export your notes**
   - Click "Copy to Clipboard" to copy notes
   - Click "Download as Text" to save as a .txt file

## 🎯 Best Practices

- **Enable captions early**: Start captions at the beginning of the meeting for complete capture
- **Check audio quality**: Better audio quality = better captions = better AI summaries
- **Use GPT-4 or Claude 3 for best results**: These models provide the most accurate summaries
- **Review AI summaries**: Always review AI-generated content for accuracy
- **Save important meetings**: Download notes immediately after important meetings

## 🔒 Privacy & Security

- **Local Processing**: All caption capture happens locally in your browser
- **Secure Storage**: API keys are stored securely using Chrome's sync storage with encryption
- **No Data Collection**: This extension does not collect, store, or transmit your meeting data to any third party
- **Direct API Calls**: Transcripts are sent directly to your chosen AI provider (OpenAI, Anthropic, or Google)
- **You Control Your Data**: You can clear all stored data at any time using the "Clear All Notes" button

## 🛠️ Troubleshooting

### Captions not being captured
- Make sure captions are enabled in Google Meet (click the CC button)
- Refresh the Google Meet page and try again
- Check that the extension is enabled in `chrome://extensions/`

### AI summary not generating
- Verify your API key is correct in the extension settings
- Check your API provider's dashboard for any account issues
- Make sure you have available credits/quota with your AI provider
- Wait a few moments - summaries take 10-30 seconds to generate

### Extension not appearing
- Make sure you loaded the correct folder in `chrome://extensions/`
- Try disabling and re-enabling the extension
- Check the Chrome console for any error messages (F12 → Console)

## 💡 Tips

- **Choose the right model for your needs**:
  - GPT-4: Best quality, more expensive
  - GPT-3.5 Turbo: Fast and cost-effective
  - Claude 3 Opus: Excellent for detailed analysis
  - Gemini Pro: Good balance of speed and quality

- **Save API costs**: The extension automatically saves transcripts every 30 seconds and generates summaries periodically, not on every caption

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Google Meet for the platform
- OpenAI, Anthropic, and Google for their amazing AI models
- The Chrome Extensions community for documentation and examples

## 📧 Support

If you encounter any issues or have questions:
1. Check the Troubleshooting section above
2. Open an issue on GitHub
3. Review your browser console for error messages

## 🔄 Version History

- **v1.0.0** (2024) - Initial release
  - Support for OpenAI, Anthropic, and Google Gemini
  - Automatic caption capture
  - AI-powered summaries
  - Export functionality

---

Made with ❤️ for better meeting productivity