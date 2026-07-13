/**
 * Test compression command
 * Usage: /house-one compression-test
 */

import { CompressionEngine } from '../../dist/compression/engine.js';

export async function testCompression(context: any): Promise<string> {
  const engine = new CompressionEngine({
    enabled: true,
    level: 'high',
    reversibleCaching: true
  });

  const testData = context?.selectedText || `
{
  "user": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "profile": {
      "avatar": null,
      "bio": "",
      "preferences": {
        "theme": "dark",
        "notifications": true,
        "language": "en"
      }
    }
  }
}
  `.trim();

  try {
    const result = await engine.compress(testData);

    const originalSize = testData.length;
    const compressedSize = result.compressed.length;
    const savings = ((1 - compressedSize / originalSize) * 100).toFixed(2);

    return `
🧪 Compression Test Results

📝 Test Data:
  • Original size: ${originalSize} bytes
  • Compressed size: ${compressedSize} bytes
  • Space saved: ${savings}%

🎯 Compression Details:
  • Strategy: ${result.strategy}
  • Tokens saved: ${result.tokenSaved}
  • Cache key: ${result.cacheKey}
  • Reversible: ${result.reversible ? 'Yes ✓' : 'No'}

📊 Before:
${testData.substring(0, 200)}...

🗜️ After:
${result.compressed.substring(0, 200)}...

✅ Compression test complete!
    `;
  } catch (error) {
    return `❌ Compression test failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

export const command = {
  name: 'compression-test',
  title: 'Test Compression',
  execute: testCompression
};
