/**
 * Optimize command for Claude Code plugin
 * Usage: /house-one optimize
 */

import { OptimizedClaudeWrapper } from '../../dist/index.js';

export async function optimize(context: any): Promise<string> {
  const optimizer = new OptimizedClaudeWrapper({
    compression: { enabled: true, level: 'high' },
    orchestration: { enabled: true }
  });

  try {
    const prompt = context?.selectedText || context?.prompt || '';
    const contextData = context?.context || {};

    const result = await optimizer.call(prompt, contextData);

    return `
✅ Optimization Applied

📊 Compression Results:
  • Strategy: ${result.metadata.compression.strategy}
  • Tokens Saved: ${result.metadata.compression.tokensSaved}
  • Reversible: ${result.metadata.compression.reversible ? 'Yes' : 'No'}

🔄 Orchestration:
  • Agents Used: ${result.metadata.orchestration.agents.length}
  • Execution Time: ${result.metadata.latency}ms

💡 Optimization Status: ✓ Complete
    `;
  } catch (error) {
    return `❌ Optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

export const command = {
  name: 'optimize',
  title: 'Optimize with House One',
  execute: optimize
};
