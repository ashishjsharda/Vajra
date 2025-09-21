# Vajra - Enterprise AI Coding Assistant

> **The most comprehensive multi-provider AI coding assistant for VSCode**

Vajra brings the power of GPT-5, Claude 4, Qwen3-Coder, and 10+ cutting-edge AI models directly into your development workflow. Built as a true Cursor alternative with enterprise-grade features, local model support, and intelligent model routing.

## 🚀 Key Features

### **🧠 Latest AI Models (2025)**
- **GPT-5 & Codex** - OpenAI's most advanced coding models (74.9% SWE-bench accuracy)
- **Claude 4 Sonnet/Opus** - 1M token context window for entire codebase understanding  
- **Qwen3-Coder** - Alibaba's specialized 480B coding model with autonomous agent training
- **DeepSeek-Coder V2.5** - Best value with 338 programming languages
- **Mistral Codestral 25.01** - Fastest coding assistant with 86.6% HumanEval
- **Gemini 2.5 Pro** - Multimodal with code execution and 1M context

### **⚡ Smart Features**
- **Intelligent Model Routing** - Automatically selects the best model for each task
- **Multi-Provider Support** - 10+ providers including local Ollama models
- **Enterprise Security** - Local model deployment for sensitive codebases
- **Cost Optimization** - Transparent pricing with usage tracking
- **Multimodal Input** - Image, voice, and code understanding

### **🎯 Coding Superpowers**
- **Code Generation** - Natural language to working code
- **Intelligent Refactoring** - Context-aware code improvements
- **Bug Detection** - AI-powered debugging assistance  
- **Performance Optimization** - Automated code optimization
- **Test Generation** - Comprehensive unit test creation
- **Documentation** - Auto-generated comments and docs

## 🆚 Why Choose Vajra Over Cursor?

| Feature | Vajra | Cursor |
|---------|-------|--------|
| **Model Selection** | 10+ providers, auto-routing | Limited model options |
| **Local Models** | Full Ollama support | No local deployment |
| **Pricing** | Transparent, usage-based | Complex credit system |
| **Enterprise** | Built-in compliance tools | Limited enterprise features |
| **Open Source** | Community-driven | Closed source |
| **Performance** | Optimized for large codebases | Performance issues reported |

## 📦 Quick Start

### 1. Install the Extension
```bash
# Install from VSCode Marketplace
ext install vajra-ai.vajra

# Or install from VSIX
code --install-extension vajra-0.1.0.vsix
```

### 2. Configure Your Preferred Provider

**For Cloud Models (Recommended):**
```json
{
  "vajra.defaultProvider": "qwen",
  "vajra.qwenApiKey": "your-api-key-here",
  "vajra.autoModelSelection": true
}
```

