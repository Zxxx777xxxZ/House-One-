export interface OptimizationConfig {
  compression?: CompressionConfig;
  orchestration?: OrchestrationConfig;
  monitoring?: MonitoringConfig;
}

export interface CompressionConfig {
  enabled: boolean;
  level?: 'low' | 'medium' | 'high';
  strategies?: CompressionStrategy[];
  reversibleCaching?: boolean;
  maxCacheSize?: number;
}

export interface OrchestrationConfig {
  enabled: boolean;
  maxAgents?: number;
  timeout?: number;
  swarmMode?: boolean;
}

export interface MonitoringConfig {
  enabled: boolean;
  trackTokens?: boolean;
  trackLatency?: boolean;
  reportInterval?: number;
}

export type CompressionStrategy = 'json' | 'code' | 'prose' | 'hybrid';

export interface CompressionResult {
  original: string;
  compressed: string;
  tokenSaved: number;
  strategy: CompressionStrategy;
  reversible: boolean;
  cacheKey: string;
}

export interface PerformanceMetrics {
  totalTokensSaved: number;
  averageCompressionRatio: number;
  callsProcessed: number;
  averageLatency: number;
  timestamp: Date;
}
