# House One — Performance Optimization for Claude Code

A unified optimization layer combining **Ruflo** (agent orchestration) and **Headroom** (context compression) to dramatically improve Claude Code performance.

## Features

- **60-95% token reduction** for prompts and context using Headroom's intelligent compression
- **Agent orchestration** with Ruflo for coordinated, efficient workflows
- **Context-aware compression** — automatically selects best compression strategy (JSON, code AST, or prose)
- **Reversible compression** — original context cached for retrieval when needed
- **Seamless integration** — works with existing Claude Code workflows
- **Performance monitoring** — track token savings and response times

## Quick Start

### Installation

```bash
npm install house-one
```

### Basic Usage

```typescript
import { OptimizedClaudeWrapper } from 'house-one';

const optimizer = new OptimizedClaudeWrapper({
  compression: { enabled: true },
  orchestration: { enabled: true }
});

// Your Claude Code calls automatically compressed
const result = await optimizer.call(prompt, context);
```

## Architecture

```
Claude Code Input
    ↓
┌─────────────────────────────┐
│   House One Optimizer       │
├─────────────────────────────┤
│ 1. Headroom Compression     │ ← 60-95% token reduction
│ 2. Ruflo Orchestration      │ ← Agent coordination
│ 3. Performance Monitoring   │ ← Metrics & tracking
└─────────────────────────────┘
    ↓
Claude API (with optimized context)
    ↓
Response (cached + reversible)
```

## Modules

- **`compression`** — Headroom integration for context compression
- **`orchestration`** — Ruflo integration for agent workflows
- **`core`** — Main optimization engine
- **`monitoring`** — Performance metrics and tracking

## Documentation

- [Compression Guide](./docs/compression.md)
- [Orchestration Guide](./docs/orchestration.md)
- [API Reference](./docs/api.md)
- [Performance Benchmarks](./docs/benchmarks.md)

## Environment Variables

```bash
HEADROOM_ENABLED=true          # Enable compression
HEADROOM_COMPRESSION_LEVEL=high # low|medium|high
RUFLO_AGENTS=auto              # auto|manual|disabled
MONITOR_ENABLED=true           # Enable performance monitoring
```

## License

MIT