**For Local Models (Privacy-First):**
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a coding model
ollama pull qwen2.5-coder:7b
```

### 3. Start Coding with AI
- **Chat**: Open sidebar and ask questions
- **Code Selection**: Right-click code → "Explain with Vajra"  
- **Quick Actions**: `Ctrl+Shift+P` → "Vajra: Generate Code"

## 🔧 Supported Providers & Models

### **☁️ Cloud Providers**

#### **OpenAI GPT-5 Series**
```typescript
// Best overall performance
models: [
  'gpt-5',           // 74.9% SWE-bench, 272K context
  'gpt-5-codex',     // Specialized coding model
  'o1-preview',      // Advanced reasoning
  'gpt-4o'           // Multimodal capabilities
]
```

#### **Anthropic Claude 4**
```typescript
// Best for reasoning and large context
models: [
  'claude-4-sonnet',    // 1M token context window
  'claude-4-opus',      // Premium reasoning model
  'claude-3.5-sonnet'   // Proven coding performance
]
```

#### **Qwen3-Coder (Alibaba)**
```typescript
// Best for autonomous coding
models: [
  'qwen3-coder-480b-instruct',  // 480B parameter flagship
  'qwen3-coder-32b-instruct',   // Best performance/cost
  'qwen2.5-coder-14b-instruct'  // Efficient option
]
```

#### **DeepSeek-Coder V2.5**
```typescript
// Best value proposition
models: [
  'deepseek-coder-v2.5',        // Latest unified model
  'deepseek-coder-v2-instruct'  // 338 programming languages
]
```

#### **Mistral Codestral**
```typescript
// Fastest coding assistant
models: [
  'codestral-25.01',  // 2x faster generation
  'codestral-22b'     // Proven performance
]
```

### **🏠 Local Models (Ollama)**

#### **Privacy-First Deployment**
```bash
# Top coding models for local deployment
ollama pull qwen2.5-coder:32b      # Best overall local model
ollama pull deepseek-coder-v2:16b  # Great performance, MIT license  
ollama pull starcoder2:15b         # Open source specialist
ollama pull codellama:34b          # Meta's coding model
```

## ⚙️ Configuration

### **Basic Setup**
```json
{
  "vajra.defaultProvider": "qwen",
  "vajra.defaultModel": "qwen3-coder-32b-instruct",
  "vajra.autoModelSelection": true,
  "vajra.temperature": 0.7,
  "vajra.maxTokens": 4096
}
```

### **Enterprise Configuration**
```json
{
  "vajra.enableCostTracking": true,
  "vajra.enableMultiModalInput": true,
  "vajra.ollamaEndpoint": "http://localhost:11434",
  "vajra.autoModelSelection": true
}
```

### **API Key Setup**
Go to `Settings > Extensions > Vajra` and add your API keys:

- **OpenAI**: [Get API Key](https://platform.openai.com/api-keys)
- **Anthropic**: [Get API Key](https://console.anthropic.com/)  
- **Qwen**: [Get API Key](https://dashscope.aliyun.com/)
- **DeepSeek**: [Get API Key](https://platform.deepseek.com/)
- **Mistral**: [Get API Key](https://console.mistral.ai/)
- **Gemini**: [Get API Key](https://makersuite.google.com/app/apikey)

## 🎨 Usage Examples

### **Generate Code from Natural Language**
```typescript
// Type: "Create a React component for a todo list"
// Vajra generates:

import React, { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { 
        id: Date.now(), 
        text: input, 
        completed: false 
      }]);
      setInput('');
    }
  };

  return (
    <div className="todo-list">
      <input 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        placeholder="Add a todo..."
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
```

### **Intelligent Code Refactoring**
```typescript
// Before (select this code):
function processUsers(users) {
  let result = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].age >= 18) {
      result.push({
        name: users[i].name,
        email: users[i].email,
        isAdult: true
      });
    }
  }
  return result;
}

// Right-click → "Refactor with Vajra"
// After:
const processAdultUsers = (users: User[]): ProcessedUser[] => {
  return users
    .filter(user => user.age >= 18)
    .map(user => ({
      name: user.name,
      email: user.email,
      isAdult: true
    }));
};
```

### **Smart Debugging**
```typescript
// Buggy code:
function calculateTotal(items) {
  let total = 0;
  for (item of items) {  // Missing 'const'
    total += item.price * item.quantity;
  }
  return total;
}

