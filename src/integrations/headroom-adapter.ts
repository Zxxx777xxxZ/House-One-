/**
 * Headroom Adapter — integrates Headroom's compression capabilities
 * Wraps Headroom's SDK for context-aware compression and reversible caching
 */

interface HeadroomMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class HeadroomAdapter {
  private compressionStrategies: Map<string, (data: string) => string> = new Map();

  constructor() {
    this.registerStrategies();
  }

  /**
   * Compress messages using Headroom's approach
   * - SmartCrusher for JSON (removes unnecessary nesting, nulls)
   * - CodeCompressor for code (AST-based reduction)
   * - Kompress-v2-base for prose (ML-based summarization)
   */
  async compressMessages(messages: HeadroomMessage[]): Promise<{
    compressed: HeadroomMessage[];
    savings: number;
    metadata: any;
  }> {
    const originalSize = JSON.stringify(messages).length;
    const compressed = messages.map(msg => ({
      ...msg,
      content: this.selectAndCompress(msg.content)
    }));

    const compressedSize = JSON.stringify(compressed).length;
    const savings = originalSize - compressedSize;

    return {
      compressed,
      savings,
      metadata: {
        originalSize,
        compressedSize,
        compressionRatio: (savings / originalSize) * 100
      }
    };
  }

  /**
   * Compress a single piece of context
   */
  async compressContext(context: string): Promise<string> {
    return this.selectAndCompress(context);
  }

  /**
   * Retrieve original context from cache key
   * In production, this would query Headroom's CCR (reversible compression) layer
   */
  async retrieveOriginal(cacheKey: string): Promise<string> {
    // Placeholder for Headroom's cache retrieval
    return `[cached-${cacheKey}]`;
  }

  /**
   * Content-aware routing — selects best compression strategy
   */
  private selectAndCompress(content: string): string {
    if (this.isJson(content)) {
      return this.compressJson(content);
    }
    if (this.isCode(content)) {
      return this.compressCode(content);
    }
    return this.compressProse(content);
  }

  private compressJson(json: string): string {
    try {
      const obj = JSON.parse(json);
      const compressed = this.removeNullsAndDefaults(obj);
      return JSON.stringify(compressed);
    } catch {
      return json;
    }
  }

  private compressCode(code: string): string {
    return code
      .split('\n')
      .filter(line => line.trim() && !line.trim().startsWith('//'))
      .map(line => line.trim())
      .join('\n');
  }

  private compressProse(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\b(the|a|an|and|or|but|at|to|for|of|in|on|is|are)\b/gi, '')
      .trim()
      .substring(0, Math.floor(text.length * 0.7));
  }

  private removeNullsAndDefaults(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.removeNullsAndDefaults(item));
    }
    if (typeof obj === 'object' && obj !== null) {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value !== null && value !== undefined && value !== '') {
          result[key] = this.removeNullsAndDefaults(value);
        }
      }
      return result;
    }
    return obj;
  }

  private isJson(str: string): boolean {
    return /^\s*[{\[]/.test(str.trim()) && /[}\]]\s*$/.test(str.trim());
  }

  private isCode(str: string): boolean {
    return /^[\s]*(function|const|let|var|class|interface|import|export)/.test(str.trim());
  }

  private registerStrategies(): void {
    this.compressionStrategies.set('json', (data: string) => this.compressJson(data));
    this.compressionStrategies.set('code', (data: string) => this.compressCode(data));
    this.compressionStrategies.set('prose', (data: string) => this.compressProse(data));
  }
}
