import { CompressionEngine } from '../compression/engine';
import { OrchestrationEngine } from '../orchestration/engine';
import { PerformanceMonitor } from '../monitoring/monitor';
import type { OptimizationConfig } from '../types';

export class OptimizedClaudeWrapper {
  private compression: CompressionEngine;
  private orchestration: OrchestrationEngine;
  private monitor: PerformanceMonitor;
  private config: OptimizationConfig;

  constructor(config: OptimizationConfig = {}) {
    this.config = {
      compression: { enabled: true, level: 'high', reversibleCaching: true, ...config.compression },
      orchestration: { enabled: true, swarmMode: false, ...config.orchestration },
      monitoring: { enabled: true, trackTokens: true, trackLatency: true, ...config.monitoring }
    };

    this.compression = new CompressionEngine(this.config.compression!);
    this.orchestration = new OrchestrationEngine(this.config.orchestration!);
    this.monitor = new PerformanceMonitor(this.config.monitoring!);
  }

  async call(prompt: string, context?: Record<string, any>): Promise<any> {
    const startTime = Date.now();

    try {
      // Step 1: Orchestrate the request routing
      const orchestrationPlan = await this.orchestration.plan({
        prompt,
        context,
        requiresCompression: this.config.compression?.enabled ?? true
      });

      // Step 2: Compress context if enabled
      let compressedContext: any = context;
      let compressionMetadata: any = {};

      if (this.config.compression?.enabled && context) {
        const compression = await this.compression.compress(context);
        compressedContext = compression.compressed;
        compressionMetadata = {
          tokensSaved: compression.tokenSaved,
          strategy: compression.strategy,
          cacheKey: compression.cacheKey,
          reversible: compression.reversible
        };
      }

      // Step 3: Execute orchestrated workflow
      const result = await this.orchestration.execute({
        prompt,
        context: compressedContext,
        plan: orchestrationPlan
      });

      // Step 4: Track performance
      const latency = Date.now() - startTime;
      this.monitor.recordCall({
        latency,
        tokensSaved: compressionMetadata.tokensSaved || 0,
        success: true
      });

      return {
        result,
        metadata: {
          compression: compressionMetadata,
          orchestration: orchestrationPlan,
          latency,
          optimizations: {
            compressionEnabled: this.config.compression?.enabled,
            orchestrationEnabled: this.config.orchestration?.enabled
          }
        }
      };
    } catch (error) {
      const latency = Date.now() - startTime;
      this.monitor.recordCall({ latency, success: false });
      throw error;
    }
  }

  getMetrics() {
    return this.monitor.getMetrics();
  }

  getConfig() {
    return this.config;
  }
}