// Select code → "Debug with Vajra"
// Vajra identifies: "Missing 'const' declaration in for-of loop"
// Provides fix with explanation
```

## 🏢 Enterprise Features

### **Security & Compliance**
- **Local Model Deployment** - Keep sensitive code on-premises
- **Audit Trails** - Complete usage logging and tracking
- **SOC 2 Ready** - Enterprise security standards
- **Data Privacy** - No code storage on external servers with local models

### **Team Management**
- **Usage Analytics** - Track model usage and costs across teams
- **Model Policies** - Enforce approved models for different projects
- **Budget Controls** - Set spending limits and alerts

### **DevOps Integration**
- **CI/CD Pipeline** - Integrate AI code review in automated workflows
- **Git Integration** - AI-powered commit message generation
- **Code Quality** - Automated code review and suggestions

## 🚀 Performance Benchmarks

| Model | HumanEval | MBPP | SWE-bench | Context | Speed |
|-------|-----------|------|-----------|---------|-------|
| **GPT-5 Codex** | **91.2%** | **89.7%** | **74.9%** | 272K | Fast |
| **Qwen3-Coder-32B** | 88.4% | 86.1% | 68.2% | 256K | Fast |
| **Claude 4 Sonnet** | 84.9% | 82.3% | 49.0% | **1M** | Medium |
| **DeepSeek-V2.5** | 90.2% | 76.2% | 43.4% | 128K | Fast |
| **Codestral 25.01** | **86.6%** | 81.1% | 42.8% | 256K | **Fastest** |

> *Benchmarks as of September 2025*

## 💰 Pricing Comparison

### **API Costs (per 1M tokens)**
| Provider | Input | Output | Best For |
|----------|-------|--------|----------|
| **DeepSeek** | $0.14 | $0.28 | **Best Value** |
| **Qwen** | $0.60 | $1.20 | Coding Specialist |
| **Mistral** | $1.00 | $3.00 | Speed |
| **Gemini** | $1.25 | $5.00 | Multimodal |
| **Anthropic** | $3.00 | $15.00 | Large Context |
| **OpenAI** | $10.00 | $30.00 | Premium Performance |

### **Local Models (FREE)**
- **DeepSeek-Coder V2** - MIT License, commercial use allowed
- **StarCoder2** - OpenRAIL License, commercial friendly
- **CodeLlama** - Llama 2 License, <700M users free

## 🛠️ Advanced Usage

### **Custom Model Configuration**
```typescript
// Smart model routing based on task
const config = {
  "vajra.modelRouting": {
    "code": "qwen3-coder-32b-instruct",
    "reasoning": "o1-preview", 
    "chat": "claude-4-sonnet",
    "vision": "gpt-5"
  }
};
```

### **Multimodal Capabilities**
```typescript
// Upload screenshot for UI-to-code conversion
// Drag & drop images into chat
// Voice commands: "Explain this function"
```

### **Batch Processing**
```typescript
// Process multiple files
// Bulk refactoring across codebase
// Generate tests for entire project
```

## 🔌 Extensions & Integrations

### **Popular Integrations**
- **GitHub Copilot** - Use alongside for different strengths
- **ESLint/Prettier** - Auto-fix with AI suggestions
- **Jest/Vitest** - AI-generated test cases
- **Docker** - AI-powered Dockerfile optimization

### **Language Support**
**Full Support**: TypeScript, JavaScript, Python, Java, C++, C#, Go, Rust, PHP, Ruby, Swift, Kotlin, Scala, R, SQL, HTML, CSS, Bash, PowerShell

**Specialized**: React, Vue, Angular, Node.js, Django, Flask, Spring Boot, .NET, AWS CDK, Terraform

## 📈 Roadmap

### **Q1 2025**
- [ ] Voice-to-code functionality
- [ ] Real-time collaboration features
- [ ] Advanced debugging with stack trace analysis
- [ ] Custom model fine-tuning support

### **Q2 2025**
- [ ] IDE integrations (IntelliJ, Sublime, Vim)
- [ ] Advanced code visualization
- [ ] Automated code migration tools
- [ ] Team analytics dashboard

### **Q3 2025**
- [ ] On-premises enterprise deployment
- [ ] Advanced compliance features
- [ ] Custom model training pipeline
- [ ] Multi-repo code understanding

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Setup**
```bash
# Clone repository
git clone https://github.com/vajra-ai/vscode-extension.git
cd vscode-extension

# Install dependencies
npm install

# Start development
npm run watch

# Test extension
F5 (opens new VSCode window with extension loaded)
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.vajra-ai.com](https://docs.vajra-ai.com)
- **Discord**: [discord.gg/vajra-ai](https://discord.gg/vajra-ai)
- **Issues**: [GitHub Issues](https://github.com/vajra-ai/vscode-extension/issues)
- **Email**: support@vajra-ai.com

---

**⭐ Star this repository if Vajra helps your coding workflow!**

*Built with ❤️ by the Vajra AI team*