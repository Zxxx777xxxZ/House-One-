import type { CompressionConfig, CompressionResult, CompressionStrategy } from '../types';

export class CompressionEngine {
  private config: CompressionConfig;
  private cache: Map<string, CompressionResult>;

  constructor(config: CompressionConfig) {
    this.config = config;
    this.cache = new Map();
  }

  async compress(data: any): Promise<CompressionResult> {
    if (!this.config.enabled) {
      return this.createUncompressedResult(data);
    }

    const dataStr = typeof data === 'string' ? data : JSON.stringify(data);
    const strategy = this.selectStrategy(dataStr);

    const original = dataStr;
    let compressed = original;
    let tokenSaved = 0;

    switch (strategy) {
      case 'json':
        compressed = this.compressJson(dataStr);
        break;
      case 'code':
        compressed = this.compressCode(dataStr);
        break;
      case 'prose':
        compressed = this.compressProse(dataStr);
        break;
      case 'hybrid':
        compressed = this.compressHybrid(dataStr);
        break;
    }

    // Estimate token savings (rough approximation: ~4 chars per token)
    tokenSaved = Math.ceil((original.length - compressed.length) / 4);

    const cacheKey = this.generateCacheKey(original, strategy);

    const result: CompressionResult = {
      original: this.config.reversibleCaching ? original : '',
      compressed,
      tokenSaved,
      strategy,
      reversible: this.config.reversibleCaching ?? true,
      cacheKey
    };

    if (this.config.reversibleCaching) {
      this.cache.set(cacheKey, result);
    }

    return result;
  }

  async decompress(cacheKey: string): Promise<any> {
    const cached = this.cache.get(cacheKey);
    if (cached && cached.original) {
      return cached.original;
    }
    throw new Error(`Cache key not found: ${cacheKey}`);
  }

  private selectStrategy(data: string): CompressionStrategy {
    const strategies = this.config.strategies || ['json', 'code', 'prose', 'hybrid'];

    // Simple heuristic to choose strategy
    if (this.isJson(data)) return strategies.includes('json') ? 'json' : strategies[0];
    if (this.isCode(data)) return strategies.includes('code') ? 'code' : strategies[0];
    if (this.isProse(data)) return strategies.includes('prose') ? 'prose' : strategies[0];

    return strategies.includes('hybrid') ? 'hybrid' : strategies[0];
  }

  private compressJson(data: string): string {
    try {
      const parsed = JSON.parse(data);
      return JSON.stringify(this.compressJsonValue(parsed));
    } catch {
      return this.compressProse(data);
    }
  }

  private compressJsonValue(value: any): any {
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return value.map(v => this.compressJsonValue(v));
      }
      const compressed: any = {};
      for (const [key, val] of Object.entries(value)) {
        if (val !== null && val !== undefined && val !== '') {
          compressed[key] = this.compressJsonValue(val);
        }
      }
      return compressed;
    }
    return value;
  }

  private compressCode(data: string): string {
    // Remove comments and extra whitespace in code
    return data
      .split('\n')
      .map(line => line.trim())
      .filter(line => !line.startsWith('//') && !line.startsWith('/*') && line.length > 0)
      .join('\n')
      .replace(/\s+/g, ' ');
  }

  private compressProse(data: string): string {
    // Remove excessive whitespace and redundant phrases
    return data
      .replace(/\s+/g, ' ')
      .replace(/\b(the|a|an)\b/gi, '')
      .trim();
  }

  private compressHybrid(data: string): string {
    // Use the best available strategy based on content
    if (this.isJson(data)) return this.compressJson(data);
    if (this.isCode(data)) return this.compressCode(data);
    return this.compressProse(data);
  }

  private isJson(data: string): boolean {
    return /^\s*[{\[]/.test(data.trim());
  }

  private isCode(data: string): boolean {
    return /^[\s]*(function|class|const|let|var|import|export|async|await)/.test(data.trim());
  }

  private isProse(data: string): boolean {
    return true; // Fallback
  }

  private generateCacheKey(data: string, strategy: CompressionStrategy): string {
    const hash = data.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `${strategy}-${hash}-${Date.now()}`;
  }

  private createUncompressedResult(data: any): CompressionResult {
    const str = typeof data === 'string' ? data : JSON.stringify(data);
    return {
      original: str,
      compressed: str,
      tokenSaved: 0,
      strategy: 'hybrid',
      reversible: false,
      cacheKey: this.generateCacheKey(str, 'hybrid')
    };
  }
}
