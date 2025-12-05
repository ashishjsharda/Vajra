# Changelog

All notable changes to the Vajra AI Coding Assistant extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2024-11-30

### Fixed
- **CRITICAL**: Removed references to GPT-5 (not publicly available)
  - Changed OpenAI provider to use GPT-4 Turbo and GPT-4o
  - Updated all GPT-5 model strings to actual available models
  - Fixed default model configurations

- **Model Updates**: Updated all provider model lists to current versions
  - Anthropic: Updated to Claude 3.5 Sonnet (latest release)
  - OpenAI: Changed to GPT-4 Turbo, GPT-4o, O1 models
  - Qwen: Confirmed Qwen2.5-Coder model names
  - DeepSeek: Updated to currently available models
  - Mistral: Updated to Codestral latest
  - Gemini: Updated to Gemini 2.0 Flash
  - Groq: Updated to Llama 3.3 models

- **Provider Configuration**
  - Fixed default provider from 'groq' to 'ollama' for better out-of-box experience
  - Fixed default model to 'qwen2.5-coder:7b' (most widely available)
  - Improved error messages for missing models
  - Better Ollama connection error handling

### Improved
- Enhanced auto-configuration on first run
- Better model detection and recommendations
- Improved error messages with actionable suggestions
- More robust API endpoint handling
- Better handling of connection timeouts

### Changed
- Version bumped to 0.3.0
- Package description updated to reflect accurate capabilities
- Keywords updated to remove GPT-5 references
- Default provider changed to Ollama for privacy-first approach

## [0.2.0] - 2024-09-XX

### Added
- Multi-provider support (10+ AI providers)
- Smart model selection based on task type
- Ollama integration for local models
- Context menu integration for code actions
- Real-time model status checking
- Hardware-based model recommendations
- Cost tracking capabilities (optional)
- Multimodal input support

### Features
- Explain code functionality
- Code refactoring suggestions
- AI-powered debugging
- Performance optimization
- Automatic comment generation
- Unit test generation
- Interactive chat interface

### Providers Added
- OpenAI (GPT-4 series)
- Anthropic (Claude 3 series)
- Qwen (Qwen2.5-Coder)
- DeepSeek (DeepSeek-Coder)
- Mistral (Codestral)
- Google (Gemini)
- Groq (Fast inference)
- Ollama (Local models)
- OpenRouter (Unified access)
- HuggingFace (Open source)

## [0.1.0] - 2024-09-01

### Added
- Initial release
- Basic chat interface
- Code explanation features
- Single provider support
- VS Code integration

---

## Upgrade Guide

### From 0.2.0 to 0.3.0

**Action Required**: Update your settings if you were using GPT-5 references

1. **Check your settings.json**:
   ```json
   // OLD (will not work)
   "vajra.defaultModel": "gpt-5"
   
   // NEW (correct)
   "vajra.defaultModel": "gpt-4-turbo"
   ```

2. **Update provider references**:
   - `gpt-5` → `gpt-4-turbo` or `gpt-4o`
   - `claude-4-*` → `claude-3-5-sonnet-20241022`
   - `gemini-2.5-*` → `gemini-2.0-flash-exp`

3. **Recommended**: Run "Vajra: Get Setup Recommendations" to see current best models

### What's the Same
- All API keys remain valid
- Configuration structure unchanged
- Commands and features work identically
- No migration needed for Ollama users

---

## Known Issues

### Current Limitations
- Some cloud providers may have rate limits
- Large models (32B+) require significant RAM
- Multimodal features depend on provider support

### Workarounds
- **Rate Limits**: Use multiple providers or Ollama
- **Memory**: Use smaller models (7B or 14B) or cloud providers
- **Features**: Check provider capabilities before use

---

## Roadmap

### Planned for 0.4.0
- [ ] Conversation history
- [ ] Custom prompt templates
- [ ] Workspace-wide code analysis
- [ ] Team collaboration features
- [ ] Enhanced cost tracking
- [ ] Model performance comparisons

### Future Considerations
- Image analysis for UI/UX code generation
- Voice input support
- IDE-wide refactoring
- Code review automation
- Documentation generation
- Architecture suggestions

---

## Deprecation Notices

### Deprecated in 0.3.0
- None

### Removed in 0.3.0
- GPT-5 model references (never publicly available)
- Non-existent Claude 4 model strings
- Incorrect Qwen3-Coder references

---

## Migration Notes

### For Extension Users
No action required. The extension will auto-detect your configuration and suggest updates if needed.

### For Extension Developers
If you've forked or built on Vajra:
1. Update model strings in `providers.ts`
2. Remove GPT-5 references
3. Update default configurations
4. Test with current API endpoints

---

## Support

For issues related to this release:
- 🐛 [Report bugs](https://github.com/ashishjsharda/Vajra/issues)
- 💬 [Ask questions](https://github.com/ashishjsharda/Vajra/discussions)
- 📧 Email: ashishjsharda@gmail.com

---

**Note**: This project follows semantic versioning. Breaking changes will only occur in major version updates (X.0.0).
