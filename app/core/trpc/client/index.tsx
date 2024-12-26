import { createTRPCReact } from '@trpc/react-query'
import { AppRouter } from '@/server'
import { PwaService } from '@/core/pwa/pwa.service'
import mixpanel from 'mixpanel-browser'
import { ConfigurationServer } from '@/core/configuration/server'
import {
  ErrorCategory,
  errorLogger,
  ErrorSeverity,
} from '@/core/error/errorLogger'
import { PwaServer } from '@/plugins/pwa/server'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink, TRPCClientError } from '@trpc/client'
import React, { ReactNode, useState } from 'react'
import superjson from 'superjson'
import { MixpanelServer } from '~/plugins/mixpanel/server'

type ExtendedAppRouter = AppRouter & {
  pwa: typeof PwaServer.trpcRouter
  analytics: typeof MixpanelServer.trpcRouter
  configuration: typeof ConfigurationServer.trpcRouter
}

export const Api = createTRPCReact<AppRouter>()
Api.mixpanel = mixpanel;
Api.push = PwaService;

const transformer = superjson

const Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 3,
            retryDelay: attemptIndex =>
              Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            retry: 1,
          },
        },
      }),
  )

  const [trpcClient] = useState(() =>
    Api.createClient({
      transformer,
      links: [
        httpBatchLink({
          url: '/api/trpc',
          async headers() {
            return {}
          },
          fetch: async (url, options) => {
            try {
              const response = await fetch(url, options)
              return response
            } catch (error) {
              await errorLogger.logError({
                severity: ErrorSeverity.ERROR,
                category: ErrorCategory.API,
                message:
                  error instanceof Error
                    ? error.message
                    : 'Network request failed',
                error:
                  error instanceof Error
                    ? error
                    : new Error('Network request failed'),
                metadata: { url, options },
              })
              throw error
            }
          },
        }),
      ],
      abortOnUnmount: true,
      callbacks: {
        onError: async error => {
          const trpcError = error instanceof TRPCClientError ? error : null
          await errorLogger.logError({
            severity:
              trpcError?.data?.httpStatus >= 500
                ? ErrorSeverity.ERROR
                : ErrorSeverity.WARNING,
            category: ErrorCategory.API,
            message: trpcError?.message || 'An unexpected error occurred',
            error: error instanceof Error ? error : new Error('Unknown error'),
            metadata: {
              code: trpcError?.code,
              data: trpcError?.data,
              path: trpcError?.path,
            },
          })
        },
      },
    }),
  )

  return (
    <Api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Api.Provider>
  )
}

export const TrpcClient = {
  Provider,
}
