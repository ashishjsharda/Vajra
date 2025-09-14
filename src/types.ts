export interface AIProvider {
  name: string;
  displayName: string;
  models: string[];
  isConfigured: () => boolean;
  sendMessage: (message: string, model?: string) => Promise<string>;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  provider?: string;
  model?: string;
}

export interface VajraConfig {
  groqApiKey?: string;
  ollamaEndpoint: string;
  huggingfaceApiKey?: string;
  defaultProvider: string;
  defaultModel: string;
}