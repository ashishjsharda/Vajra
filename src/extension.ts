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

  context.subscriptions.push(
    vscode.commands.registerCommand('vajra.selectProvider', async () => {
      const providers = providerManager.getAllProviders();
      const items = await Promise.all(providers.map(async p => {
        let description = p.isConfigured() ? '✅ Configured' : '⚠️ Not configured';
        
        // Add model count for Ollama
        if (p.name === 'ollama') {
          try {
            const availableModels = await ConfigManager.getAvailableOllamaModels();
            description += ` (${availableModels.length} models)`;
          } catch (error) {
            description += ' (offline)';
          }
        }
        
        return {
          label: p.displayName,
          description,
          value: p.name
        };
      }));

      const selected = await Utils.showQuickPick(items);
      if (selected) {
        const config = vscode.workspace.getConfiguration('vajra');
        await config.update('defaultProvider', (selected as any).value, vscode.ConfigurationTarget.Global);
        
        // Set smart default model for the provider
        if ((selected as any).value === 'ollama') {
          const smartModel = await ConfigManager.getSmartDefaultModel();
          await config.update('defaultModel', smartModel, vscode.ConfigurationTarget.Global);
        }
        
        Utils.showInfo(`Switched to ${selected.label}`);
      }
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
  
  // TODO: In future, send message directly to chat
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