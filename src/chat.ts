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
        case 'applyCode':
          await this.handleApplyCode(data.code);
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
      
      if (!config.defaultProvider) {
         throw new Error('No provider selected. Please select a provider first.');
      }
      
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
   * Handle applying code directly to the editor
   */
  private async handleApplyCode(code: string) {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        await editor.edit(editBuilder => {
            // Check if there is a selection to replace, otherwise insert at cursor
            if (!editor.selection.isEmpty) {
               editBuilder.replace(editor.selection, code);
            } else {
               editBuilder.insert(editor.selection.active, code);
            }
        });
        vscode.window.showInformationMessage('Code applied successfully! ⚡');
    } else {
        vscode.window.showErrorMessage('No active editor found to apply code.');
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
      
    } catch (error: any) {
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
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <style>
        :root {
            --primary: #3b82f6;
            --primary-glow: rgba(59, 130, 246, 0.5);
            --bg-opacity: 0.7;
            --radius: 12px;
        }
        body { 
            font-family: 'Segoe UI', Inter, sans-serif; 
            margin: 0; 
            padding: 0; 
            color: var(--vscode-foreground);
            background: transparent;
        }
        
        /* Sexy Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: var(--vscode-scrollbarSlider-background); border-radius: 3px; }

        .chat-container { 
            height: calc(100vh - 100px); 
            overflow-y: auto; 
            padding: 20px; 
            display: flex; 
            flex-direction: column; 
            gap: 20px;
        }

        .message { 
            padding: 16px; 
            border-radius: var(--radius); 
            max-width: 90%;
            line-height: 1.5;
            position: relative;
            animation: fadeIn 0.3s ease-out;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .user { 
            align-self: flex-end;
            background: linear-gradient(135deg, var(--vscode-button-background), var(--vscode-button-hoverBackground));
            color: var(--vscode-button-foreground);
            border-bottom-right-radius: 2px;
        }

        .assistant { 
            align-self: flex-start;
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-widget-border);
            border-bottom-left-radius: 2px;
        }

        /* Code Blocks */
        pre { 
            background: #1e1e1e !important; 
            padding: 12px; 
            border-radius: 8px; 
            overflow-x: auto; 
            position: relative;
            margin: 10px 0;
            border: 1px solid #333;
        }
        
        /* The "Cursor" Magic: Apply Button */
        .code-actions {
            display: flex;
            justify-content: flex-end;
            background: #2d2d2d;
            padding: 4px 8px;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            border-bottom: 1px solid #333;
            margin-bottom: -10px; /* Pull pre up */
            position: relative;
            z-index: 10;
        }
        
        .apply-btn {
            background: transparent;
            color: #ccc;
            border: none;
            cursor: pointer;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            border-radius: 4px;
            transition: all 0.2s;
        }
        .apply-btn:hover { background: rgba(255,255,255,0.1); color: white; }

        /* Input Area - Glassmorphism */
        .input-container { 
            position: fixed; 
            bottom: 20px; 
            left: 20px; 
            right: 20px; 
            background: var(--vscode-input-background);
            border: 1px solid var(--vscode-input-border);
            border-radius: 24px;
            padding: 8px 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            backdrop-filter: blur(10px);
        }

        textarea { 
            flex: 1; 
            background: transparent;
            border: none;
            color: var(--vscode-input-foreground);
            font-family: inherit;
            resize: none;
            height: 24px;
            max-height: 150px;
            outline: none;
            padding: 8px 0;
        }

        .icon-btn {
            background: transparent;
            border: none;
            color: var(--vscode-descriptionForeground);
            cursor: pointer;
            padding: 6px;
            border-radius: 50%;
            transition: 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .icon-btn:hover { background: rgba(255,255,255,0.1); color: var(--vscode-foreground); }
        .send-btn { color: var(--primary); }
        
        /* Markdown Styles */
        .message p { margin: 0 0 10px 0; }
        .message p:last-child { margin: 0; }
        .user p { margin: 0; }
    </style>
</head>
<body>
    <div class="chat-container" id="chatContainer">
        <div class="message assistant">
            Hi! I'm Vajra. <br>Type <code>@</code> to reference files or <code>Cmd+L</code> to select code.
        </div>
    </div>
    
    <div class="input-container">
        <button class="icon-btn" onclick="selectProvider()" title="Models">🤖</button>
        <textarea id="messageInput" placeholder="Ask anything... (Enter to send, Shift+Enter for new line)" rows="1"></textarea>
        <button class="icon-btn send-btn" onclick="sendMessage()">➤</button>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        // Auto-resize textarea
        const tx = document.getElementsByTagName("textarea");
        for (let i = 0; i < tx.length; i++) {
            tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
            tx[i].addEventListener("input", OnInput, false);
        }
        function OnInput() {
            this.style.height = 0;
            this.style.height = (this.scrollHeight) + "px";
        }

        // Markdown Configuration
        marked.setOptions({
            highlight: function(code, lang) {
                const language = highlight.getLanguage(lang) ? lang : 'plaintext';
                return highlight.highlight(code, { language }).value;
            }
        });

        window.addEventListener('message', event => {
            const message = event.data;
            if (message.type === 'updateMessages') {
                renderMessages(message.messages);
            }
        });

        function renderMessages(messages) {
            const container = document.getElementById('chatContainer');
            container.innerHTML = messages.map(msg => {
                const isUser = msg.role === 'user';
                
                // Render Markdown
                let contentHtml = isUser ? msg.content : marked.parse(msg.content);
                
                // Add Apply Buttons to code blocks (Regex magic)
                if (!isUser) {
                    contentHtml = contentHtml.replace(/<pre><code class="language-(\\w+)">([\\s\\S]*?)<\\/code><\\/pre>/g, (match, lang, code) => {
                        // We encode the code to pass it safely to the function
                        const encodedCode = encodeURIComponent(code);
                        return \`
                            <div class="code-wrapper">
                                <div class="code-actions">
                                    <button class="apply-btn" onclick="applyCode('\${encodedCode}')">
                                        ⚡ Apply
                                    </button>
                                </div>
                                \${match}
                            </div>
                        \`;
                    });
                }

                return \`
                    <div class="message \${msg.role}">
                        \${contentHtml}
                        \${msg.model ? \`<div style="font-size:0.7em; opacity:0.7; margin-top:8px;">✨ \${msg.model}</div>\` : ''}
                    </div>
                \`;
            }).join('');
            
            // Re-highlight code blocks
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
            
            container.scrollTop = container.scrollHeight;
        }

        function applyCode(encodedCode) {
            const code = decodeURIComponent(encodedCode)
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&');
                
            vscode.postMessage({
                type: 'applyCode',
                code: code
            });
        }

        function sendMessage() {
            const input = document.getElementById('messageInput');
            if (input.value.trim()) {
                vscode.postMessage({ type: 'sendMessage', message: input.value });
                input.value = '';
                input.style.height = '24px';
            }
        }

        function selectProvider() {
            vscode.postMessage({ type: 'selectProvider' });
        }

        // Handle Enter key
        document.getElementById('messageInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    </script>
</body>
</html>`;
  }
}