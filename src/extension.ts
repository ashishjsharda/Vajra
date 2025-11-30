import * as vscode from 'vscode';
import { ChatProvider } from './chat';
import { ProviderManager } from './providers';
import { Utils } from './utils';
import { ConfigManager } from './config';
import { ModelCommands } from './modelUtils';

let chatProvider: ChatProvider;
let providerManager: ProviderManager;

export function activate(context: vscode.ExtensionContext) {
  console.log('Vajra is now active!');

  // Initialize managers
  chatProvider = new ChatProvider(context.extensionUri);
  providerManager = new ProviderManager();

  // Auto-setup on first run
  ConfigManager.autoSetup();

  // Register chat view
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(ChatProvider.viewType, chatProvider)
  );

  // Register core commands
  context.subscriptions.push(
    vscode.commands.registerCommand('vajra.openChat', () => {
      vscode.commands.executeCommand('vajra.chatView.focus');
    })
  );

  // IMPROVED: Better provider selection with instant setup
  context.subscriptions.push(
    vscode.commands.registerCommand('vajra.selectProvider', async () => {
      const providers = providerManager.getAllProviders();
      
      // Create enhanced quick pick items with emojis and better descriptions
      const items = await Promise.all(providers.map(async p => {
        let description = '';
        let detail = '';
        let emoji = '';
        
        // Add status emoji
        if (p.isConfigured()) {
          emoji = '✅';
          description = 'Ready to use';
        } else {
          emoji = '⚙️';
          description = 'Setup required';
        }
        
        // Add special status for Ollama
        if (p.name === 'ollama') {
          try {
            const models = await ConfigManager.getAvailableOllamaModels();
            if (models.length > 0) {
              emoji = '✅';
              description = `${models.length} models available`;
              detail = `Local & Private • Models: ${models.slice(0, 3).join(', ')}${models.length > 3 ? '...' : ''}`;
            } else {
              emoji = '⚙️';
              description = 'Connected but no models';
              detail = 'Install models with: ollama pull qwen2.5-coder:7b';
            }
          } catch (error) {
            emoji = '❌';
            description = 'Not running';
            detail = 'Start Ollama or download from ollama.ai';
          }
        }
        
        // Add provider-specific details
        if (p.name === 'openai') {
          detail = 'GPT-4 Turbo • Best overall • Premium pricing';
        } else if (p.name === 'anthropic') {
          detail = 'Claude 3.5 Sonnet • Best reasoning • Large context';
        } else if (p.name === 'qwen') {
          detail = 'Qwen2.5-Coder • Best for coding • Great value';
        } else if (p.name === 'deepseek') {
          detail = 'DeepSeek-Coder • Excellent coding • Low cost';
        } else if (p.name === 'groq') {
          detail = 'Ultra-fast inference • Free tier available';
        }
        
        return {
          label: `${emoji} ${p.displayName}`,
          description: description,
          detail: detail,
          value: p.name,
          provider: p
        };
      }));

      // Sort: Ready providers first, then others
      items.sort((a, b) => {
        if (a.label.startsWith('✅') && !b.label.startsWith('✅')) return -1;
        if (!a.label.startsWith('✅') && b.label.startsWith('✅')) return 1;
        return 0;
      });

      const selected = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select your AI provider',
        title: 'Vajra - Choose AI Provider',
        ignoreFocusOut: true
      });

      if (selected) {
        const provider = selected.provider;
        
        // If provider needs configuration, set it up
        if (!provider.isConfigured()) {
          const setupSuccess = await setupProvider(provider.name);
          if (!setupSuccess) {
            vscode.window.showWarningMessage('Provider setup cancelled or failed. You can set it up later.');
            return;
          }
        }
        
        // Update configuration
        const config = vscode.workspace.getConfiguration('vajra');
        await config.update('defaultProvider', provider.name, vscode.ConfigurationTarget.Global);
        
        // Set appropriate default model
        let defaultModel = '';
        if (provider.name === 'ollama') {
          defaultModel = await ConfigManager.getSmartDefaultModel();
        } else if (provider.name === 'openai') {
          defaultModel = 'gpt-4-turbo';
        } else if (provider.name === 'anthropic') {
          defaultModel = 'claude-3-5-sonnet-20241022';
        } else if (provider.name === 'qwen') {
          defaultModel = 'qwen2.5-coder-7b-instruct';
        } else if (provider.name === 'deepseek') {
          defaultModel = 'deepseek-coder';
        } else if (provider.name === 'groq') {
          defaultModel = 'llama-3.1-8b-instant';
        } else {
          defaultModel = provider.models[0];
        }
        
        await config.update('defaultModel', defaultModel, vscode.ConfigurationTarget.Global);
        
        // Show success message with next steps
        const message = `✅ Switched to ${provider.displayName}`;
        const action = await vscode.window.showInformationMessage(
          message,
          'Test It',
          'Choose Model',
          'Done'
        );
        
        if (action === 'Test It') {
          vscode.commands.executeCommand('vajra.openChat');
        } else if (action === 'Choose Model') {
          await selectModelForProvider(provider);
        }
      }
    })
  );

  // NEW: Quick command to change model without changing provider
  context.subscriptions.push(
    vscode.commands.registerCommand('vajra.selectModel', async () => {
      const config = ConfigManager.getConfig();
      const provider = providerManager.getProvider(config.defaultProvider);
      
      if (!provider) {
        vscode.window.showErrorMessage('No provider selected. Please select a provider first.');
        return;
      }
      
      await selectModelForProvider(provider);
    })
  );

  // Register code action commands
  const codeCommands = [
    { command: 'vajra.explainCode', action: 'explain' },
    { command: 'vajra.generateCode', action: 'generate' },
    { command: 'vajra.refactorCode', action: 'refactor' },
    { command: 'vajra.debugCode', action: 'debug' },
    { command: 'vajra.optimizeCode', action: 'optimize' },
    { command: 'vajra.addComments', action: 'comment' },
    { command: 'vajra.createTests', action: 'test' }
  ];

  codeCommands.forEach(({ command, action }) => {
    context.subscriptions.push(
      vscode.commands.registerCommand(command, async () => {
        if (action === 'generate') {
          await handleCodeGeneration();
        } else {
          await handleCodeAction(action);
        }
      })
    );
  });

  // Register model management commands from ModelUtils
  ModelCommands.registerCommands(context);

  // Set context for when chat is visible
  vscode.commands.executeCommand('setContext', 'vajra.chatVisible', true);

  Utils.showInfo('Vajra activated! Use "Vajra: Open Chat" to start.');
}

