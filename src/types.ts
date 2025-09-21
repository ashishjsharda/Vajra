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
  tokens?: number;
  cost?: number;
}

export interface VajraConfig {
  // API Keys
  openaiApiKey?: string;
  anthropicApiKey?: string;
  qwenApiKey?: string;
  deepseekApiKey?: string;
  mistralApiKey?: string;
  geminiApiKey?: string;
  groqApiKey?: string;
  openrouterApiKey?: string;
  huggingfaceApiKey?: string;
  
  // Local endpoints
  ollamaEndpoint: string;
  
  // Default settings
  defaultProvider: string;
  defaultModel: string;
  
  // Advanced features
  autoModelSelection: boolean;
  maxTokens: number;
  temperature: number;
  enableCostTracking: boolean;
  enableMultiModalInput: boolean;
}

export interface ModelCapabilities {
  contextWindow: number;
  maxTokens: number;
  supportsVision: boolean;
  supportsAudio: boolean;
  costPer1M: number;
  bestFor: ('code' | 'chat' | 'reasoning' | 'vision' | 'multimodal')[];
}

export interface TaskContext {
  type: 'code' | 'chat' | 'reasoning' | 'vision';
  language?: string;
  fileContent?: string;
  selectedText?: string;
  images?: string[];
}