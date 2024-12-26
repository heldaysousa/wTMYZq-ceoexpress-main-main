import { Prisma, PrismaClient } from '@prisma/client'
import { ErrorCategory, ErrorSeverity, errorLogger } from '../error/errorLogger'

const MAX_RETRIES = 3
const QUERY_TIMEOUT = 30000
const CONNECTION_LIMIT = 10
const MIN_POOL = 2

interface PrismaWithRetry extends PrismaClient {
  $retry: <T>(fn: () => Promise<T>, retries?: number) => Promise<T>
}

const singleton = globalThis as unknown as {
  prisma: PrismaWithRetry | undefined
}

if (!singleton.prisma) {
  singleton.prisma = new PrismaClient({
    errorFormat: 'pretty',
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
        pooling: true,
        pool: {
          max: CONNECTION_LIMIT,
          min: MIN_POOL,
          idleTimeoutMillis: 30000
        }
      }
    },
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'event',
        level: 'error',
      },
      {
        emit: 'event',
        level: 'warn',
      },
    ],
  }) as PrismaWithRetry

  // Add retry functionality
  singleton.prisma.$retry = async function<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
    try {
      return await Promise.race([
        fn(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Query timeout')), QUERY_TIMEOUT)
        )
      ]) as T
    } catch (error) {
      if (retries > 0) {
        const delay = Math.min(1000 * Math.pow(2, MAX_RETRIES - retries), 10000)
        await new Promise(resolve => setTimeout(resolve, delay))
        return this.$retry(fn, retries - 1)
      }
      throw error
    }
  }

  // Handle connection events
  singleton.prisma.$on('query', async (e: Prisma.QueryEvent) => {
    await errorLogger.logError({
      severity: ErrorSeverity.INFO,
      category: ErrorCategory.DATABASE,
      message: `Query executed: ${e.query}`,
      metadata: {
        duration: e.duration,
        timestamp: new Date().toISOString()
      }
    })
  })

  singleton.prisma.$on('error', async (e: Prisma.LogEvent) => {
    await errorLogger.logError({
      severity: ErrorSeverity.ERROR,
      category: ErrorCategory.DATABASE,
      message: `Database error: ${e.message}`,
      error: new Error(e.message),
      metadata: {
        target: e.target,
        timestamp: new Date().toISOString()
      }
    })

    // Attempt reconnection
    try {
      await singleton.prisma.$disconnect()
      await singleton.prisma.$connect()
    } catch (reconnectError) {
      await errorLogger.logError({
        severity: ErrorSeverity.CRITICAL,
        category: ErrorCategory.DATABASE,
        message: 'Failed to reconnect to database',
        error: reconnectError instanceof Error ? reconnectError : new Error('Unknown error'),
      })
    }
  })

  singleton.prisma.$on('warn', async (e: Prisma.LogEvent) => {
    await errorLogger.logError({
      severity: ErrorSeverity.WARNING,
      category: ErrorCategory.DATABASE,
      message: `Database warning: ${e.message}`,
      metadata: {
        timestamp: new Date().toISOString()
      }
    })
  })

  // Middleware for transaction handling
  singleton.prisma.$use(async (params, next) => {
    if (params.action === 'create' || params.action === 'update' || params.action === 'delete') {
      try {
        return await singleton.prisma.$retry(() => next(params))
      } catch (error) {
        await errorLogger.logError({
          severity: ErrorSeverity.ERROR,
          category: ErrorCategory.DATABASE,
          message: `Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          error: error instanceof Error ? error : new Error('Unknown error'),
          metadata: {
            action: params.action,
            model: params.model
          }
        })
        throw error
      }
    }
    return next(params)
  })
}

export const Database = singleton.prisma
