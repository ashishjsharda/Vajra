# Vajra - AI Coding Assistant

<div align="center">

![Vajra Logo](icon.png)

**Enterprise-grade multi-provider AI coding assistant for VS Code**

[![Version](https://img.shields.io/badge/version-0.3.0-blue.svg)](https://github.com/ashishjsharda/Vajra)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.74.0+-blue.svg)](https://code.visualstudio.com/)

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Providers](#supported-providers) • [Contributing](#contributing)

</div>

## 🎯 Overview

Vajra is a powerful AI coding assistant that brings multiple AI providers into your VS Code workflow. Whether you prefer local privacy with Ollama, cutting-edge models from OpenAI and Anthropic, or specialized coding models from Qwen and DeepSeek, Vajra has you covered.

## ✨ Features

### 🤖 Multi-Provider Support
- **10+ AI Providers**: OpenAI, Anthropic, Qwen, DeepSeek, Mistral, Gemini, Groq, Ollama, OpenRouter, HuggingFace
- **Smart Model Selection**: Automatically choose the best model for each task
- **Seamless Switching**: Change providers on the fly without restarting

### 💻 Code Intelligence
- **Explain Code**: Get clear explanations of complex code
- **Refactor**: Improve code quality and readability
- **Debug**: AI-powered debugging assistance
- **Optimize**: Performance improvements and best practices
- **Generate Tests**: Automatic unit test generation
- **Add Comments**: Comprehensive code documentation

### 🏠 Local-First Privacy
- **Ollama Integration**: Run models locally on your machine
- **No Data Sharing**: Your code stays on your computer
- **Offline Capable**: Works without internet when using local models

### 🎨 Developer Experience
- **Context-Aware**: Understands your code and project
- **Inline Suggestions**: Right-click context menu integration
- **Chat Interface**: Interactive AI assistant panel
- **Model Status**: Real-time model availability and recommendations

## 📦 Installation

### From VS Code Marketplace
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "Vajra"
4. Click Install

### From VSIX
```bash
code --install-extension vajra-0.3.0.vsix
```

### From Source
```bash
git clone https://github.com/ashishjsharda/Vajra.git
cd Vajra
npm install
npm run compile
```

## 🚀 Quick Start

### Option 1: Local with Ollama (Recommended for Privacy)

1. **Install Ollama**
   ```bash
   # macOS/Linux
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Windows: Download from https://ollama.ai/download
   ```

2. **Install a Coding Model**
   ```bash
   ollama pull qwen2.5-coder:7b
   ```

3. **Start Using Vajra**
   - Vajra will auto-detect your Ollama models
   - Select code → Right-click → Choose Vajra action

### Option 2: Cloud Providers

1. **Get an API Key** from your preferred provider:
   - [OpenAI](https://platform.openai.com/api-keys)
   - [Anthropic](https://console.anthropic.com/)
   - [Google AI](https://makersuite.google.com/app/apikey)

2. **Configure Vajra**
   - Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
   - Run "Vajra: Select AI Provider"
   - Enter your API key when prompted

## 🎯 Supported Providers

| Provider | Best For | Models | Cost |
|----------|----------|--------|------|
| **Ollama** | Privacy, Local | qwen2.5-coder, deepseek-coder, codellama | Free |
| **Qwen** | Coding Excellence | qwen2.5-coder (32B/14B/7B/1.5B) | $$ |
| **Anthropic** | Reasoning | Claude 3.5 Sonnet/Haiku | $$$ |
| **OpenAI** | General Purpose | GPT-4 Turbo, GPT-4o | $$$ |
| **DeepSeek** | Cost-Effective Coding | deepseek-coder | $ |
| **Mistral** | Fast Coding | Codestral | $$ |
| **Gemini** | Multimodal | Gemini 2.0 Flash | $$ |
| **Groq** | Ultra-Fast Inference | Llama 3.3, Mixtral | $$ |
| **OpenRouter** | Unified Access | All Models | Varies |
| **HuggingFace** | Open Source | Various | $ |

## 📖 Usage

### Context Menu Commands

Select any code and right-click to access:
- **Explain Selected Code**: Get detailed explanations
- **Refactor Selected Code**: Improve code quality
- **Debug Code with AI**: Find and fix issues
- **Optimize Code Performance**: Speed improvements
- **Add Comments to Code**: Auto-documentation
- **Generate Unit Tests**: Create test cases

### Chat Interface

1. Open Vajra Chat:
   - Click Vajra icon in sidebar
   - Or use Command Palette: "Vajra: Open Chat"

2. Ask questions:
   ```
   How do I implement a binary search tree in Python?
   ```

3. Get help with selected code:
   - Select code in editor
   - Type question in chat
   - Vajra automatically includes context

### Model Management

**Check Model Status**
```
Command Palette → Vajra: Show Model Status & Recommendations
```

**Check Specific Model**
```
Command Palette → Vajra: Check Model Availability
```

**Get Setup Recommendations**
```
Command Palette → Vajra: Get Setup Recommendations
```

## ⚙️ Configuration

### Settings

Access via: File → Preferences → Settings → Vajra

```json
{
  // Default provider
  "vajra.defaultProvider": "ollama",
  
  // Default model
  "vajra.defaultModel": "qwen2.5-coder:7b",
  
  // Ollama endpoint
  "vajra.ollamaEndpoint": "http://localhost:11434",
  
  // Model parameters
  "vajra.temperature": 0.7,
  "vajra.maxTokens": 4096,
  
  // Features
  "vajra.autoModelSelection": true,
  "vajra.enableCostTracking": false,
  "vajra.enableMultiModalInput": true
}
```

### API Keys

Store API keys securely in VS Code settings:

```json
{
  "vajra.openaiApiKey": "sk-...",
  "vajra.anthropicApiKey": "sk-ant-...",
  "vajra.qwenApiKey": "sk-...",
  "vajra.deepseekApiKey": "sk-...",
  "vajra.mistralApiKey": "...",
  "vajra.geminiApiKey": "...",
  "vajra.groqApiKey": "gsk_...",
  "vajra.openrouterApiKey": "sk-or-...",
  "vajra.huggingfaceApiKey": "hf_..."
}
```

## 🎓 Best Practices

### For Privacy-Conscious Users
- Use Ollama with local models
- Models run entirely on your machine
- No data leaves your computer

### For Performance
- **Small Projects**: Use 7B models (qwen2.5-coder:7b)
- **Large Codebases**: Use 32B models (qwen2.5-coder:32b)
- **Quick Queries**: Use Groq for ultra-fast responses

### For Cost Optimization
- Start with free tier of cloud providers
- Use DeepSeek for cost-effective coding
- Switch to Ollama for zero ongoing costs

## 🔧 Troubleshooting

### Ollama Not Detected
```bash
# Check if Ollama is running
ollama list

# Start Ollama
ollama serve

# Pull a model
ollama pull qwen2.5-coder:7b
```

### API Key Issues
1. Verify key is correct
2. Check rate limits on provider dashboard
3. Ensure billing is set up (for paid providers)

### Model Not Found
```bash
# List available models
ollama list

# Pull missing model
ollama pull <model-name>
```

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Changelog

### Version 0.3.0 (Current)
- ✅ Fixed GPT-5 references (not publicly available)
- ✅ Updated all model names to current versions
- ✅ Improved Ollama integration and error handling
- ✅ Better provider auto-configuration
- ✅ Enhanced model status reporting
- ✅ Updated API endpoints

### Version 0.2.0
- Added multi-provider support
- Implemented smart model selection
- Added local Ollama integration
- Context-aware code actions

### Version 0.1.0
- Initial release
- Basic chat functionality
- Code explanation features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Anthropic for Claude
- OpenAI for GPT models
- Alibaba for Qwen
- DeepSeek for coding models
- Ollama team for local AI
- All open source contributors

## 📞 Support

- 🐛 [Report Issues](https://github.com/ashishjsharda/Vajra/issues)
- 💬 [Discussions](https://github.com/ashishjsharda/Vajra/discussions)
- 📧 Email: ashish@example.com

## 🌟 Show Your Support

If you find Vajra helpful, please:
- ⭐ Star the repository
- 🐦 Share on social media
- 📝 Write a review on VS Code Marketplace

---

<div align="center">

**Made with ❤️ by [Ashish Sharda](https://github.com/ashishjsharda)**

</div>