/**
 * Setup provider with user-friendly flow
 */
async function setupProvider(providerName: string): Promise<boolean> {
  if (providerName === 'ollama') {
    return await setupOllama();
  } else {
    return await setupCloudProvider(providerName);
  }
}

/**
 * Setup Ollama with helpful guidance
 */
async function setupOllama(): Promise<boolean> {
  const choice = await vscode.window.showInformationMessage(
    '🏠 Ollama runs AI models locally on your computer',
    {
      modal: true,
      detail: 'Benefits:\n• Complete privacy - your code never leaves your machine\n• No API costs\n• Works offline\n\nRequires: Ollama installed and running'
    },
    'Download Ollama',
    'Already Installed',
    'Choose Different Provider'
  );

  if (choice === 'Download Ollama') {
    vscode.env.openExternal(vscode.Uri.parse('https://ollama.ai/download'));
    
    const installed = await vscode.window.showInformationMessage(
      'After installing Ollama, pull a coding model',
      {
        modal: true,
        detail: 'Recommended command:\n\nollama pull qwen2.5-coder:7b\n\nThis downloads the best coding model (4.1GB)'
      },
      'I\'ve Done This',
      'Show Setup Guide'
    );
    
    if (installed === 'Show Setup Guide') {
      await vscode.commands.executeCommand('vajra.getSetupRecommendations');
    }
    
    return installed === 'I\'ve Done This';
  } else if (choice === 'Already Installed') {
    // Verify Ollama is running and has models
    try {
      const models = await ConfigManager.getAvailableOllamaModels();
      if (models.length === 0) {
        const pullModel = await vscode.window.showWarningMessage(
          'Ollama is running but no models found',
          'Install Recommended Model',
          'Show Available Models'
        );
        
        if (pullModel === 'Install Recommended Model') {
          const terminal = vscode.window.createTerminal('Ollama Setup');
          terminal.show();
          terminal.sendText('ollama pull qwen2.5-coder:7b');
        } else if (pullModel === 'Show Available Models') {
          vscode.env.openExternal(vscode.Uri.parse('https://ollama.ai/library'));
        }
        return false;
      }
      
      vscode.window.showInformationMessage(`✅ Ollama ready with ${models.length} model(s): ${models[0]}`);
      return true;
    } catch (error) {
      vscode.window.showErrorMessage('Cannot connect to Ollama. Please make sure it\'s running.');
      return false;
    }
  }
  
  return false;
}

/**
 * Setup cloud provider with API key
 */
