# Vajra - AI Coding Assistant

A multi-provider AI coding assistant for VSCode supporting Groq, Ollama, HuggingFace and more.

## Features

- 🚀 **Multiple AI Providers**: Groq, Ollama, HuggingFace
- 💬 **Chat Interface**: Interactive chat in sidebar
- 🔍 **Code Context**: Automatically includes selected code
- ⚡ **Fast Responses**: Optimized for speed with Groq
- 🏠 **Local Models**: Run models locally with Ollama

## Quick Start

1. Install the extension
2. Open Command Palette (`Ctrl+Shift+P`)
3. Run "Vajra: Open Chat"
4. Configure your preferred provider:
   - **Groq**: Add API key in settings
   - **Ollama**: Ensure Ollama is running locally
   - **HuggingFace**: Add API key for advanced models

## Configuration

Go to Settings > Extensions > Vajra:

- `vajra.groqApiKey`: Your Groq API key
- `vajra.ollamaEndpoint`: Ollama server (default: http://localhost:11434)
- `vajra.defaultProvider`: groq | ollama | huggingface
- `vajra.defaultModel`: Default model to use

## Usage

1. Select code and ask questions about it
2. Use the chat interface for general coding help
3. Switch providers using the "Provider" button
4. Right-click selected code and choose "Explain Selected Code"

## Supported Models

**Groq**: llama-3.1-405b, llama-3.1-70b, mixtral-8x7b, gemma2-9b
**Ollama**: llama3, codellama, mistral, phi3, deepseek-coder
**HuggingFace**: DialoGPT, CodeBERT, BLOOM, GPT-J