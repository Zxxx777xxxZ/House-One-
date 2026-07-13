/**
 * Toggle House One command
 * Usage: /house-one toggle-house-one
 */

interface ToggleState {
  enabled: boolean;
  timestamp: Date;
}

let state: ToggleState = {
  enabled: true,
  timestamp: new Date()
};

export async function toggle(): Promise<string> {
  state.enabled = !state.enabled;
  state.timestamp = new Date();

  return `
⚙️ House One Status Changed

${state.enabled ? '✅ ENABLED' : '❌ DISABLED'}

When enabled:
  • All Claude calls are automatically optimized
  • Compression reduces tokens by 60-95%
  • Orchestration plans optimal execution paths
  • Metrics are collected and reported

Current status: ${state.enabled ? 'ACTIVE' : 'INACTIVE'}
Last changed: ${state.timestamp.toLocaleTimeString()}

💡 Tip: Use /house-one metrics to see performance improvements
  `;
}

export function isEnabled(): boolean {
  return state.enabled;
}

export const command = {
  name: 'toggle-house-one',
  title: 'Toggle House One',
  execute: toggle
};
