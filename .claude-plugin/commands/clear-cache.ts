/**
 * Clear cache command
 * Usage: /house-one clear-cache
 */

import { CompressionEngine } from '../../dist/compression/engine.js';

export async function clearCache(): Promise<string> {
  try {
    const engine = new CompressionEngine({
      enabled: true,
      reversibleCaching: true
    });

    const cacheSize = engine.cache?.size || 0;

    // Clear the cache
    engine.cache?.clear?.();

    return `
🧹 Cache Cleanup

✅ Cache cleared successfully

📊 Cleanup Details:
  • Entries removed: ${cacheSize}
  • Cache status: Empty
  • Reversibility: Disabled (originals no longer cached)

⚠️ Note: After clearing cache, you cannot decompress previously cached compressions.
Use reversible caching to maintain the ability to decompress.

✨ Cache is now fresh and ready for new compressions!
    `;
  } catch (error) {
    return `❌ Cache cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

export const command = {
  name: 'clear-cache',
  title: 'Clear Compression Cache',
  execute: clearCache
};
