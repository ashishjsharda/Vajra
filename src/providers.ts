import * as vscode from 'vscode';
import axios from 'axios';
import { AIProvider } from './types';

export class GroqProvider implements AIProvider {
  name = 'groq';
  displayName = 'Groq';
  models = [
    'llama-3.1-405b-reasoning',
    'llama-3.1-70b-versatile',
    'llama-3.1-8b-instant',
    'mixtral-8x7b-32768',
    'gemma2-9b-it'
  ];

  isConfigured(): boolean {
    const config = vscode.workspace.getConfiguration('vajra');
    return !!config.get('groqApiKey');
  }

  async sendMessage(message: string, model: string = 'llama-3.1-8b-instant'): Promise<string> {
    const config = vscode.workspace.getConfiguration('vajra');
    const apiKey = config.get<string>('groqApiKey');

    if (!apiKey) {
      throw new Error('Groq API key not configured');
    }

    try {
      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        messages: [{ role: 'user', content: message }],
        model: model,
        temperature: 0.7,
        max_tokens: 2048
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error: any) {
      throw new Error(`Groq API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

export class OllamaProvider implements AIProvider {
  name = 'ollama';
  displayName = 'Ollama';
  models = [
    'llama3:8b',
    'llama3:70b',
    'codellama:7b',
    'codellama:13b',
    'mistral:7b',
    'phi3:mini',
    'deepseek-coder:6.7b'
  ];

  isConfigured(): boolean {
    // Ollama doesn't need API key, just check if endpoint is accessible
    return true;
  }

  async sendMessage(message: string, model: string = 'llama3:8b'): Promise<string> {
    const config = vscode.workspace.getConfiguration('vajra');
    const endpoint = config.get<string>('ollamaEndpoint') || 'http://localhost:11434';

    try {
      const response = await axios.post(`${endpoint}/api/generate`, {
        model: model,
        prompt: message,
        stream: false
      });

      return response.data.response;
    } catch (error: any) {
      throw new Error(`Ollama error: ${error.response?.data?.error || error.message}`);
    }
  }
}

export class HuggingFaceProvider implements AIProvider {
  name = 'huggingface';
  displayName = 'HuggingFace';
  models = [
    'microsoft/DialoGPT-medium',
    'microsoft/CodeBERT-base',
    'bigscience/bloom-560m',
    'EleutherAI/gpt-j-6b'
  ];

  isConfigured(): boolean {
    const config = vscode.workspace.getConfiguration('vajra');
    return !!config.get('huggingfaceApiKey');
  }

  async sendMessage(message: string, model: string = 'microsoft/DialoGPT-medium'): Promise<string> {
    const config = vscode.workspace.getConfiguration('vajra');
    const apiKey = config.get<string>('huggingfaceApiKey');

    if (!apiKey) {
      throw new Error('HuggingFace API key not configured');
    }

    try {
      const response = await axios.post(`https://api-inference.huggingface.co/models/${model}`, {
        inputs: message
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data[0]?.generated_text || 'No response';
    } catch (error: any) {
      throw new Error(`HuggingFace error: ${error.response?.data?.error || error.message}`);
    }
  }
}

export class ProviderManager {
  private providers: Map<string, AIProvider> = new Map();

  constructor() {
    this.providers.set('groq', new GroqProvider());
    this.providers.set('ollama', new OllamaProvider());
    this.providers.set('huggingface', new HuggingFaceProvider());
  }

  getProvider(name: string): AIProvider | undefined {
    return this.providers.get(name);
  }

  getConfiguredProviders(): AIProvider[] {
    return Array.from(this.providers.values()).filter(p => p.isConfigured());
  }

  getAllProviders(): AIProvider[] {
    return Array.from(this.providers.values());
  }
}