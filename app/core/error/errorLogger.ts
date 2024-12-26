import { notification } from 'antd';
import { Database } from '../database';

export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export enum ErrorCategory {
  API = 'api',
  DATABASE = 'database',
  UI = 'ui',
  AUTH = 'auth'
}

interface ErrorLog {
  id: string;
  timestamp: Date;
  severity: ErrorSeverity;
  category: ErrorCategory;
  message: string;
  stack?: string;
  metadata?: Record<string, any>;
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private errorCache: Map<string, {count: number, lastLogged: Date}> = new Map();
  private rateLimits: Map<ErrorCategory, {count: number, resetTime: Date}> = new Map();
  private cleanupInterval: NodeJS.Timeout;
  
  private constructor() {
    // Run cleanup every day
    this.cleanupInterval = setInterval(() => this.cleanupOldLogs(), 24 * 60 * 60 * 1000);
  }

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  private generateErrorHash(error: Error): string {
    return error?.stack?.split('\n').slice(0, 3).join('') || error?.message || 'unknown';
  }

  private isRateLimited(category: ErrorCategory): boolean {
    const now = new Date();
    const limit = this.rateLimits.get(category);
    
    if (!limit || now > limit.resetTime) {
      this.rateLimits.set(category, {
        count: 1,
        resetTime: new Date(now.getTime() + 60000) // 1 minute
      });
      return false;
    }

    if (limit.count >= 5) return true;
    
    limit.count++;
    return false;
  }

  private async cleanupOldLogs(): Promise<void> {
    const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    
    try {
      await Database?.errorLog.deleteMany({
        where: {
          timestamp: {
            lt: cutoffDate
          }
        }
      });
    } catch (err) {
      console.error('Failed to cleanup old logs:', err);
    }
  }

  private shouldIgnoreError(error: Error): boolean {
    const ignoredPatterns = [
      'ResizeObserver loop limit exceeded',
      'Loading chunk',
      'Failed to load resource',
      'Network request failed'
    ];
    
    return ignoredPatterns.some(pattern => 
      error?.message?.includes(pattern) || 
      error?.stack?.includes(pattern)
    );
  }

  async logError(params: {
    severity: ErrorSeverity;
    category: ErrorCategory;
    message: string;
    error?: Error;
    metadata?: Record<string, any>;
  }): Promise<void> {
    const { severity, category, message, error, metadata } = params;

    if (error && this.shouldIgnoreError(error)) {
      return;
    }

    if (this.isRateLimited(category)) {
      return;
    }

    const errorHash = error ? this.generateErrorHash(error) : message;
    const now = new Date();
    const cached = this.errorCache.get(errorHash);

    if (cached && (now.getTime() - cached.lastLogged.getTime() < 300000)) { // 5 minutes
      cached.count++;
      return;
    }

    const errorLog: ErrorLog = {
      id: crypto.randomUUID(),
      timestamp: now,
      severity,
      category,
      message: cached ? `${message} (occurred ${cached.count} times)` : message,
      stack: error?.stack,
      metadata: {
        ...metadata,
        occurrences: cached?.count || 1,
        errorHash
      }
    };

    try {
      // Store error in database
      await Database?.errorLog.create({
        data: errorLog
      });

      // Show notification for errors and critical issues
      if (severity === ErrorSeverity.ERROR || severity === ErrorSeverity.CRITICAL) {
        const description = cached 
          ? `${message}\n(occurred ${cached.count} times in the last 5 minutes)`
          : message;

        notification.error({
          message: `${category.toUpperCase()} Error`,
          description,
          duration: severity === ErrorSeverity.CRITICAL ? 0 : 4.5
        });
      }

      this.errorCache.set(errorHash, {
        count: 1,
        lastLogged: now
      });
    } catch (err) {
      console.error('Failed to log error:', err);
      notification.error({
        message: 'Error Logging Failed',
        description: 'Could not save error log to database'
      });
    }
  }

  async getErrorLogs(params?: {
    severity?: ErrorSeverity;
    category?: ErrorCategory;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<ErrorLog[]> {
    try {
      const { severity, category, startDate, endDate, limit = 100 } = params || {};

      const where: any = {};
      
      if (severity) {
        where.severity = severity;
      }
      if (category) {
        where.category = category;
      }
      if (startDate || endDate) {
        where.timestamp = {};
        if (startDate) {
          where.timestamp.gte = startDate;
        }
        if (endDate) {
          where.timestamp.lte = endDate;
        }
      }

      const logs = await Database?.errorLog.findMany({
        where,
        orderBy: {
          timestamp: 'desc'
        },
        take: limit
      });

      return logs || [];
    } catch (err) {
      console.error('Failed to retrieve error logs:', err);
      notification.error({
        message: 'Error Retrieval Failed',
        description: 'Could not fetch error logs from database'
      });
      return [];
    }
  }

  async getErrorAggregation(params?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<Record<ErrorCategory, Record<ErrorSeverity, number>>> {
    try {
      const { startDate, endDate } = params || {};
      
      const where: any = {};
      if (startDate || endDate) {
        where.timestamp = {};
        if (startDate) {
          where.timestamp.gte = startDate;
        }
        if (endDate) {
          where.timestamp.lte = endDate;
        }
      }

      const logs = await Database?.errorLog.findMany({
        where,
        select: {
          category: true,
          severity: true
        }
      });

      const aggregation: Record<ErrorCategory, Record<ErrorSeverity, number>> = {
        [ErrorCategory.API]: {
          [ErrorSeverity.INFO]: 0,
          [ErrorSeverity.WARNING]: 0,
          [ErrorSeverity.ERROR]: 0,
          [ErrorSeverity.CRITICAL]: 0
        },
        [ErrorCategory.DATABASE]: {
          [ErrorSeverity.INFO]: 0,
          [ErrorSeverity.WARNING]: 0,
          [ErrorSeverity.ERROR]: 0,
          [ErrorSeverity.CRITICAL]: 0
        },
        [ErrorCategory.UI]: {
          [ErrorSeverity.INFO]: 0,
          [ErrorSeverity.WARNING]: 0,
          [ErrorSeverity.ERROR]: 0,
          [ErrorSeverity.CRITICAL]: 0
        },
        [ErrorCategory.AUTH]: {
          [ErrorSeverity.INFO]: 0,
          [ErrorSeverity.WARNING]: 0,
          [ErrorSeverity.ERROR]: 0,
          [ErrorSeverity.CRITICAL]: 0
        }
      };

      logs?.forEach(log => {
        aggregation[log.category][log.severity]++;
      });

      return aggregation;
    } catch (err) {
      console.error('Failed to aggregate error logs:', err);
      notification.error({
        message: 'Error Aggregation Failed',
        description: 'Could not aggregate error logs from database'
      });
      return {} as Record<ErrorCategory, Record<ErrorSeverity, number>>;
    }
  }
}

export const errorLogger = ErrorLogger.getInstance();
