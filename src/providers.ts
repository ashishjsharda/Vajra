import * as vscode from 'vscode';
import axios from 'axios';
import { AIProvider } from './types';

export class GroqProvider implements AIProvider {
  name = 'groq';
  displayName = 'Groq';
  models = [
    'llama-3.3-70b-versatile',
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

export class OpenAIProvider implements AIProvider {
  name = 'openai';
  displayName = 'OpenAI GPT-4';
  models = [
    'gpt-4-turbo-preview',
    'gpt-4-turbo',
    'gpt-4',
    'gpt-4o',
    'gpt-4o-mini',
    'o1-preview',
    'o1-mini'
  ];

  isConfigured(): boolean {
    const config = vscode.workspace.getConfiguration('vajra');
    return !!config.get('openaiApiKey');
  }

  async sendMessage(message: string, model: string = 'gpt-4-turbo'): Promise<string> {
    const config = vscode.workspace.getConfiguration('vajra');
    const apiKey = config.get<string>('openaiApiKey');

    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        messages: [{ role: 'user', content: message }],
        model: model,
        temperature: 0.7,
        max_tokens: 4096
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error: any) {
      throw new Error(`OpenAI API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

export class AnthropicProvider implements AIProvider {
  name = 'anthropic';
  displayName = 'Claude 3.5';
  models = [
    'claude-3-5-sonnet-20241022',
    'claude-3-5-haiku-20241022',
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307'
  ];

  isConfigured(): boolean {
    const config = vscode.workspace.getConfiguration('vajra');
    return !!config.get('anthropicApiKey');
  }

  async sendMessage(message: string, model: string = 'claude-3-5-sonnet-20241022'): Promise<string> {
    const config = vscode.workspace.getConfiguration('vajra');
    const apiKey = config.get<string>('anthropicApiKey');

    if (!apiKey) {
      throw new Error('Anthropic API key not configured');
    }

    try {
      const response = await axios.post('https://api.anthropic.com/v1/messages', {
        model: model,
        max_tokens: 4096,
        messages: [{ role: 'user', content: message }]
      }, {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        }
      });

      return response.data.content[0].text;
    } catch (error: any) {
      throw new Error(`Anthropic API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

export class QwenProvider implements AIProvider {
  name = 'qwen';
  displayName = 'Qwen2.5-Coder';
  models = [
    'qwen2.5-coder-32b-instruct',
    'qwen2.5-coder-14b-instruct',
    'qwen2.5-coder-7b-instruct',
    'qwen2.5-coder-1.5b-instruct',
    'qwen-max',
    'qwen-plus',
    'qwen-turbo'
  ];

  isConfigured(): boolean {
    const config = vscode.workspace.getConfiguration('vajra');
    return !!config.get('qwenApiKey');
  }

  async sendMessage(message: string, model: string = 'qwen2.5-coder-7b-instruct'): Promise<string> {
    const config = vscode.workspace.getConfiguration('vajra');
    const apiKey = config.get<string>('qwenApiKey');

    if (!apiKey) {
      throw new Error('Qwen API key not configured');
    }

    try {
      const response = await axios.post('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
        model: model,
        input: {
          messages: [{ role: 'user', content: message }]
        },
        parameters: {
          temperature: 0.7,
          max_tokens: 4096
        }
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.output.choices[0].message.content;
    } catch (error: any) {
      throw new Error(`Qwen API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

export class DeepSeekProvider implements AIProvider {
  name = 'deepseek';
  displayName = 'DeepSeek-Coder V2.5';
  models = [
    'deepseek-coder',
    'deepseek-chat'
  ];

  isConfigured(): boolean {
    const config = vscode.workspace.getConfiguration('vajra');
    return !!config.get('deepseekApiKey');
  }

  async sendMessage(message: string, model: string = 'deepseek-coder'): Promise<string> {
    const config = vscode.workspace.getConfiguration('vajra');
    const apiKey = config.get<string>('deepseekApiKey');

    if (!apiKey) {
      throw new Error('DeepSeek API key not configured');
    }

    try {
      const response = await axios.post('https://api.deepseek.com/chat/completions', {
        model: model,
        messages: [{ role: 'user', content: message }],
        temperature: 0.7,
        max_tokens: 4096
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error: any) {
      throw new Error(`DeepSeek API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

export class MistralProvider implements AIProvider {
  name = 'mistral';
  displayName = 'Mistral Codestral';
  models = [
    'codestral-latest',
    'mistral-large-latest',
    'mistral-medium-latest',
    'mistral-small-latest',
    'open-mistral-7b'
  ];

  isConfigured(): boolean {
    const config = vscode.workspace.getConfiguration('vajra');
    return !!config.get('mistralApiKey');
  }

  async sendMessage(message: string, model: string = 'codestral-latest'): Promise<string> {
    const config = vscode.workspace.getConfiguration('vajra');
    const apiKey = config.get<string>('mistralApiKey');

    if (!apiKey) {
      throw new Error('Mistral API key not configured');
    }

    try {
      const response = await axios.post('https://api.mistral.ai/v1/chat/completions', {
        model: model,
        messages: [{ role: 'user', content: message }],
        temperature: 0.7,
        max_tokens: 4096
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error: any) {
      throw new Error(`Mistral API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

export class GeminiProvider implements AIProvider {
  name = 'gemini';
  displayName = 'Google Gemini 2.0';
  models = [
    'gemini-2.0-flash-exp',
    'gemini-1.5-pro-latest',
    'gemini-1.5-flash-latest'
  ];

  isConfigured(): boolean {
    const config = vscode.workspace.getConfiguration('vajra');
    return !!config.get('geminiApiKey');
  }

  async sendMessage(message: string, model: string = 'gemini-2.0-flash-exp'): Promise<string> {
    const config = vscode.workspace.getConfiguration('vajra');
    const apiKey = config.get<string>('geminiApiKey');

    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        contents: [{
          parts: [{ text: message }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096
        }
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data.candidates[0].content.parts[0].text;
    } catch (error: any) {
      throw new Error(`Gemini API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

export class OllamaProvider implements AIProvider {
  name = 'ollama';
  displayName = 'Ollama (Local)';
  models = [
    // Qwen Coding Models (Best for 2025)
    'qwen2.5-coder:32b',
    'qwen2.5-coder:14b',
    'qwen2.5-coder:7b',
    'qwen2.5-coder:1.5b',
    
    // DeepSeek Models
    'deepseek-coder-v2:16b',
    'deepseek-coder:6.7b',
    
    // Latest General Models
    'llama3.3:70b',
    'llama3.2:3b',
    'qwen2.5:72b',
    'qwen2.5:32b',
    'qwen2.5:14b',
    'qwen2.5:7b',
    
    // Specialized Coding
    'starcoder2:15b',
    'starcoder2:7b',
    'starcoder2:3b',
    'codellama:34b',
    'codellama:13b',
    'codellama:7b',
    
    // Additional Options
    'granite-code:34b',
    'granite-code:20b',
    'granite-code:8b',
    'phi3:14b',
    'mistral:7b'
  ];

  isConfigured(): boolean {
    return true;
  }

  async sendMessage(message: string, model: string = 'qwen2.5-coder:7b'): Promise<string> {
    const config = vscode.workspace.getConfiguration('vajra');
    const endpoint = config.get<string>('ollamaEndpoint') || 'http://localhost:11434';

    try {
      const response = await axios.post(`${endpoint}/api/generate`, {
        model: model,
        prompt: message,
        stream: false,
        options: {
          temperature: 0.7,
          num_ctx: 8192,
          num_predict: 2048
        }
      });

      return response.data.response;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Ollama server not running. Please start Ollama first.');
      }
      throw new Error(`Ollama error: ${error.response?.data?.error || error.message}`);
    }
  }
}

export class OpenRouterProvider implements AIProvider {
  name = 'openrouter';
  displayName = 'OpenRouter';
  models = [
    'anthropic/claude-3.5-sonnet',
    'openai/gpt-4-turbo',
    'google/gemini-2.0-flash-exp',
    'qwen/qwen-2.5-coder-32b-instruct',
    'deepseek/deepseek-coder',
    'meta-llama/llama-3.3-70b-instruct',
    'mistralai/codestral-latest'
  ];

  isConfigured(): boolean {
    const config = vscode.workspace.getConfiguration('vajra');
    return !!config.get('openrouterApiKey');
  }

  async sendMessage(message: string, model: string = 'qwen/qwen-2.5-coder-32b-instruct'): Promise<string> {
    const config = vscode.workspace.getConfiguration('vajra');
    const apiKey = config.get<string>('openrouterApiKey');

    if (!apiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    try {
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: model,
        messages: [{ role: 'user', content: message }],
        temperature: 0.7,
        max_tokens: 4096
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://github.com/ashishjsharda/Vajra',
          'X-Title': 'Vajra AI Coding Assistant'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error: any) {
      throw new Error(`OpenRouter API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

export class HuggingFaceProvider implements AIProvider {
  name = 'huggingface';
  displayName = 'HuggingFace';
  models = [
    'Qwen/Qwen2.5-Coder-32B-Instruct',
    'deepseek-ai/DeepSeek-Coder-V2-Instruct',
    'codellama/CodeLlama-34b-Instruct-hf',
    'bigcode/starcoder2-15b',
    'microsoft/phi-2'
  ];

  isConfigured(): boolean {
    const config = vscode.workspace.getConfiguration('vajra');
    return !!config.get('huggingfaceApiKey');
  }

  async sendMessage(message: string, model: string = 'Qwen/Qwen2.5-Coder-32B-Instruct'): Promise<string> {
    const config = vscode.workspace.getConfiguration('vajra');
    const apiKey = config.get<string>('huggingfaceApiKey');

    if (!apiKey) {
      throw new Error('HuggingFace API key not configured');
    }

    try {
      const response = await axios.post(`https://api-inference.huggingface.co/models/${model}`, {
        inputs: message,
        parameters: {
          max_new_tokens: 2048,
          temperature: 0.7,
          return_full_text: false
        }
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data[0]?.generated_text || response.data.generated_text || 'No response';
    } catch (error: any) {
      throw new Error(`HuggingFace error: ${error.response?.data?.error || error.message}`);
    }
  }
}

export class ProviderManager {
  private providers: Map<string, AIProvider> = new Map();

  constructor() {
    this.providers.set('openai', new OpenAIProvider());
    this.providers.set('anthropic', new AnthropicProvider());
    this.providers.set('qwen', new QwenProvider());
    this.providers.set('deepseek', new DeepSeekProvider());
    this.providers.set('mistral', new MistralProvider());
    this.providers.set('gemini', new GeminiProvider());
    this.providers.set('groq', new GroqProvider());
    this.providers.set('ollama', new OllamaProvider());
    this.providers.set('openrouter', new OpenRouterProvider());
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

  getBestModelForTask(task: 'code' | 'chat' | 'reasoning' | 'local'): { provider: string; model: string } {
    switch (task) {
      case 'code':
        return { provider: 'qwen', model: 'qwen2.5-coder-7b-instruct' };
      case 'reasoning':
        return { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' };
      case 'local':
        return { provider: 'ollama', model: 'qwen2.5-coder:7b' };
      case 'chat':
      default:
        return { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' };
    }
  }

  getModelForHardware(ramGB: number, hasGPU: boolean): { provider: string; model: string; notes: string } {
    if (ramGB >= 32 && hasGPU) {
      return { 
        provider: 'ollama', 
        model: 'qwen2.5-coder:32b',
        notes: 'High-end: Best coding performance'
      };
    } else if (ramGB >= 16 && hasGPU) {
      return { 
        provider: 'ollama', 
        model: 'qwen2.5-coder:14b',
        notes: 'Mid-range: Excellent coding performance'
      };
    } else if (ramGB >= 8) {
      return { 
        provider: 'ollama', 
        model: 'qwen2.5-coder:7b',
        notes: 'Standard: Efficient and capable'
      };
    } else {
      return { 
        provider: 'ollama', 
        model: 'qwen2.5-coder:1.5b',
        notes: 'Lightweight: Basic coding assistance'
      };
    }
  }
}
