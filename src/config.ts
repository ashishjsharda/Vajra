import * as vscode from 'vscode';
import axios from 'axios';
import { VajraConfig } from './types';

export class ConfigManager {
  static getConfig(): VajraConfig {
    const config = vscode.workspace.getConfiguration('vajra');
    
    return {
      // API Keys
      openaiApiKey: config.get('openaiApiKey'),
      anthropicApiKey: config.get('anthropicApiKey'),
      qwenApiKey: config.get('qwenApiKey'),
      deepseekApiKey: config.get('deepseekApiKey'),
      mistralApiKey: config.get('mistralApiKey'),
      geminiApiKey: config.get('geminiApiKey'),
      groqApiKey: config.get('groqApiKey'),
      openrouterApiKey: config.get('openrouterApiKey'),
      huggingfaceApiKey: config.get('huggingfaceApiKey'),
      
      // Local endpoints
      ollamaEndpoint: config.get('ollamaEndpoint', 'http://localhost:11434'),
      
      // Default settings
      defaultProvider: config.get('defaultProvider', 'ollama'),
      defaultModel: config.get('defaultModel', 'qwen2.5-coder:7b'),
      
      // Advanced features
      autoModelSelection: config.get('autoModelSelection', true),
      maxTokens: config.get('maxTokens', 4096),
      temperature: config.get('temperature', 0.7),
      enableCostTracking: config.get('enableCostTracking', false),
      enableMultiModalInput: config.get('enableMultiModalInput', true)
    };
  }

  static async setApiKey(provider: string, key: string) {
    const config = vscode.workspace.getConfiguration('vajra');
    await config.update(`${provider}ApiKey`, key, vscode.ConfigurationTarget.Global);
  }

  static async promptForApiKey(provider: string): Promise<string | undefined> {
    const providerNames: { [key: string]: string } = {
      'openai': 'OpenAI',
      'anthropic': 'Anthropic',
      'qwen': 'Qwen/Alibaba Cloud',
      'deepseek': 'DeepSeek',
      'mistral': 'Mistral',
      'gemini': 'Google Gemini',
      'groq': 'Groq',
      'openrouter': 'OpenRouter',
      'huggingface': 'HuggingFace'
    };

    const key = await vscode.window.showInputBox({
      prompt: `Enter your ${providerNames[provider] || provider} API key`,
      password: true,
      ignoreFocusOut: true
    });

    if (key) {
      await this.setApiKey(provider, key);
    }

    return key;
  }

  static async getAvailableOllamaModels(): Promise<string[]> {
    try {
      const config = this.getConfig();
      const endpoint = config.ollamaEndpoint;
      
      const response = await axios.get(`${endpoint}/api/tags`, { timeout: 5000 });
      return response.data.models?.map((m: any) => m.name) || [];
    } catch (error) {
      return [];
    }
  }

  static async getSmartDefaultModel(): Promise<string> {
    try {
      const availableModels = await this.getAvailableOllamaModels();
      
      if (availableModels.length === 0) {
        return 'qwen2.5-coder:7b';
      }

      const codingPriority = [
        'qwen2.5-coder:7b',
        'qwen2.5-coder:1.5b',
        'deepseek-coder-v2:16b',
        'deepseek-coder:6.7b',
        'codellama:7b',
        'codellama:13b',
        'starcoder2:7b',
        'llama3.3:70b',
        'llama3.2:3b'
      ];

      for (const preferred of codingPriority) {
        if (availableModels.includes(preferred)) {
          return preferred;
        }
      }

      return availableModels[0];
      
    } catch (error) {
      return 'qwen2.5-coder:7b';
    }
  }

  static async autoSetup(): Promise<void> {
    const config = vscode.workspace.getConfiguration('vajra');
    
    const currentProvider = config.get('defaultProvider');
    const currentModel = config.get('defaultModel');
    
    // Skip if user has customized
    if (currentProvider !== 'ollama' && currentProvider !== 'groq') {
      return;
    }

    try {
      const availableModels = await this.getAvailableOllamaModels();
      
      if (availableModels.length > 0) {
        const smartModel = await this.getSmartDefaultModel();
        
        await config.update('defaultProvider', 'ollama', vscode.ConfigurationTarget.Global);
        await config.update('defaultModel', smartModel, vscode.ConfigurationTarget.Global);
        
        vscode.window.showInformationMessage(
          `Vajra configured to use Ollama with ${smartModel}`,
          'Show Models'
        ).then(choice => {
          if (choice === 'Show Models') {
            vscode.commands.executeCommand('vajra.showModelStatus');
          }
        });
      }
    } catch (error) {
      // Ollama not available, keep defaults
    }
  }
}
