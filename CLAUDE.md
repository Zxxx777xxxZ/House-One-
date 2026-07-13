# House One — Claude Code Integration

## Overview

House One is a performance optimization layer for Claude Code that combines:
- **Headroom** — context compression (60-95% token reduction)
- **Ruflo** — agent orchestration for intelligent task routing

## How It Works

When Claude Code makes API calls through House One:

1. **Analysis** — Ruflo's analyzer examines the request
2. **Compression** — Headroom compresses context intelligently (JSON/code/prose)
3. **Routing** — Ruflo routes to the optimal execution path
4. **Execution** — Task executed with optimization metadata
5. **Monitoring** — Performance metrics tracked automatically

## Usage in Claude Code

### Basic Setup

```typescript
import { OptimizedClaudeWrapper } from 'house-one';

const optimizer = new OptimizedClaudeWrapper({
  compression: { enabled: true, level: 'high' },
  orchestration: { enabled: true, swarmMode: false },
  monitoring: { enabled: true }
});

// Use like normal Claude calls
const result = await optimizer.call(prompt, context);
```

### Environment Variables

```bash
HOUSE_ONE_COMPRESSION=high     # Compression level: low|medium|high
HOUSE_ONE_SWARM_MODE=false     # Enable agent swarm coordination
HOUSE_ONE_MONITORING=true      # Enable performance tracking
```

## Integration Points

### With Claude Code CLI

The `house-one` module can be loaded as a plugin or hook in Claude Code:

```bash
# Install as a dependency
npm install house-one

# Use in hooks
claude hook add "house-one optimize"
```

### With Ruflo

House One extends Ruflo's capabilities:

```typescript
import { OptimizedClaudeWrapper } from 'house-one';
import { RufloAdapter } from 'house-one/orchestration';

const wrapper = new OptimizedClaudeWrapper();
const ruflo = new RufloAdapter(swarmMode: true);

// Ruflo agents are automatically registered
ruflo.registerAgent({ /* custom agent */ });
```

### With Headroom

Headroom compression is automatically selected based on content:

```typescript
import { HeadroomAdapter } from 'house-one/compression';

const headroom = new HeadroomAdapter();

// Automatic routing to SmartCrusher (JSON), CodeCompressor, or Kompress-v2
const compressed = await headroom.compressContext(largeContext);
```

## Performance Benchmarks

Expected improvements with House One enabled:

| Content Type | Token Reduction | Speedup |
|---|---|---|
| JSON/Config | 60-95% | 1.8-2.5x faster |
| Code/Scripts | 40-70% | 1.5-2.0x faster |
| Documentation | 30-50% | 1.3-1.8x faster |
| Mixed Content | 45-75% | 1.6-2.2x faster |

## Monitoring & Metrics

Get real-time performance data:

```typescript
const metrics = optimizer.getMetrics();
console.log(`
  Tokens saved: ${metrics.totalTokensSaved}
  Compression ratio: ${metrics.averageCompressionRatio}%
  Calls processed: ${metrics.callsProcessed}
  Average latency: ${metrics.averageLatency}ms
`);
```

## Troubleshooting

### Compression not reducing tokens

Check the selected strategy:

```typescript
const result = await optimizer.call(prompt, context);
console.log(result.metadata.compression.strategy);
```

Adjust compression level in config if needed.

### Slow execution with orchestration

Consider enabling swarm mode for parallel task execution:

```typescript
const optimizer = new OptimizedClaudeWrapper({
  orchestration: { enabled: true, swarmMode: true }
});
```

### Cache issues

Clear the compression cache:

```typescript
// Implemented in CompressionEngine
engine.clearCache();
```

## Architecture Diagram

```
Claude Code
    ↓
┌─ House One Optimizer ─┐
│  ┌─────────────────┐  │
│  │ Ruflo Adapter   │  │ → Agent orchestration
│  │ - Analyzer      │  │ → Task routing
│  │ - Router        │  │ → Execution planning
│  └─────────────────┘  │
│  ┌─────────────────┐  │
│  │Headroom Adapter │  │ → Context compression
│  │ - SmartCrusher  │  │ → AST compression
│  │ - Kompress-v2   │  │ → CCR (reversible)
│  └─────────────────┘  │
│  ┌─────────────────┐  │
│  │ Performance     │  │ → Metrics collection
│  │ Monitor         │  │ → Tracking & stats
│  └─────────────────┘  │
└─────────────────────────┘
    ↓
Claude API (optimized)
    ↓
Response (with savings data)
```

## Contributing

To extend House One with custom agents or compression strategies:

1. Implement the `RufloAgent` interface
2. Register with `RufloAdapter.registerAgent()`
3. Submit pull request with benchmarks

## License

MIT
