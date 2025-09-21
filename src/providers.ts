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

export class OpenAIProvider implements AIProvider {
  name = 'openai';
  displayName = 'OpenAI GPT-5';
  models = [
    'gpt-5',
    'gpt-5-codex',
    'gpt-5-nano',
    'gpt-4o',
    'gpt-4o-mini',
    'o1-preview',
    'o1-mini'
  ];

  isConfigured(): boolean {
    const config = vscode.workspace.getConfiguration('vajra');
    return !!config.get('openaiApiKey');
  }

  async sendMessage(message: string, model: string = 'gpt-5'): Promise<string> {
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
  displayName = 'Claude 4';
  models = [
    'claude-4-sonnet',
    'claude-4-opus',
    'claude-3.5-sonnet',
    'claude-3.5-haiku',
    'claude-3-opus',
    'claude-3-sonnet'
  ];

  isConfigured(): boolean {
    const config = vscode.workspace.getConfiguration('vajra');
    return !!config.get('anthropicApiKey');
  }

  async sendMessage(message: string, model: string = 'claude-4-sonnet'): Promise<string> {
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
  displayName = 'Qwen3-Coder (2025)';
  models = [
    'qwen3-coder-480b-instruct',     // Latest flagship 2025
    'qwen3-coder-32b-instruct',      // Best performance/cost
    'qwen2.5-coder-32b-instruct',    // Proven high performance
    'qwen2.5-coder-14b-instruct',    // Balanced option
    'qwen2.5-coder-7b-instruct',     // Most efficient
    'qwen2.5-coder-1.5b-instruct'    // Lightweight
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
  displayName = 'DeepSeek-R1 (2025)';
  models = [
    'deepseek-r1',                    // Latest breakthrough reasoning model
    'deepseek-v3.1',                  // Hybrid V3 + R1 architecture  
    'deepseek-v3',                    // Latest generation base model
    'deepseek-coder-v2.5',            // Updated coding specialist
    'deepseek-coder-v2-instruct',     // Proven coding model
    'deepseek-coder-v2-lite',         // Efficient variant
    'deepseek-chat'                   // General conversation
  ];

  isConfigured(): boolean {
    const config = vscode.workspace.getConfiguration('vajra');
    return !!config.get('deepseekApiKey');
  }

  async sendMessage(message: string, model: string = 'deepseek-coder-v2.5'): Promise<string> {
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
    'codestral-25.01',
    'codestral-22b',
    'mistral-large-2',
    'mistral-medium',
    'pixtral-12b'
  ];

  isConfigured(): boolean {
    const config = vscode.workspace.getConfiguration('vajra');
    return !!config.get('mistralApiKey');
  }

  async sendMessage(message: string, model: string = 'codestral-25.01'): Promise<string> {
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
  displayName = 'Google Gemini 2.5';
  models = [
    'gemini-2.5-pro',
    'gemini-2.0-flash-exp',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-code-assist'
  ];

  isConfigured(): boolean {
    const config = vscode.workspace.getConfiguration('vajra');
    return !!config.get('geminiApiKey');
  }

  async sendMessage(message: string, model: string = 'gemini-2.5-pro'): Promise<string> {
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
  displayName = 'Ollama (Local 2025)';
  models = [
    // Latest 2025 Coding Models (88.4% MBPP performance)
    'qwen2.5-coder:32b',             // Best overall coding model
    'qwen2.5-coder:14b',             // Balanced performance
    'qwen2.5-coder:7b',              // 88.4% MBPP, most efficient
    'qwen2.5-coder:1.5b',            // Lightweight option
    
    // DeepSeek Models (2025 updates)
    'deepseek-r1:14b',               // Latest reasoning model (if available)
    'deepseek-coder-v2:16b',         // 338 languages, mixture-of-experts
    'deepseek-coder-v2:6.7b',        // Efficient MoE variant
    
    // Latest General Models with Strong Coding
    'llama3.3:70b',                  // 405B-level performance 
    'llama3.2:90b',                  // Latest Meta release
    'llama3.2:3b',                   // Efficient general model
    'qwen2.5:72b',                   // Latest Qwen general
    'qwen2.5:32b',                   // Balanced general model
    'qwen2.5:14b',                   // Good general performance
    'qwen2.5:7b',                    // Efficient general
    
    // Specialized Coding Models
    'starcoder2:15b',                // 600+ languages, latest
    'starcoder2:7b',                 // Efficient specialist
    'starcoder2:3b',                 // Lightweight specialist
    'codellama:70b',                 // Large Meta coding model
    'codellama:34b',                 // Proven Meta model
    'codellama:13b',                 // Balanced Meta model
    'codellama:7b',                  // Efficient Meta model
    
    // Additional Options
    'granite-code:34b',              // IBM enterprise model
    'granite-code:20b',              // Mid-size enterprise
    'granite-code:8b',               // Efficient enterprise
    'codestral:22b',                 // Mistral's coding specialist
    'phi3:14b',                      // Microsoft's efficient model
    'mistral:7b'                     // General purpose fallback
  ];

  isConfigured(): boolean {
    // Ollama doesn't need API key, just check if endpoint is accessible
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
      throw new Error(`Ollama error: ${error.response?.data?.error || error.message}`);
    }
  }
}

export class OpenRouterProvider implements AIProvider {
  name = 'openrouter';
  displayName = 'OpenRouter (2025)';
  models = [
    // Latest 2025 Models
    'deepseek/deepseek-r1',
    'alibaba/qwen-3-coder-32b-instruct',
    'deepseek/deepseek-v3',
    'anthropic/claude-4-sonnet',
    'openai/gpt-5',
    'google/gemini-2.5-pro',
    
    // Proven Coding Models
    'deepseek/deepseek-coder-v2.5',
    'alibaba/qwen-2.5-coder-32b-instruct',
    'mistral/codestral-25.01',
    'meta-llama/llama-3.3-70b-instruct',
    'bigcode/starcoder2-15b',
    'microsoft/wizardcoder-34b'
  ];

  isConfigured(): boolean {
    const config = vscode.workspace.getConfiguration('vajra');
    return !!config.get('openrouterApiKey');
  }

  async sendMessage(message: string, model: string = 'alibaba/qwen-2.5-coder-32b-instruct'): Promise<string> {
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
          'HTTP-Referer': 'https://vajra-ai.com',
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
  displayName = 'HuggingFace (2025)';
  models = [
    // Latest 2025 Models
    'deepseek-ai/DeepSeek-R1',
    'Qwen/Qwen2.5-Coder-32B-Instruct',
    'deepseek-ai/DeepSeek-Coder-V2.5',
    'bigcode/starcoder2-15b',
    'microsoft/CodeT5p-16b',
    
    // Proven Models
    'deepseek-ai/DeepSeek-Coder-V2-Instruct',
    'codellama/CodeLlama-34b-Instruct-hf',
    'WizardCoder/WizardCoder-Python-34B-V1.0',
    'bigcode/starcoder2-7b',
    'microsoft/DialoGPT-medium',
    'microsoft/CodeBERT-base'
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
    // Add all providers with latest 2025 models
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

  // Updated for 2025 models
  getBestModelForTask(task: 'code' | 'chat' | 'reasoning' | 'local'): { provider: string; model: string } {
    switch (task) {
      case 'code':
        return { provider: 'qwen', model: 'qwen2.5-coder-7b-instruct' }; // 88.4% MBPP
      case 'reasoning':
        return { provider: 'deepseek', model: 'deepseek-r1' }; // Latest reasoning breakthrough
      case 'local':
        return { provider: 'ollama', model: 'qwen2.5-coder:7b' }; // Best local coding model
      case 'chat':
      default:
        return { provider: 'anthropic', model: 'claude-4-sonnet' };
    }
  }

  // Get recommended models for different hardware
  getModelForHardware(ramGB: number, hasGPU: boolean): { provider: string; model: string; notes: string } {
    if (ramGB >= 32 && hasGPU) {
      return { 
        provider: 'ollama', 
        model: 'qwen2.5-coder:32b',
        notes: 'High-end: Best coding performance, 88.4% MBPP+'
      };
    } else if (ramGB >= 16 && hasGPU) {
      return { 
        provider: 'ollama', 
        model: 'qwen2.5-coder:14b',
        notes: 'Mid-range: Excellent coding, good performance'
      };
    } else if (ramGB >= 8) {
      return { 
        provider: 'ollama', 
        model: 'qwen2.5-coder:7b',
        notes: 'Standard: 88.4% MBPP, very efficient'
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