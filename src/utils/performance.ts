/**
 * Performance Monitoring Utilities
 * 
 * Provides lightweight performance tracking and analytics
 * for production monitoring and optimization
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private enabled: boolean = true;
  private maxMetrics: number = 100;

  constructor(options?: { enabled?: boolean; maxMetrics?: number }) {
    this.enabled = options?.enabled ?? true;
    this.maxMetrics = options?.maxMetrics ?? 100;
  }

  /**
   * Track a performance metric
   */
  track(name: string, value: number, metadata?: Record<string, any>) {
    if (!this.enabled) return;

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: new Date(),
      metadata,
    };

    this.metrics.push(metric);

    // Keep only the latest metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Log in development
    if (import.meta.env.DEV) {
      console.log(`[Performance] ${name}: ${value}ms`, metadata);
    }
  }

  /**
   * Measure execution time of a function
   */
  async measure<T>(
    name: string,
    fn: () => T | Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.track(name, duration, { ...metadata, success: true });
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.track(name, duration, { ...metadata, success: false, error: String(error) });
      throw error;
    }
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get metrics by name
   */
  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter((m) => m.name === name);
  }

  /**
   * Get average value for a metric
   */
  getAverage(name: string): number {
    const metrics = this.getMetricsByName(name);
    if (metrics.length === 0) return 0;
    const sum = metrics.reduce((acc, m) => acc + m.value, 0);
    return sum / metrics.length;
  }

  /**
   * Get latest metric by name
   */
  getLatest(name: string): PerformanceMetric | null {
    const metrics = this.getMetricsByName(name);
    return metrics.length > 0 ? metrics[metrics.length - 1] : null;
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics = [];
  }

  /**
   * Get performance summary
   */
  getSummary(): Record<string, { count: number; average: number; latest: number }> {
    const summary: Record<string, { count: number; average: number; latest: number }> = {};
    
    const uniqueNames = [...new Set(this.metrics.map((m) => m.name))];
    
    uniqueNames.forEach((name) => {
      const metrics = this.getMetricsByName(name);
      const latest = this.getLatest(name);
      
      summary[name] = {
        count: metrics.length,
        average: this.getAverage(name),
        latest: latest?.value ?? 0,
      };
    });

    return summary;
  }

  /**
   * Export metrics for analysis
   */
  export(): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      summary: this.getSummary(),
    }, null, 2);
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor({
  enabled: true,
  maxMetrics: 200,
});

/**
 * Track API call performance
 */
export async function trackApiCall<T>(
  endpoint: string,
  fn: () => Promise<T>
): Promise<T> {
  return performanceMonitor.measure(`api:${endpoint}`, fn, { type: 'api' });
}

/**
 * Track component render time
 */
export function trackRender(componentName: string, renderTime: number) {
  performanceMonitor.track(`render:${componentName}`, renderTime, { type: 'render' });
}

/**
 * Track page load time
 */
export function trackPageLoad(pageName: string) {
  if (typeof window !== 'undefined' && window.performance) {
    const loadTime = window.performance.now();
    performanceMonitor.track(`page:${pageName}`, loadTime, { type: 'page-load' });
  }
}

/**
 * Track user interaction
 */
export function trackInteraction(action: string, duration: number, metadata?: Record<string, any>) {
  performanceMonitor.track(`interaction:${action}`, duration, { type: 'interaction', ...metadata });
}

/**
 * Get Web Vitals (if available)
 */
export function trackWebVitals() {
  if (typeof window === 'undefined') return;

  // Track First Contentful Paint
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
        performanceMonitor.track('web-vitals:fcp', entry.startTime, { type: 'web-vitals' });
      }
    }
  });

  try {
    observer.observe({ entryTypes: ['paint'] });
  } catch (e) {
    // Browser doesn't support Performance Observer
  }

  // Track Largest Contentful Paint
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    performanceMonitor.track('web-vitals:lcp', lastEntry.startTime, { type: 'web-vitals' });
  });

  try {
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    // Browser doesn't support Performance Observer
  }
}

/**
 * Performance monitoring hook for React
 */
export function usePerformanceMonitor(componentName: string) {
  const startTime = performance.now();

  return {
    trackRender: () => {
      const renderTime = performance.now() - startTime;
      trackRender(componentName, renderTime);
    },
    trackAction: (action: string, metadata?: Record<string, any>) => {
      const duration = performance.now() - startTime;
      trackInteraction(`${componentName}:${action}`, duration, metadata);
    },
  };
}

/**
 * Log performance summary (for debugging)
 */
export function logPerformanceSummary() {
  const summary = performanceMonitor.getSummary();
  console.table(summary);
}

/**
 * Send performance metrics to analytics (placeholder)
 */
export function sendMetricsToAnalytics() {
  const summary = performanceMonitor.getSummary();
  
  // In production, send to your analytics service
  // Example: PostHog, Google Analytics, Mixpanel, etc.
  if (import.meta.env.PROD) {
    // analytics.track('performance_metrics', summary);
    console.log('[Analytics] Performance metrics:', summary);
  }
  
  return summary;
}

// Initialize Web Vitals tracking
if (typeof window !== 'undefined') {
  trackWebVitals();
}

export default performanceMonitor;
