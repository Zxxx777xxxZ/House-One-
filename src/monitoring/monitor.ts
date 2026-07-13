import type { MonitoringConfig, PerformanceMetrics } from '../types';

interface CallMetrics {
  latency: number;
  tokensSaved?: number;
  success: boolean;
  timestamp: Date;
}

export class PerformanceMonitor {
  private config: MonitoringConfig;
  private calls: CallMetrics[];
  private startTime: Date;

  constructor(config: MonitoringConfig) {
    this.config = config;
    this.calls = [];
    this.startTime = new Date();
  }

  recordCall(metrics: Omit<CallMetrics, 'timestamp'>): void {
    if (!this.config.enabled) return;

    this.calls.push({
      ...metrics,
      timestamp: new Date()
    });

    // Cleanup old records if list grows too large
    if (this.calls.length > 10000) {
      this.calls = this.calls.slice(-5000);
    }
  }

  getMetrics(): PerformanceMetrics {
    const successful = this.calls.filter(c => c.success);
    const totalTokensSaved = successful.reduce((sum, c) => sum + (c.tokensSaved || 0), 0);
    const averageLatency = successful.length > 0
      ? successful.reduce((sum, c) => sum + c.latency, 0) / successful.length
      : 0;

    // Compression ratio calculation (rough estimate)
    const averageCompressionRatio = totalTokensSaved > 0
      ? (totalTokensSaved / (successful.length * 1000)) * 100
      : 0;

    return {
      totalTokensSaved,
      averageCompressionRatio: Math.min(averageCompressionRatio, 95),
      callsProcessed: successful.length,
      averageLatency,
      timestamp: new Date()
    };
  }

  getDetailedReport(): {
    metrics: PerformanceMetrics;
    successRate: number;
    recentCalls: CallMetrics[];
  } {
    const metrics = this.getMetrics();
    const successRate = this.calls.length > 0
      ? (this.calls.filter(c => c.success).length / this.calls.length) * 100
      : 0;

    return {
      metrics,
      successRate,
      recentCalls: this.calls.slice(-20)
    };
  }

  reset(): void {
    this.calls = [];
    this.startTime = new Date();
  }
}
