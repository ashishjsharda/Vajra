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

      const response = await provider.sendMessage(contextualMessage, config.defaultModel);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
        provider: provider.name,
        model: config.defaultModel
      };

      this.messages.push(assistantMessage);
      this.updateWebview();

    } catch (error: any) {
      Utils.showError(error.message);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `Error: ${error.message}`,
        role: 'assistant',
        timestamp: new Date()
      };

      this.messages.push(errorMessage);
      this.updateWebview();
    }
  }

  private async selectProvider() {
    const providers = this.providerManager.getAllProviders();
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
  }

  private async configureProvider(providerName: string) {
    if (providerName === 'groq') {
      await ConfigManager.promptForApiKey('groq');
    } else if (providerName === 'huggingface') {
      await ConfigManager.promptForApiKey('huggingface');
    }
    // Ollama doesn't need configuration
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
    </style>
</head>
<body>
    <div class="chat-container" id="chatContainer"></div>
    <div class="input-container">
        <div class="input-row">
            <input type="text" id="messageInput" placeholder="Ask Vajra anything..." />
            <button onclick="sendMessage()">Send</button>
            <button onclick="selectProvider()">Provider</button>
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
            container.innerHTML = messages.map(msg => \`
                <div class="message \${msg.role}">
                    <div>\${formatMessage(msg.content)}</div>
                    \${msg.provider ? \`<div class="provider-info">\${msg.provider} • \${msg.model}</div>\` : ''}
                </div>
            \`).join('');
            container.scrollTop = container.scrollHeight;
        }

        function formatMessage(content) {
            // Basic code block formatting
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