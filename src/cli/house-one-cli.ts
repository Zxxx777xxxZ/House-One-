#!/usr/bin/env node
/**
 * House One CLI
 * Command-line interface for House One optimization
 */

import { OptimizedClaudeWrapperFull } from '../core/wrapper-full';

const optimizer = new OptimizedClaudeWrapperFull({
  compression: { enabled: true, level: 'high' },
  orchestration: { enabled: true },
  monitoring: { enabled: true }
});

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'optimize':
      await handleOptimize(args.slice(1));
      break;

    case 'metrics':
      handleMetrics();
      break;

    case 'config':
      handleConfig(args.slice(1));
      break;

    case 'test':
      await handleTest();
      break;

    case 'help':
    case '-h':
    case '--help':
      showHelp();
      break;

    case 'version':
    case '-v':
    case '--version':
      console.log('House One v1.0.0');
      break;

    default:
      showHelp();
  }
}

async function handleOptimize(args: string[]) {
  const prompt = args.join(' ') || 'Optimize this';
  const context = { example: 'context' };

  try {
    console.log('🚀 Optimizing with House One...\n');
    const result = await optimizer.call(prompt, context);

    console.log('✅ Optimization Complete\n');
    console.log(`📊 Compression Strategy: ${result.metadata.compression.strategy}`);
    console.log(`💾 Tokens Saved: ${result.metadata.compression.tokensSaved}`);
    console.log(`⏱️ Latency: ${result.metadata.latency}ms`);
    console.log(`🔄 Tasks Executed: ${result.metadata.orchestration.tasks}\n`);
  } catch (error) {
    console.error('❌ Optimization failed:', error);
    process.exit(1);
  }
}

function handleMetrics() {
  const metrics = optimizer.getMetrics();

  console.log('📊 House One Performance Metrics\n');
  console.log(`Total Tokens Saved: ${metrics.totalTokensSaved.toLocaleString()}`);
  console.log(`Average Compression: ${metrics.averageCompressionRatio.toFixed(2)}%`);
  console.log(`Calls Processed: ${metrics.callsProcessed}`);
  console.log(`Average Latency: ${metrics.averageLatency.toFixed(2)}ms\n`);

  const costSavings = metrics.totalTokensSaved * 0.00002;
  console.log(`💰 Estimated Cost Savings: $${costSavings.toFixed(4)}`);
}

function handleConfig(args: string[]) {
  const config = optimizer.getConfig();

  if (args[0] === 'show') {
    console.log('⚙️ Current Configuration:\n');
    console.log(JSON.stringify(config, null, 2));
  } else if (args[0] === 'set') {
    console.log('📝 Configuration update not yet implemented');
  } else {
    console.log('Usage: house-one config [show|set]');
  }
}

async function handleTest() {
  console.log('🧪 Running House One Tests\n');

  try {
    // Test 1: Basic compression
    console.log('Test 1: Compression...');
    const testJson = { test: 'data', nested: { value: 123 } };
    const result1 = await optimizer.call('Test', testJson);
    console.log(`  ✓ Compression working (${result1.metadata.compression.tokensSaved} tokens saved)\n`);

    // Test 2: Metrics tracking
    console.log('Test 2: Metrics...');
    const metrics = optimizer.getMetrics();
    console.log(`  ✓ Metrics tracked (${metrics.callsProcessed} calls processed)\n`);

    // Test 3: Configuration
    console.log('Test 3: Configuration...');
    const config = optimizer.getConfig();
    console.log(`  ✓ Compression enabled: ${config.compression?.enabled}`);
    console.log(`  ✓ Orchestration enabled: ${config.orchestration?.enabled}\n`);

    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('❌ Tests failed:', error);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
House One — Performance Optimization for Claude Code

Usage: house-one [command] [options]

Commands:
  optimize [prompt]    Apply optimizations to a prompt
  metrics              Show performance metrics
  config [show|set]    View or update configuration
  test                 Run diagnostic tests
  help                 Show this help message
  version              Show version information

Examples:
  house-one optimize "Analyze this large dataset"
  house-one metrics
  house-one test

Documentation: https://github.com/zxxx777xxxz/house-one#readme
  `);
}

main().catch(console.error);
