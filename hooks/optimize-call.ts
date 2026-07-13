#!/usr/bin/env ts-node
/**
 * Pre-call optimization hook
 * Runs before each Claude API call to apply House One optimizations
 */

import { OptimizedClaudeWrapper } from '../dist/index.js';

const optimizer = new OptimizedClaudeWrapper({
  compression: {
    enabled: true,
    level: 'high',
    reversibleCaching: true
  },
  orchestration: {
    enabled: true,
    swarmMode: false
  },
  monitoring: {
    enabled: true
  }
});

// Hook receives prompt and context from Claude Code
async function optimizeCall(input: any): Promise<any> {
  const { prompt, context, model } = input;

  try {
    // Apply House One optimization
    const optimized = await optimizer.call(prompt, context);

    // Return optimized prompt and metadata
    return {
      prompt: optimized.result?.prompt || prompt,
      context: optimized.result?.context || context,
      metadata: optimized.metadata,
      model,
      optimizationApplied: true
    };
  } catch (error) {
    console.error('Optimization failed, proceeding without optimization:', error);
    return { prompt, context, model, optimizationApplied: false };
  }
}

// Execute if called as script
if (process.argv[1] === import.meta.url) {
  const input = JSON.parse(process.argv[2] || '{}');
  optimizeCall(input).then(result => console.log(JSON.stringify(result)));
}

export { optimizeCall };
