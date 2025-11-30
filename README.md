# Vajra - AI Coding Assistant

<div align="center">

**Enterprise-grade multi-provider AI coding assistant for VS Code**

[![Version](https://img.shields.io/visual-studio-marketplace/v/ashishjsharda.vajra)](https://marketplace.visualstudio.com/items?itemName=ashishjsharda.vajra)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/ashishjsharda.vajra)](https://marketplace.visualstudio.com/items?itemName=ashishjsharda.vajra)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/ashishjsharda.vajra)](https://marketplace.visualstudio.com/items?itemName=ashishjsharda.vajra)

</div>

---

## 🎯 Overview

Vajra brings the power of multiple AI providers directly into your VS Code workflow. Whether you prefer local privacy with Ollama, cutting-edge models from OpenAI and Anthropic, or specialized coding models from Qwen and DeepSeek, Vajra has you covered.

**Built as a true Cursor alternative** with enterprise-grade features, local model support, and intelligent model routing.

---

## ✨ Features

### 🤖 Multi-Provider Support
- **10+ AI Providers**: OpenAI, Anthropic, Qwen, DeepSeek, Mistral, Gemini, Groq, Ollama, OpenRouter, HuggingFace
- **Smart Model Selection**: Automatically choose the best model for each task
- **Seamless Switching**: Change providers on the fly without restarting
- **Cost Tracking**: Monitor API usage (optional)

### 💻 Code Intelligence
- **Explain Code**: Get clear explanations of complex code
- **Refactor**: Improve code quality and readability
- **Debug**: AI-powered debugging assistance
- **Optimize**: Performance improvements and best practices
- **Generate Tests**: Automatic unit test generation
- **Add Comments**: Comprehensive code documentation
- **Code Generation**: Create code from natural language descriptions

### 🏠 Local-First Privacy
- **Ollama Integration**: Run models locally on your machine
- **No Data Sharing**: Your code stays on your computer
- **Offline Capable**: Works without internet when using local models
- **Zero API Costs**: Use local models completely free

### 🎨 Developer Experience
- **Context-Aware**: Understands your code and project
- **Inline Suggestions**: Right-click context menu integration
- **Chat Interface**: Interactive AI assistant panel
- **Model Status**: Real-time model availability and recommendations
- **Hardware Detection**: Automatically recommends best models for your system

---

## 📦 Installation

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for **"Vajra"**
4. Click **Install**

That's it! You're ready to go.

---

## 🚀 Quick Start

### Option 1: Local with Ollama (Recommended - Free & Private)

**Why Ollama?**
- ✅ **100% Free** - No API costs ever
- 🔒 **Private** - Your code never leaves your machine
- 🚀 **Fast** - No network latency
- 📦 **No Rate Limits** - Use as much as you want

**Setup (5 minutes):**

1. **Install Ollama**
   ```bash
   # macOS/Linux
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Windows
   # Download from https://ollama.ai/download
   ```

2. **Install a Coding Model**
   ```bash
   # Recommended: Best coding performance (4.1GB)
   ollama pull qwen2.5-coder:7b
   
   # Or lightweight option (1.2GB)
   ollama pull qwen2.5-coder:1.5b
   ```

3. **Configure Vajra**
   - Press `Ctrl+Shift+P` / `Cmd+Shift+P`
   - Run: **"Vajra: Select AI Provider"**
   - Choose: **"Ollama (Local)"**
   - Done! ✅

### Option 2: Cloud Providers (OpenAI, Anthropic, etc.)

**Why Cloud?**
- 🎯 **Latest Models** - Access to GPT-4, Claude 3.5, etc.
- 💪 **Powerful** - State-of-the-art AI capabilities
- ☁️ **No Local Resources** - Runs entirely in the cloud

**Setup (2 minutes):**

1. **Get an API Key**:
   - [OpenAI](https://platform.openai.com/api-keys) - GPT-4 Turbo, GPT-4o
   - [Anthropic](https://console.anthropic.com/) - Claude 3.5 Sonnet
   - [Groq](https://console.groq.com/) - Ultra-fast inference (free tier)

2. **Configure Vajra**:
   - Press `Ctrl+Shift+P` / `Cmd+Shift+P`
   - Run: **"Vajra: Select AI Provider"**
   - Choose your provider
   - Enter API key when prompted
   - Done! ✅

---

## 🎮 How to Use

### Chat Interface

1. **Open Vajra Chat**:
   - Click the Vajra icon in the sidebar
   - Or press `Ctrl+Shift+P` and run "Vajra: Open Chat"

2. **Ask Questions**:
   ```
   How do I implement a binary search in Python?
   ```

3. **Get Help with Code**:
   - Select code in your editor
   - Ask your question in chat
   - Vajra automatically includes the selected code as context

### Code Actions (Right-Click Menu)

Select any code, then right-click to access:

| Action | Description |
|--------|-------------|
| **Explain Selected Code** | Get detailed explanations of what the code does |
| **Refactor Selected Code** | Improve code quality and readability |
| **Debug Code with AI** | Find and fix bugs with AI assistance |
| **Optimize Code Performance** | Get performance improvements |
| **Add Comments to Code** | Auto-generate comprehensive comments |
| **Generate Unit Tests** | Create test cases for your code |

### All Available Commands

Press `Ctrl+Shift+P` / `Cmd+Shift+P` and type "Vajra" to see:

**Core Commands:**
- **Vajra: Open Chat** - Open the interactive chat panel
- **Vajra: Select AI Provider** - Switch between providers (OpenAI, Claude, Ollama, etc.)
- **Vajra: Select AI Model** - Change the model within your current provider

**Model Management:**
- **Vajra: Show Model Status & Recommendations** - See installed models and performance benchmarks
- **Vajra: Check Model Availability** - Check if a specific model is installed
- **Vajra: Get Setup Recommendations** - Get personalized setup guide for your hardware

---

## ⚙️ Configuration

### Quick Settings

1. Press `Ctrl+,` / `Cmd+,` to open Settings
2. Search for **"Vajra"**
3. Configure your preferences

### For Ollama (Local - Free)

```json
{
  "vajra.defaultProvider": "ollama",
  "vajra.defaultModel": "qwen2.5-coder:7b",
  "vajra.temperature": 0.7
}
```

### For OpenAI (Cloud)

```json
{
  "vajra.defaultProvider": "openai",
  "vajra.defaultModel": "gpt-4-turbo",
  "vajra.openaiApiKey": "sk-your-key-here",
  "vajra.temperature": 0.7
}
```

### For Anthropic Claude (Cloud)

```json
{
  "vajra.defaultProvider": "anthropic",
  "vajra.defaultModel": "claude-3-5-sonnet-20241022",
  "vajra.anthropicApiKey": "sk-ant-your-key-here",
  "vajra.temperature": 0.7
}
```

### All Settings Reference

| Setting | Description | Default |
|---------|-------------|---------|
| `vajra.defaultProvider` | Which AI provider to use | `ollama` |
| `vajra.defaultModel` | Which model to use | `qwen2.5-coder:7b` |
| `vajra.temperature` | Creativity level (0-2) | `0.7` |
| `vajra.maxTokens` | Maximum response length | `4096` |
| `vajra.ollamaEndpoint` | Ollama server URL | `http://localhost:11434` |

**API Keys** (for cloud providers):
- `vajra.openaiApiKey` - For GPT-4 models
- `vajra.anthropicApiKey` - For Claude models
- `vajra.qwenApiKey` - For Qwen models
- `vajra.deepseekApiKey` - For DeepSeek models
- `vajra.mistralApiKey` - For Mistral models
- `vajra.geminiApiKey` - For Gemini models
- `vajra.groqApiKey` - For Groq inference
- `vajra.openrouterApiKey` - For OpenRouter access
- `vajra.huggingfaceApiKey` - For HuggingFace models

💡 **Tip**: Store API keys in **User Settings (Global)**, not workspace settings, to avoid committing secrets to git!

---

## 🎯 Supported Providers

### Cloud Providers

| Provider | Models | Best For | Cost |
|----------|--------|----------|------|
| **OpenAI** | GPT-4 Turbo, GPT-4o, GPT-4o-mini | General purpose, Fast | $$$ |
| **Anthropic** | Claude 3.5 Sonnet/Haiku | Reasoning, Large context | $$$ |
| **Qwen** | Qwen2.5-Coder (32B/14B/7B/1.5B) | Coding excellence | $$ |
| **DeepSeek** | DeepSeek-Coder V2.5 | Cost-effective coding | $ |
| **Mistral** | Codestral | Fast coding | $$ |
| **Gemini** | Gemini 2.0 Flash | Multimodal | $$ |
| **Groq** | Llama 3.3 70B | Ultra-fast inference | $ |

### Local Models (Ollama - Free!)

| Model | Size | Performance | Best For | Memory |
|-------|------|-------------|----------|--------|
| **qwen2.5-coder:32b** | 18.9GB | 🏆 Highest (94.3% MBPP) | Maximum accuracy | 32GB+ |
| **qwen2.5-coder:14b** | 8.2GB | ⭐ Excellent (91.1% MBPP) | Balanced | 16GB+ |
| **qwen2.5-coder:7b** | 4.1GB | ⭐ Great (88.4% MBPP) | Best value | 8GB+ |
| **qwen2.5-coder:1.5b** | 1.2GB | ✅ Good (75.2% MBPP) | Fast & light | 4GB+ |

⭐ **Recommended**: `qwen2.5-coder:7b` for most users

---

## 💡 Usage Examples

### Example 1: Explain Complex Code
1. Select the code
2. Right-click → "Explain Selected Code"
3. Get instant explanation in chat

### Example 2: Generate Unit Tests
1. Select your function
2. Right-click → "Generate Unit Tests"
3. Get comprehensive test cases

### Example 3: Debug with AI
1. Select problematic code
2. Right-click → "Debug Code with AI"
3. Get detailed analysis and fixes

### Example 4: Switch Providers on the Fly
- Press `Ctrl+Shift+P`
- Run "Vajra: Select AI Provider"
- Choose a different provider for different tasks:
  - Ollama for quick questions (free, fast)
  - Claude for complex reasoning (best quality)
  - Groq for ultra-fast responses

---

## 🔧 Troubleshooting

### "Model does not exist" Error

**Problem**: Provider and model are mismatched (e.g., trying to use an Ollama model with OpenAI)

**Solution**:
1. Press `Ctrl+Shift+P`
2. Run "Vajra: Select AI Provider"
3. Choose your desired provider
4. Vajra will automatically select the correct model ✅

### Ollama Not Detected

**Check if running**:
```bash
ollama list
```

**Start Ollama**:
```bash
ollama serve
```

**Install a model**:
```bash
ollama pull qwen2.5-coder:7b
```

### API Key Issues

1. **Verify the key is correct** (no extra spaces)
2. **Check billing** is set up on provider's website
3. **Test your key** on provider's dashboard
4. **Check rate limits** - you might have hit your quota

### Slow Performance

**Solutions**:
1. Use a smaller model (`qwen2.5-coder:1.5b`)
2. Switch to Groq for ultra-fast cloud inference
3. Use Ollama locally to eliminate network latency
4. Reduce `maxTokens` in settings

### "No models available" with Ollama

**Install a model**:
```bash
ollama pull qwen2.5-coder:7b
```

**Check status**:
- Press `Ctrl+Shift+P`
- Run "Vajra: Show Model Status & Recommendations"

---

## 🎓 Best Practices

### For Privacy
✅ Use Ollama with local models  
✅ Your code never leaves your machine  
✅ No API keys needed  
✅ No usage tracking  

### For Performance
- **Quick tasks**: Use `qwen2.5-coder:7b` or smaller
- **Complex tasks**: Use `qwen2.5-coder:32b` or Claude 3.5
- **Ultra-fast**: Use Groq for instant responses

### For Cost
- **Free**: Ollama (100% free forever)
- **Budget**: DeepSeek ($1/1M tokens)
- **Premium**: Reserve GPT-4/Claude for complex tasks only

### Hardware Recommendations

**Get personalized recommendations**:
- Press `Ctrl+Shift+P`
- Run "Vajra: Get Setup Recommendations"

**General guidelines**:
- **4GB RAM**: `qwen2.5-coder:1.5b` or cloud providers
- **8GB RAM**: `qwen2.5-coder:7b` ⭐ (recommended)
- **16GB RAM**: `qwen2.5-coder:14b` or `deepseek-coder-v2:16b`
- **32GB+ RAM**: `qwen2.5-coder:32b` (maximum performance)

---

## ❓ FAQ

**Q: Is Vajra free?**  
A: Yes! Use Ollama with local models for 100% free AI. Cloud providers require API keys and have usage costs.

**Q: Do I need an internet connection?**  
A: Not if you use Ollama! Local models work completely offline.

**Q: Which provider is best?**  
A: Depends on your needs:
- **Privacy**: Ollama
- **Performance**: Claude 3.5 or Qwen2.5-Coder 32B
- **Speed**: Groq
- **Cost**: DeepSeek or Ollama

**Q: Can I use multiple providers?**  
A: Yes! Switch providers anytime with "Vajra: Select AI Provider"

**Q: Is my code sent to the cloud?**  
A: Only if you use cloud providers (OpenAI, Anthropic, etc.). With Ollama, everything stays on your machine.

**Q: What's the difference between this and GitHub Copilot?**  
A: Vajra offers:
- Multiple AI providers (10+)
- Local model support (Ollama)
- Full chat interface
- Explicit code actions
- More control over models

---

## 📞 Support

Need help? We're here for you!

- 📧 **Email**: [ashishjsharda@gmail.com](mailto:ashishjsharda@gmail.com)
- 🐛 **Report Bug**: Use "Report Issue" button in VS Code
- ⭐ **Feature Request**: Use marketplace reviews or email
- 💬 **Questions**: Email us anytime

---

## 🌟 Rate Vajra

If you find Vajra helpful, please:

- ⭐ **Rate us** on the VS Code Marketplace
- ✍️ **Write a review** sharing your experience
- 📢 **Tell your friends** about Vajra

Your feedback helps us improve! 🙏

---

<div align="center">

**Made with ❤️ for developers everywhere**

Version 0.3.2 | [Email Support](mailto:ashishjsharda@gmail.com) | [Report Issue](https://marketplace.visualstudio.com/items?itemName=ashishjsharda.vajra)

</div>