async function setupCloudProvider(providerName: string): Promise<boolean> {
  const providerInfo: { [key: string]: { name: string; url: string; description: string } } = {
    'openai': {
      name: 'OpenAI',
      url: 'https://platform.openai.com/api-keys',
      description: 'Get your API key from OpenAI Platform. You may need to add payment method.'
    },
    'anthropic': {
      name: 'Anthropic',
      url: 'https://console.anthropic.com/',
      description: 'Get your API key from Anthropic Console. Free credits available for new users.'
    },
    'qwen': {
      name: 'Qwen/Alibaba Cloud',
      url: 'https://dashscope.aliyun.com/',
      description: 'Get your API key from Alibaba Cloud DashScope.'
    },
    'deepseek': {
      name: 'DeepSeek',
      url: 'https://platform.deepseek.com/',
      description: 'Get your API key from DeepSeek Platform. Very affordable pricing.'
    },
    'groq': {
      name: 'Groq',
      url: 'https://console.groq.com/',
      description: 'Get your API key from Groq Console. Free tier available.'
    },
    'gemini': {
      name: 'Google Gemini',
      url: 'https://makersuite.google.com/app/apikey',
      description: 'Get your API key from Google AI Studio. Free tier available.'
    }
  };

  const info = providerInfo[providerName];
  if (!info) {
    return await ConfigManager.promptForApiKey(providerName) !== undefined;
  }

  const choice = await vscode.window.showInformationMessage(
    `Setup ${info.name}`,
    {
      modal: true,
      detail: info.description
    },
    'Enter API Key',
    'Get API Key',
    'Cancel'
  );

  if (choice === 'Get API Key') {
    vscode.env.openExternal(vscode.Uri.parse(info.url));
    
    const hasKey = await vscode.window.showInformationMessage(
      'Once you have your API key, click "Enter API Key"',
      'Enter API Key',
      'Cancel'
    );
    
    if (hasKey !== 'Enter API Key') {
      return false;
    }
  } else if (choice !== 'Enter API Key') {
    return false;
  }

  // Prompt for API key
  const apiKey = await vscode.window.showInputBox({
    prompt: `Enter your ${info.name} API key`,
    password: true,
    placeHolder: 'sk-...',
    ignoreFocusOut: true,
    validateInput: (value) => {
      if (!value || value.trim().length === 0) {
        return 'API key cannot be empty';
      }
      if (value.length < 20) {
        return 'API key seems too short. Please check it.';
      }
      return null;
    }
  });

  if (!apiKey) {
    return false;
  }

  // Save API key
  await ConfigManager.setApiKey(providerName, apiKey);
  
  vscode.window.showInformationMessage(`✅ ${info.name} API key saved successfully!`);
  return true;
}

/**
 * Select model for a specific provider
 */
/**
 * Select model for a specific provider
 */
async function selectModelForProvider(provider: any): Promise<void> {
  interface ModelQuickPickItem extends vscode.QuickPickItem {
    label: string;
    description: string;
    detail: string;
  }

  const items: ModelQuickPickItem[] = provider.models.map((model: string) => {
    let description = '';
    let detail = '';
    
    // Add model-specific info
    if (model.includes('gpt-4-turbo') || model.includes('gpt-4o')) {
      description = 'Recommended';
      detail = 'Latest and most capable';
    } else if (model.includes('claude-3-5-sonnet')) {
      description = 'Recommended';
      detail = 'Best reasoning and coding';
    } else if (model.includes('qwen2.5-coder-7b')) {
      description = 'Recommended';
      detail = 'Best balance of speed and quality';
    } else if (model.includes('32b') || model.includes('70b')) {
      description = 'High Performance';
      detail = 'Requires more resources';
    } else if (model.includes('1.5b') || model.includes('3b')) {
      description = 'Fast & Efficient';
      detail = 'Lower resource usage';
    }
    
    return {
      label: model,
      description: description,
      detail: detail
    };
  });

  const selected = await vscode.window.showQuickPick<ModelQuickPickItem>(items, {
    placeHolder: `Select model for ${provider.displayName}`,
    title: 'Choose AI Model',
    ignoreFocusOut: true
  });

  if (selected) {
    const config = vscode.workspace.getConfiguration('vajra');
    await config.update('defaultModel', selected.label, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage(`✅ Model changed to ${selected.label}`);
  }
}

async function handleCodeAction(action: string) {
  const selectedText = Utils.getSelectedText();
  if (!selectedText) {
    Utils.showError('Please select some code first');
    return;
  }

  const language = Utils.getLanguage();
  let message = '';

  switch (action) {
    case 'explain':
      message = `Explain this ${language} code:\n\`\`\`${language}\n${selectedText}\n\`\`\``;
      break;
    case 'refactor':
      message = `Refactor this ${language} code for better readability and performance:\n\`\`\`${language}\n${selectedText}\n\`\`\``;
      break;
    case 'debug':
      message = `Help me debug this ${language} code. Find potential issues and suggest fixes:\n\`\`\`${language}\n${selectedText}\n\`\`\``;
      break;
    case 'optimize':
      message = `Optimize this ${language} code for better performance:\n\`\`\`${language}\n${selectedText}\n\`\`\``;
      break;
    case 'comment':
      message = `Add comprehensive comments to this ${language} code:\n\`\`\`${language}\n${selectedText}\n\`\`\``;
      break;
    case 'test':
      message = `Generate unit tests for this ${language} code:\n\`\`\`${language}\n${selectedText}\n\`\`\``;
      break;
  }

  // Focus chat and send message
  vscode.commands.executeCommand('vajra.chatView.focus');
  
  Utils.showInfo(`${action.charAt(0).toUpperCase() + action.slice(1)} request prepared for chat`);
}

async function handleCodeGeneration() {
  const prompt = await vscode.window.showInputBox({
    prompt: 'What code would you like to generate?',
    placeHolder: 'e.g., Create a function to validate email addresses'
  });
  
  if (prompt) {
    const language = Utils.getLanguage() || 'javascript';
    const message = `Generate ${language} code for: ${prompt}`;
    
    vscode.commands.executeCommand('vajra.chatView.focus');
    Utils.showInfo('Code generation request prepared for chat');
  }
}

export function deactivate() {}
