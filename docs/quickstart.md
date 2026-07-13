# House One Quick Start

## Installation

```bash
npm install house-one
```

## 5-Minute Setup

### Step 1: Import and Initialize

```typescript
import { OptimizedClaudeWrapper } from 'house-one';

const optimizer = new OptimizedClaudeWrapper({
  compression: { enabled: true, level: 'high' },
  orchestration: { enabled: true },
  monitoring: { enabled: true }
});
```

### Step 2: Use Instead of Regular API Calls

```typescript
// Before: Direct API call
// const result = await claude.messages.create(...)

// After: Optimized call
const result = await optimizer.call(
  "Your prompt here",
  { key: "value", /* context */ }
);
```

### Step 3: Check Savings

```typescript
console.log(result.metadata);
// {
//   compression: {
//     tokensSaved: 2341,
//     strategy: 'hybrid',
//     reversible: true
//   },
//   orchestration: { /* plan details */ },
//   latency: 145
// }

const metrics = optimizer.getMetrics();
console.log(`Total tokens saved: ${metrics.totalTokensSaved}`);
console.log(`Compression ratio: ${metrics.averageCompressionRatio}%`);
```

## Configuration Options

### Compression

```typescript
compression: {
  enabled: true,              // Enable/disable
  level: 'high',             // 'low' | 'medium' | 'high'
  strategies: ['json', 'code', 'prose'],
  reversibleCaching: true,   // Store originals
  maxCacheSize: 100          // Max cached items
}
```

### Orchestration

```typescript
orchestration: {
  enabled: true,             // Enable/disable
  maxAgents: 4,              // Max concurrent agents
  timeout: 30000,            // Timeout in ms
  swarmMode: false           // Parallel execution
}
```

### Monitoring

```typescript
monitoring: {
  enabled: true,             // Enable/disable
  trackTokens: true,         // Track token usage
  trackLatency: true,        // Track response time
  reportInterval: 60000      // Report every 60s
}
```

## Common Patterns

### High-Performance Mode

For maximum token reduction and speed:

```typescript
const optimizer = new OptimizedClaudeWrapper({
  compression: { enabled: true, level: 'high', reversibleCaching: true },
  orchestration: { enabled: true, swarmMode: true },
  monitoring: { enabled: true }
});
```

### Conservative Mode

For minimal overhead:

```typescript
const optimizer = new OptimizedClaudeWrapper({
  compression: { enabled: true, level: 'low' },
  orchestration: { enabled: false },
  monitoring: { enabled: false }
});
```

### Compression Only

Just reduce tokens without orchestration:

```typescript
const optimizer = new OptimizedClaudeWrapper({
  compression: { enabled: true, level: 'high' },
  orchestration: { enabled: false }
});
```

## Examples

### Example 1: Optimize Large Context

```typescript
const largeContext = {
  files: [...], // Large file list
  logs: [...],  // Many log entries
  history: [...] // Long history
};

const result = await optimizer.call(
  "Analyze this context",
  largeContext
);

console.log(`Saved ${result.metadata.compression.tokensSaved} tokens`);
```

### Example 2: Batch Processing

```typescript
const prompts = [prompt1, prompt2, prompt3];

for (const prompt of prompts) {
  const result = await optimizer.call(prompt);
  console.log(`Latency: ${result.metadata.latency}ms`);
}

const metrics = optimizer.getMetrics();
console.log(`Average compression: ${metrics.averageCompressionRatio}%`);
```

### Example 3: Custom Orchestration

```typescript
const optimizer = new OptimizedClaudeWrapper();
const report = optimizer.getMetrics();

if (report.averageCompressionRatio < 30) {
  // Adjust compression level
  optimizer.getConfig().compression.level = 'high';
}
```

## Troubleshooting

**Q: Why aren't tokens being saved?**  
A: Check the content type. JSON and code compress better than prose. Increase compression level if needed.

**Q: Is there performance overhead?**  
A: Compression has ~50-100ms overhead but typically saves 2-10x in API latency. Disable if not needed.

**Q: How do I revert to the original context?**  
A: Use `optimizer.compression.decompress(cacheKey)` if reversible caching is enabled.

## Next Steps

- Read [Architecture](./architecture.md)
- Check [API Reference](./api.md)
- See [Benchmarks](./benchmarks.md)
