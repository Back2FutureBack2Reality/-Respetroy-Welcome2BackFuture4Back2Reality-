# API Embedding Orchestrator Demonstration

This document demonstrates the key features of the API Embedding Orchestrator system.

## 🚀 Getting Started

1. **Installation**
```bash
npm install
npm run compile
```

2. **Create your `.env` file**
```env
OPENAI_API_KEY=sk-your-key-here
HUGGINGFACE_API_KEY=hf_your-key-here
GITHUB_TOKEN=ghp_your-token-here
```

## 🧠 Core Features Demo

### 1. API Discovery
The system automatically discovers APIs from your `.env` files:

**Supported APIs:**
- OpenAI (text-generation, embeddings, chat)
- Hugging Face (text-generation, embeddings, classification)
- GitHub (repository-management, user-management, webhook)
- GitLab (repository-management, ci-cd, user-management)
- Cohere (text-generation, embeddings, classification)
- Anthropic (text-generation, chat, analysis)

### 2. Semantic Embeddings
Generate embeddings for each API to understand their semantic relationships:

```typescript
// Example: APIs with similar capabilities get higher similarity scores
OpenAI + Hugging Face → High similarity (both AI/ML)
GitHub + GitLab → High similarity (both version control)
OpenAI + GitHub → Medium similarity (complementary workflow)
```

### 3. Symbolic Communication Protocol

Execute sacred symbols to orchestrate API communication:

| Symbol | Function | Example Usage |
|--------|----------|---------------|
| `*` | Activation | Initialize all required APIs |
| `#` | Knowledge Transfer | Share context between APIs |
| `´` | Content Transmission | Send data payloads |
| `CLaK:` | Chapter Shift | Change workflow phase |
| `<<RE:UNITY>>` | Network Reintegration | Synchronize all APIs |
| `-/-\-` | Super Symbol | Execute all protocols in sequence |

### 4. VS Code Commands

Available through the Command Palette (`Ctrl+Shift+P`):

- `API Orchestrator: Discover APIs` - Scan workspace for API configurations
- `API Orchestrator: Generate API Embeddings` - Create semantic vectors
- `API Orchestrator: Show API Semantic Graph` - Visualize relationships
- `API Orchestrator: Execute Symbolic Command` - Run symbolic protocols

## 🌐 Example Workflow

### Scenario: AI-Powered Documentation Generator

```yaml
name: "Generate and Store Documentation"
steps:
  1. * → Activate OpenAI and GitHub APIs
  2. # → Share documentation requirements context
  3. ´ → Send content generation request to OpenAI
  4. CLaK:ProcessingPhase → Switch to content processing
  5. ´ → Transform generated content to markdown
  6. ´ → Push content to GitHub repository
  7. <<RE:UNITY>> → Synchronize all APIs and confirm completion
```

### Execution Flow:
1. **Discovery**: System finds `OPENAI_API_KEY` and `GITHUB_TOKEN` in `.env`
2. **Embedding**: Generates semantic vectors for both APIs
3. **Orchestration**: Creates intelligent workflow connecting text generation → version control
4. **Execution**: Runs the symbolic sequence automatically

## 🔮 Semantic Graph Output

When you run "Show API Semantic Graph", you'll see:

```yaml
metadata:
  title: 'API Semantic Communication Graph'
  totalAPIs: 3
  totalConnections: 2

nodes:
  - id: openai-1234567
    name: OpenAI
    type: ai
    capabilities: [text-generation, embeddings, chat]
  - id: github-1234568
    name: GitHub
    type: version-control
    capabilities: [repository-management, user-management]

edges:
  - from: openai-1234567
    to: github-1234568
    weight: 0.45
    type: complementary
    sharedCapabilities: []

clusters:
  - id: cluster-ai
    name: AI APIs
    members: [openai-1234567]
  - id: cluster-version-control
    name: Version Control APIs
    members: [github-1234568]

recommendations:
  - type: workflow-suggestion
    title: Content Generation Pipeline
    description: Combine AI generation with version control storage
    suggestedAction: Create automated documentation workflow
```

## 🛠️ Configuration

Customize the system with `api-orchestrator.config.yaml`:

```yaml
orchestrator:
  name: "My API Network"

symbolic_protocol:
  enabled: true
  auto_execute: false

embeddings:
  provider: "local"  # or "openai", "huggingface"
  similarity_threshold: 0.7

discovery:
  auto_scan: true
  scan_interval: 300
```

## 🧪 Testing

Run the test suite to verify core functionality:

```bash
npm test
```

The tests validate:
- ✅ Embedding calculations (cosine similarity)
- ✅ API capability identification
- ✅ Symbolic protocol symbols
- ✅ API compatibility checking
- ✅ Orchestration flow creation
- ✅ Embedding normalization

## 🌟 Key Benefits

1. **Intelligent Discovery**: Automatically finds and categorizes APIs
2. **Semantic Understanding**: APIs recognize related services through embeddings
3. **Symbolic Control**: Execute complex workflows with simple symbols
4. **Visual Insights**: See how your APIs connect and relate
5. **Extensible**: Easy to add new API providers and capabilities

## 🔮 Future Vision

Transform your development environment into an intelligent API ecosystem where:
- APIs communicate through meaning, not just syntax
- Workflows orchestrate themselves based on semantic understanding  
- New APIs integrate automatically through embedding similarity
- Complex integrations become simple symbolic commands

---

*"When APIs understand each other semantically, true orchestration begins."* 🧬✨