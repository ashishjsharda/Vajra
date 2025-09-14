import * as vscode from 'vscode';
import { ChatProvider } from './chat';
import { ProviderManager } from './providers';
import { Utils } from './utils';
import { ConfigManager } from './config';

let chatProvider: ChatProvider;
let providerManager: ProviderManager;

export function activate(context: vscode.ExtensionContext) {
  console.log('Vajra is now active!');

  // Initialize managers
  chatProvider = new ChatProvider(context.extensionUri);
  providerManager = new ProviderManager();

  // Register chat view
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(ChatProvider.viewType, chatProvider)
  );

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('vajra.openChat', () => {
      vscode.commands.executeCommand('vajra.chatView.focus');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('vajra.selectProvider', async () => {
      const providers = providerManager.getAllProviders();
      const items = providers.map(p => ({
        label: p.displayName,
        description: p.isConfigured() ? '✅ Configured' : '⚠️ Not configured',
        value: p.name
      }));

      const selected = await Utils.showQuickPick(items);
      if (selected) {
        const config = vscode.workspace.getConfiguration('vajra');
        await config.update('defaultProvider', (selected as any).value, vscode.ConfigurationTarget.Global);
        Utils.showInfo(`Switched to ${selected.label}`);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('vajra.explainCode', async () => {
      const selectedText = Utils.getSelectedText();
      if (!selectedText) {
        Utils.showError('Please select some code first');
        return;
      }

      const language = Utils.getLanguage();
      const message = `Explain this ${language} code:\n\`\`\`${language}\n${selectedText}\n\`\`\``;

      // Focus chat and send message
      vscode.commands.executeCommand('vajra.chatView.focus');
      // Note: In a real implementation, we'd need to send this message to the chat
      Utils.showInfo('Please ask your question in the chat panel');
    })
  );

  // Set context for when chat is visible
  vscode.commands.executeCommand('setContext', 'vajra.chatVisible', true);

  Utils.showInfo('Vajra activated! Use "Vajra: Open Chat" to start.');
}

export function deactivate() {}