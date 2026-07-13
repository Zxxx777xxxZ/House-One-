/**
 * Full integration wrapper using real Headroom and Ruflo
 * This is the production version that bridges to actual libraries
 */

import { RealHeadroomIntegration } from '../integrations/headroom-real';
import { RealRufloIntegration } from '../integrations/ruflo-real';
import { PerformanceMonitor } from '../monitoring/monitor';
import type { OptimizationConfig } from '../types';

export class OptimizedClaudeWrapperFull {
  private headroom: RealHeadroomIntegration;
  private ruflo: RealRufloIntegration;
  private monitor: PerformanceMonitor;
  private config: OptimizationConfig;

  constructor(config: OptimizationConfig = {}) {
    this.config = {
      compression: { enabled: true, level: 'high', reversibleCaching: true, ...config.compression },
      orchestration: { enabled: true, swarmMode: false, ...config.orchestration },
      monitoring: { enabled: true, trackTokens: true, trackLatency: true, ...config.monitoring }
    };

    this.headroom = new RealHeadroomIntegration({
      enabled: this.config.compression?.enabled ?? true,
      reversibleCaching: this.config.compression?.reversibleCaching ?? true
    });

    this.ruflo = new RealRufloIntegration({
      enabled: this.config.orchestration?.enabled ?? true,
      swarmMode: this.config.orchestration?.swarmMode ?? false,
      maxAgents: this.config.orchestration?.maxAgents
    });

    this.monitor = new PerformanceMonitor(this.config.monitoring!);
  }

  /**
   * Main entry point — optimized Claude Code call
   */
  async call(prompt: string, context?: Record<string, any>): Promise<any> {
    const startTime = Date.now();

    try {
      // Step 1: Plan orchestration with Ruflo
      const orchestrationPlan = await this.ruflo.planRequest({
        prompt,
        context,
        requiresCompression: this.config.compression?.enabled ?? true
      });

      // Step 2: Compress context with Headroom
      let compressedContext: any = context;
      let compressionMetadata: any = {};

      if (this.config.compression?.enabled && context) {
        const compression = await this.headroom.compress(context);
        compressedContext = compression.compressed;
        compressionMetadata = {
          tokensSaved: compression.tokensSaved,
          strategy: compression.strategy,
          cacheKey: compression.cacheKey,
          reversible: true,
          original: compression.original
        };
      }

      // Step 3: Execute orchestrated plan
      const executionResults = await this.ruflo.executeTaskPlan(orchestrationPlan);

      // Step 4: Track performance
      const latency = Date.now() - startTime;
      this.monitor.recordCall({
        latency,
        tokensSaved: compressionMetadata.tokensSaved || 0,
        success: true
      });

      return {
        result: {
          prompt,
          context: compressedContext,
          executionResults: Object.fromEntries(executionResults)
        },
        metadata: {
          compression: compressionMetadata,
          orchestration: {
            tasks: orchestrationPlan.length,
            plan: orchestrationPlan
          },
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

  /**
   * Get performance metrics
   */
  getMetrics() {
    return this.monitor.getMetrics();
  }

  /**
   * Get detailed performance report
   */
  getDetailedReport(): any {
    return this.monitor.getDetailedReport();
  }

  /**
   * Get current configuration
   */
  getConfig() {
    return this.config;
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<OptimizationConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get Headroom integration for direct use
   */
  getHeadroom(): RealHeadroomIntegration {
    return this.headroom;
  }

  /**
   * Get Ruflo integration for direct use
   */
  getRuflo(): RealRufloIntegration {
    return this.ruflo;
  }

  /**
   * Clear all caches
   */
  clearCaches(): void {
    this.headroom.clearCache();
    this.monitor.reset();
  }
}
