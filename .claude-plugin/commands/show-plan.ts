/**
 * Show orchestration plan command
 * Usage: /house-one orchestration-plan
 */

import { OrchestrationEngine } from '../../dist/orchestration/engine.js';

export async function showPlan(context: any): Promise<string> {
  const engine = new OrchestrationEngine({
    enabled: true,
    swarmMode: false,
    maxAgents: 4
  });

  const prompt = context?.selectedText || context?.prompt || 'Optimize this code';

  try {
    const plan = await engine.plan({
      prompt,
      context: context?.context || {},
      requiresCompression: true
    });

    let output = `
📋 Orchestration Plan

🎯 Task Configuration:
  • Total Agents: ${plan.agents.length}
  • Execution Priority: ${plan.priority}
  • Parallelizable: ${plan.parallelizable ? 'Yes' : 'No'}
  • Estimated Time: ${plan.estimatedTime}ms

📍 Agent Tasks:
`;

    plan.agents.forEach((agent, idx) => {
      output += `
  ${idx + 1}. ${agent.type.toUpperCase()}
     • Task ID: ${agent.id}
     • Priority: ${agent.priority}
     • Dependencies: ${agent.dependencies.length > 0 ? agent.dependencies.join(', ') : 'None'}
`;
    });

    output += `
🔄 Execution Flow:
  Step 1: Analyzer inspects request
  Step 2: Compressor optimizes context
  Step 3: Router selects optimal path
  Step 4: Executor runs optimized task

✅ Plan ready for execution
    `;

    return output;
  } catch (error) {
    return `❌ Failed to generate plan: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

export const command = {
  name: 'orchestration-plan',
  title: 'Show Orchestration Plan',
  execute: showPlan
};
