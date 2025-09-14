import * as vscode from 'vscode';
import { VajraConfig } from './types';

export class ConfigManager {
  static getConfig(): VajraConfig {
    const config = vscode.workspace.getConfiguration('vajra');
    
    return {
      groqApiKey: config.get('groqApiKey'),
      ollamaEndpoint: config.get('ollamaEndpoint', 'http://localhost:11434'),
      huggingfaceApiKey: config.get('huggingfaceApiKey'),
      defaultProvider: config.get('defaultProvider', 'groq'),
      defaultModel: config.get('defaultModel', 'llama-3.1-8b-instant')
    };
  }

  static async setApiKey(provider: string, key: string) {
    const config = vscode.workspace.getConfiguration('vajra');
    await config.update(`${provider}ApiKey`, key, vscode.ConfigurationTarget.Global);
  }

  static async promptForApiKey(provider: string): Promise<string | undefined> {
    const key = await vscode.window.showInputBox({
      prompt: `Enter your ${provider} API key`,
      password: true,
      ignoreFocusOut: true
    });

    if (key) {
      await this.setApiKey(provider, key);
    }

    return key;
  }
}