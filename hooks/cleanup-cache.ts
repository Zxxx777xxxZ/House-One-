#!/usr/bin/env ts-node
/**
 * Cache cleanup hook
 * Runs periodically to clean up old cached entries
 */

import { CompressionEngine } from '../dist/compression/engine.js';

async function cleanupCache(): Promise<void> {
  const engine = new CompressionEngine({
    enabled: true,
    reversibleCaching: true,
    maxCacheSize: 100
  });

  try {
    engine.clearCache?.();
    console.log('[House One] Cache cleanup completed');
  } catch (error) {
    console.warn('[House One] Cache cleanup failed:', error);
  }
}

// Execute if called as script
if (process.argv[1] === import.meta.url) {
  cleanupCache().catch(console.error);
}

export { cleanupCache };
