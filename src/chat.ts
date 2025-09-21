import * as vscode from 'vscode';
import * as path from 'path';
import { ChatMessage } from './types';
import { ProviderManager } from './providers';
import { ConfigManager } from './config';
import { Utils } from './utils';

export class ChatProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'vajra.chatView';
  private _view?: vscode.WebviewView;
  private messages: ChatMessage[] = [];
  private providerManager: ProviderManager;

  constructor(private readonly _extensionUri: vscode.Uri) {
    this.providerManager = new ProviderManager();
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case 'sendMessage':
          await this.handleMessage(data.message);
          break;
        case 'selectProvider':
          await this.selectProvider();
          break;
        case 'checkOllama':
          await this.checkOllamaStatus();
          break;
      }
    });
  }

  private async handleMessage(message: string) {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    this.updateWebview();

    try {
      const config = ConfigManager.getConfig();
      const provider = this.providerManager.getProvider(config.defaultProvider);

      if (!provider) {
        throw new Error(`Provider ${config.defaultProvider} not found`);
      }

      if (!provider.isConfigured()) {
        await this.configureProvider(config.defaultProvider);
        return;
      }

      // Add context if code is selected
      let contextualMessage = message;
      const selectedText = Utils.getSelectedText();
      if (selectedText) {
        const language = Utils.getLanguage();
        contextualMessage = `Here's my ${language} code:\n\`\`\`${language}\n${selectedText}\n\`\`\`\n\nQuestion: ${message}`;
      }

      // For Ollama, use smart model detection
      let modelToUse = config.defaultModel;
      if (config.defaultProvider === 'ollama') {
        modelToUse = await this.getSmartOllamaModel(config.defaultModel);
      }

      const response = await provider.sendMessage(contextualMessage, modelToUse);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
        provider: provider.name,
        model: modelToUse
      };

      this.messages.push(assistantMessage);
      this.updateWebview();

    } catch (error: any) {
      await this.handleError(error);
    }
  }

  /**
   * Smart model detection for Ollama
   */
  private async getSmartOllamaModel(requestedModel: string): Promise<string> {
    try {
      const availableModels = await ConfigManager.getAvailableOllamaModels();
      
      if (availableModels.length === 0) {
        throw new Error('No Ollama models installed. Please install a model first.');
      }

      // Check if requested model exists
      if (availableModels.includes(requestedModel)) {
        return requestedModel;
      }

      // Find best alternative
      const smartDefault = await ConfigManager.getSmartDefaultModel();
      
      // Show user-friendly notification about model switch
      if (requestedModel !== smartDefault) {
        vscode.window.showInformationMessage(
          `Using '${smartDefault}' instead of '${requestedModel}'. To install: ollama pull ${requestedModel}`,
          'Install Model',
          'Show Available'
        ).then(choice => {
          if (choice === 'Install Model') {
            const terminal = vscode.window.createTerminal('Ollama');
            terminal.show();
            terminal.sendText(`ollama pull ${requestedModel}`);
          } else if (choice === 'Show Available') {
            vscode.commands.executeCommand('vajra.showModelStatus');
          }
        });
      }

      return smartDefault;
      
    } catch (error) {
      throw new Error(`Ollama error: ${error.message}`);
    }
  }

  /**
   * Enhanced error handling
   */
  private async handleError(error: any) {
    let errorMessage = error.message;
    let showActions = false;

    // Ollama-specific error handling
    if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('not running')) {
      errorMessage = 'Ollama server not running. Please start Ollama first.';
      showActions = true;
      
      vscode.window.showErrorMessage(
        errorMessage,
        'Download Ollama',
        'Setup Guide'
      ).then(choice => {
        if (choice === 'Download Ollama') {
          vscode.env.openExternal(vscode.Uri.parse('https://ollama.ai/download'));
        } else if (choice === 'Setup Guide') {
          this.showOllamaSetupGuide();
        }
      });
    } 
    // Model not found errors
    else if (errorMessage.includes('not found') || errorMessage.includes('does not exist')) {
      showActions = true;
      
      vscode.window.showErrorMessage(
        errorMessage,
        'Show Models',
        'Install Recommended'
      ).then(choice => {
        if (choice === 'Show Models') {
          vscode.commands.executeCommand('vajra.showModelStatus');
        } else if (choice === 'Install Recommended') {
          const terminal = vscode.window.createTerminal('Ollama');
          terminal.show();
          terminal.sendText('ollama pull qwen2.5-coder:7b');
        }
      });
    }

    // Show error in chat
    Utils.showError(errorMessage);
    
    const errorChatMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: `Error: ${errorMessage}`,
      role: 'assistant',
      timestamp: new Date()
    };

    this.messages.push(errorChatMessage);
    this.updateWebview();
  }

  private showOllamaSetupGuide() {
    const content = `# Ollama Setup Guide

## 1. Download & Install
Visit: https://ollama.ai/download

## 2. Install Your First Model
\`\`\`bash
# Best coding model (recommended)
ollama pull qwen2.5-coder:7b

# Or use what you already have
ollama pull llama2:latest
\`\`\`

## 3. Verify Installation
\`\`\`bash
ollama list
ollama run llama2:latest "Hello, write a Python function"
\`\`\`

## 4. Configure Vajra
After installation, Vajra will automatically detect your models.`;

    vscode.workspace.openTextDocument({
      content,
      language: 'markdown'
    }).then(doc => {
      vscode.window.showTextDocument(doc);
    });
  }

  private async selectProvider() {
    const providers = this.providerManager.getAllProviders();
    const items = await Promise.all(providers.map(async p => {
      let description = p.isConfigured() ? '✅ Configured' : '⚠️ Not configured';
      
      if (p.name === 'ollama') {
        try {
          const models = await ConfigManager.getAvailableOllamaModels();
          description += ` (${models.length} models)`;
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
      
      if ((selected as any).value === 'ollama') {
        const smartModel = await ConfigManager.getSmartDefaultModel();
        await config.update('defaultModel', smartModel, vscode.ConfigurationTarget.Global);
      }
      
      Utils.showInfo(`Switched to ${selected.label}`);
    }
  }

  private async checkOllamaStatus() {
    try {
      const models = await ConfigManager.getAvailableOllamaModels();
      if (models.length > 0) {
        Utils.showInfo(`Ollama connected with ${models.length} models: ${models.join(', ')}`);
      } else {
        Utils.showError('Ollama connected but no models installed');
      }
    } catch (error) {
      Utils.showError('Ollama not available. Please check if it\'s running.');
    }
  }

  private async configureProvider(providerName: string) {
    const apiKeyProviders = ['openai', 'anthropic', 'qwen', 'deepseek', 'mistral', 'gemini', 'groq', 'openrouter', 'huggingface'];
    
    if (apiKeyProviders.includes(providerName)) {
      await ConfigManager.promptForApiKey(providerName);
    } else if (providerName === 'ollama') {
      const choice = await vscode.window.showInformationMessage(
        'Ollama requires local installation. Would you like setup help?',
        'Setup Guide',
        'Download Ollama'
      );
      
      if (choice === 'Setup Guide') {
        this.showOllamaSetupGuide();
      } else if (choice === 'Download Ollama') {
        vscode.env.openExternal(vscode.Uri.parse('https://ollama.ai/download'));
      }
    }
  }

  private updateWebview() {
    if (this._view) {
      this._view.webview.postMessage({
        type: 'updateMessages',
        messages: this.messages
      });
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vajra Chat</title>
    <style>
        body { 
            font-family: var(--vscode-font-family); 
            margin: 0; 
            padding: 10px; 
            color: var(--vscode-foreground);
            background: var(--vscode-editor-background);
        }
        .chat-container { height: calc(100vh - 60px); overflow-y: auto; }
        .message { 
            margin: 10px 0; 
            padding: 10px; 
            border-radius: 8px; 
            max-width: 90%;
        }
        .user { 
            background: var(--vscode-inputValidation-infoBorder); 
            margin-left: auto; 
            text-align: right;
        }
        .assistant { 
            background: var(--vscode-textBlockQuote-background); 
        }
        .input-container { 
            position: fixed; 
            bottom: 0; 
            left: 0; 
            right: 0; 
            padding: 10px; 
            background: var(--vscode-editor-background);
            border-top: 1px solid var(--vscode-widget-border);
        }
        .input-row { display: flex; gap: 5px; }
        input { 
            flex: 1; 
            padding: 8px; 
            border: 1px solid var(--vscode-input-border);
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border-radius: 4px;
        }
        button { 
            padding: 8px 16px; 
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background: var(--vscode-button-hoverBackground);
        }
        .provider-info { 
            font-size: 0.8em; 
            color: var(--vscode-descriptionForeground); 
            margin-top: 5px; 
        }
        pre { 
            background: var(--vscode-textPreformat-background); 
            padding: 10px; 
            border-radius: 4px; 
            overflow-x: auto; 
        }
        .error-message {
            color: var(--vscode-errorForeground);
            background: var(--vscode-inputValidation-errorBackground);
        }
    </style>
</head>
<body>
    <div class="chat-container" id="chatContainer"></div>
    <div class="input-container">
        <div class="input-row">
            <input type="text" id="messageInput" placeholder="Ask Vajra anything..." />
            <button onclick="sendMessage()">Send</button>
            <button onclick="selectProvider()">Provider</button>
            <button onclick="checkOllama()" title="Check Ollama Status">🔍</button>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        let messages = [];

        window.addEventListener('message', event => {
            const message = event.data;
            if (message.type === 'updateMessages') {
                messages = message.messages;
                renderMessages();
            }
        });

        function renderMessages() {
            const container = document.getElementById('chatContainer');
            container.innerHTML = messages.map(msg => {
                const isError = msg.content.startsWith('Error:');
                const className = \`message \${msg.role} \${isError ? 'error-message' : ''}\`;
                
                return \`
                    <div class="\${className}">
                        <div>\${formatMessage(msg.content)}</div>
                        \${msg.provider ? \`<div class="provider-info">\${msg.provider} • \${msg.model}</div>\` : ''}
                    </div>
                \`;
            }).join('');
            container.scrollTop = container.scrollHeight;
        }

        function formatMessage(content) {
            return content
                .replace(/\`\`\`([\\s\\S]*?)\`\`\`/g, '<pre><code>$1</code></pre>')
                .replace(/\`([^\`]+)\`/g, '<code>$1</code>')
                .replace(/\\n/g, '<br>');
        }

        function sendMessage() {
            const input = document.getElementById('messageInput');
            if (input.value.trim()) {
                vscode.postMessage({
                    type: 'sendMessage',
                    message: input.value
                });
                input.value = '';
            }
        }

        function selectProvider() {
            vscode.postMessage({ type: 'selectProvider' });
        }

        function checkOllama() {
            vscode.postMessage({ type: 'checkOllama' });
        }

        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    </script>
</body>
</html>`;
  }
}