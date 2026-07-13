#!/usr/bin/env ts-node
/**
 * Post-call monitoring hook
 * Runs after each Claude API call to track performance
 */

import { OptimizedClaudeWrapper } from '../dist/index.js';

const optimizer = new OptimizedClaudeWrapper();

async function monitorCall(output: any): Promise<any> {
  try {
    const metrics = optimizer.getMetrics();

    // Log if we hit optimization milestones
    if (metrics.totalTokensSaved > 0) {
      console.log(`[House One] Tokens saved: ${metrics.totalTokensSaved}`);
      console.log(`[House One] Compression ratio: ${metrics.averageCompressionRatio.toFixed(2)}%`);
      console.log(`[House One] Avg latency: ${metrics.averageLatency.toFixed(0)}ms`);
    }

    // Return enriched output with metrics
    return {
      ...output,
      houseOneMetrics: metrics
    };
  } catch (error) {
    console.warn('[House One] Metrics collection failed:', error);
    return output;
  }
}

// Execute if called as script
if (process.argv[1] === import.meta.url) {
  const output = JSON.parse(process.argv[2] || '{}');
  monitorCall(output).then(result => console.log(JSON.stringify(result)));
}

export { monitorCall };
