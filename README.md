# CodeFlux AI Kit

[![License](https://img.shields.io/github/license/canstralian/Codeflux-ai-kit?style=flat-square)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/canstralian/Codeflux-ai-kit?style=flat-square)](https://github.com/canstralian/Codeflux-ai-kit/commits)
[![Issues](https://img.shields.io/github/issues/canstralian/Codeflux-ai-kit?style=flat-square)](https://github.com/canstralian/Codeflux-ai-kit/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/canstralian/Codeflux-ai-kit?style=flat-square)](https://github.com/canstralian/Codeflux-ai-kit/pulls)

> **A whole dev team of AI agents in your editor.**

CodeFlux AI Kit is a VSCode extension that brings a full AI-powered development assistant directly into your editor. It supports 15+ AI providers and implements the Model Context Protocol (MCP) for extensibility.

---

## Features

- **Multi-Provider AI Support** — Anthropic (Claude), OpenAI, AWS Bedrock, Google Vertex AI, Mistral, Ollama, Deepseek, Gemini, OpenRouter, LM Studio, Fireworks, and more
- **Multiple Agent Modes** — Code, Architect, Ask, and Debug modes with customizable prompts
- **MCP Integration** — Extensible tool system via the Model Context Protocol
- **Browser Automation** — Built-in Puppeteer-powered browser actions
- **Code Intelligence** — Tree-sitter powered code parsing across 15+ languages
- **Checkpoint System** — Save and restore task state at any point
- **15 Languages** — Full internationalization support

---

## Quick Start

### Prerequisites

- [VS Code](https://code.visualstudio.com/) ^1.84.0
- [Node.js](https://nodejs.org/) 20.18.1 (see `.nvmrc`)

### Install & Build

```bash
# Clone the repo
git clone https://github.com/canstralian/Codeflux-ai-kit.git
cd Codeflux-ai-kit

# Install all dependencies (root + webview-ui workspace)
npm run install:all

# Build the extension
npm run compile

# Or build a distributable .vsix
npm run vsix
```

### Development

```bash
# Start webview in watch mode (hot reload for React UI)
npm run dev

# Watch extension + webview simultaneously
npm run watch
```

---

## Architecture

```
VSCode API  <->  Extension Host (Node.js)  <->  Webview (React)
                      |
              AI Provider APIs (HTTP)
                      |
              MCP Servers (subprocess)
```

| Directory       | Purpose                                   |
| --------------- | ----------------------------------------- |
| `src/`          | Extension backend (TypeScript, Node.js)   |
| `src/core/`     | Agent logic, tool dispatch, prompt system |
| `src/api/`      | AI provider abstraction layer             |
| `src/services/` | MCP, browser, checkpoints, tree-sitter    |
| `webview-ui/`   | React sidebar UI (Vite + Tailwind CSS)    |
| `e2e/`          | End-to-end VSCode integration tests       |

---

## Testing

```bash
npm run test                  # All unit tests
npm run test:extension        # Extension tests only
npm run test:webview          # Webview tests only
npm run check-types           # TypeScript type check
npm run lint                  # ESLint
```

---

## Contributing

Contributions are welcome. Please ensure:

- All code changes include test coverage
- All tests pass (`npm run test`)
- Type checking passes (`npm run check-types`)
- Linting passes (`npm run lint`)
- Follow the existing code conventions (tabs, no semicolons, 120-char lines)

---

## License

Apache License 2.0 — see [LICENSE](LICENSE) for details.
