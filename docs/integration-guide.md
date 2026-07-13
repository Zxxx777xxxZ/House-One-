# House One — Complete Integration Guide

This guide covers all three integration methods: Library, Hooks, and Plugin.

## Table of Contents

1. [Library Integration](#library-integration)
2. [Hooks Integration](#hooks-integration)
3. [Claude Code Plugin](#claude-code-plugin)
4. [Using All Three Together](#using-all-three-together)

---

## Library Integration

Use House One as a TypeScript/JavaScript library in your code.

### Installation

```bash
npm install house-one
```

### Basic Usage

```typescript
import { OptimizedClaudeWrapperFull } from 'house-one';

const optimizer = new OptimizedClaudeWrapperFull({
  compression: { enabled: true, level: 'high' },
  orchestration: { enabled: true },
  monitoring: { enabled: true }
});

// Use it
const result = await optimizer.call(prompt, context);

// Get metrics
const metrics = optimizer.getMetrics();
```

### Direct Headroom Integration

```typescript
import { RealHeadroomIntegration } from 'house-one/integrations/headroom-real';

const headroom = new RealHeadroomIntegration({
  enabled: true,
  reversibleCaching: true
});

const compressed = await headroom.compress(largeContext);
console.log(`Saved ${compressed.tokensSaved} tokens`);
```

### Direct Ruflo Integration

```typescript
import { RealRufloIntegration } from 'house-one/integrations/ruflo-real';

const ruflo = new RealRufloIntegration({
  enabled: true,
  swarmMode: true  // parallel execution
});

const plan = await ruflo.planRequest({
  prompt: 'Your prompt',
  context: { /* data */ },
  requiresCompression: true
});

const results = await ruflo.executeTaskPlan(plan);
```

---

## Hooks Integration

Automatically optimize Claude Code calls using `.claude/settings.json` hooks.

### Setup

The `.claude/settings.json` file is already configured with three hooks:

```json
{
  "hooks": [
    {
      "name": "house-one-optimize",
      "event": "before-claude-call",
      "command": "npx tsx ./hooks/optimize-call.ts"
    },
    {
      "name": "house-one-monitor",
      "event": "after-claude-call",
      "command": "npx tsx ./hooks/monitor-metrics.ts"
    }
  ]
}
```

### How It Works

1. **Before Call** — `optimize-call.ts`
   - Analyzes prompt and context
   - Applies compression
   - Routes to optimal execution path
   - Returns optimized prompt + metadata

2. **After Call** — `monitor-metrics.ts`
   - Collects performance metrics
   - Logs token savings
   - Tracks latency
   - Updates running statistics

### Enabling/Disabling

Edit `.claude/settings.json`:

```json
{
  "hooks": [
    {
      "enabled": true   // Set to false to disable
    }
  ]
}
```

### Custom Hook Configuration

Create your own hook in `hooks/custom-hook.ts`:

```typescript
export async function customHook(input: any): Promise<any> {
  // Your custom optimization logic
  return { ...input, customOptimization: true };
}
```

Add to `.claude/settings.json`:

```json
{
  "hooks": [
    {
      "name": "my-custom-hook",
      "event": "before-claude-call",
      "command": "npx tsx ./hooks/custom-hook.ts",
      "enabled": true
    }
  ]
}
```

---

## Claude Code Plugin

Install House One as a Claude Code plugin for slash commands and UI integration.

### Installation

```bash
# Option 1: From local directory
/plugin install ./

# Option 2: From marketplace (when published)
/plugin install house-one
```

### Available Commands

#### `/house-one optimize`
Apply compression and orchestration optimizations to selected text or prompt.

```
/house-one optimize
✅ Optimization Applied
  Strategy: hybrid
  Tokens Saved: 2341
  Latency: 145ms
```

#### `/house-one metrics`
Display real-time performance metrics.

```
/house-one metrics
📊 House One Performance Metrics
  Total Tokens Saved: 45,231
  Average Compression: 62.4%
  Calls Processed: 23
  Average Latency: 127ms
```

#### `/house-one compression-test`
Test compression on selected context.

```
/house-one compression-test
🧪 Compression Test Results
  Original: 2,451 bytes
  Compressed: 892 bytes
  Savings: 63.6%
```

#### `/house-one orchestration-plan`
View the orchestration plan for current request.

```
/house-one orchestration-plan
📋 Orchestration Plan
  Agents: 4 (analyzer, compressor, router, executor)
  Priority: high
  Estimated time: 345ms
```

#### `/house-one toggle-house-one`
Enable or disable House One optimization.

```
/house-one toggle-house-one
✅ ENABLED
  All Claude calls will be automatically optimized
```

#### `/house-one clear-cache`
Clear compression cache.

```
/house-one clear-cache
🧹 Cache Cleanup
  Entries removed: 42
  Cache status: Empty
```

### Plugin Settings

Configure plugin behavior in Claude Code settings:

```json
{
  "house-one": {
    "compressionLevel": "high",
    "orchestrationMode": "sequential",
    "reversibleCaching": true,
    "autoOptimize": true,
    "monitoringEnabled": true
  }
}
```

### Plugin Permissions

House One requires these permissions:
- `read-context` — Read prompt and context
- `modify-prompt` — Optimize prompts before sending
- `track-metrics` — Collect performance data
- `cache-storage` — Store compressed cache

---

## Using All Three Together

For maximum performance optimization, use all three integration methods:

### Architecture

```
Claude Code
    ↓
┌─ Plugin (UI Layer) ──────────┐
│  /house-one commands         │
│  Settings & toggles          │
└──────────────┬───────────────┘
              ↓
┌─ Hooks (Automation Layer) ───┐
│  before-claude-call          │
│  after-claude-call           │
│  Cache cleanup               │
└──────────────┬───────────────┘
              ↓
┌─ Library (Core Engine) ──────┐
│  Headroom compression        │
│  Ruflo orchestration         │
│  Performance monitoring      │
└──────────────┬───────────────┘
              ↓
         Claude API
            (optimized)
```

### Example Workflow

1. **User starts Claude Code**
   - Plugin loads and initializes
   - Hooks are registered
   - Configuration is applied

2. **User enters a prompt**
   - Hook `before-claude-call` fires
   - Headroom analyzes and compresses context
   - Ruflo plans optimal execution
   - Optimized prompt sent to Claude API

3. **API responds**
   - Hook `after-claude-call` fires
   - Metrics are collected and logged
   - Plugin updates UI with savings

4. **User runs slash command**
   - Plugin executes command
   - Uses same library and optimizations
   - Shows results in Claude Code UI

### Configuration for Full Integration

`.claude/settings.json`:

```json
{
  "version": 2,
  "hooks": [
    {
      "name": "house-one-optimize",
      "event": "before-claude-call",
      "command": "npx tsx ./hooks/optimize-call.ts",
      "enabled": true
    },
    {
      "name": "house-one-monitor",
      "event": "after-claude-call",
      "command": "npx tsx ./hooks/monitor-metrics.ts",
      "enabled": true
    }
  ],
  "settings": {
    "house-one": {
      "enabled": true,
      "compression": {
        "enabled": true,
        "level": "high",
        "reversibleCaching": true
      },
      "orchestration": {
        "enabled": true,
        "swarmMode": false,
        "maxAgents": 4
      },
      "monitoring": {
        "enabled": true,
        "trackTokens": true,
        "trackLatency": true
      }
    }
  }
}
```

### Performance Expectations

With all three layers active:

| Metric | Value |
|--------|-------|
| Token Reduction | 60-95% (JSON), 40-70% (code), 30-50% (docs) |
| Latency Improvement | 1.5-2.5x faster |
| Cost Reduction | 60-95% per optimized call |
| Memory Usage | ~50-100MB for caching |
| Initialization Time | ~500ms |

---

## Troubleshooting

### Plugin not appearing in Claude Code

1. Reinstall: `/plugin install ./`
2. Check manifest: `.claude-plugin/manifest.json` is present
3. Verify TypeScript compilation: `npm run build`

### Hooks not firing

1. Enable hooks in settings: `hooks[].enabled: true`
2. Check hook file exists: `hooks/optimize-call.ts`
3. Verify command: `npx tsx ./hooks/optimize-call.ts`

### Compression not reducing tokens

1. Check content type (JSON compresses best)
2. Increase compression level: `level: 'high'`
3. Run test: `/house-one compression-test`

### High latency with orchestration

1. Disable swarm mode: `swarmMode: false`
2. Reduce max agents: `maxAgents: 2`
3. Check machine resources

---

## Next Steps

- [API Reference](./api.md)
- [Performance Benchmarks](./benchmarks.md)
- [Contributing](../CONTRIBUTING.md)
