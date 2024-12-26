import { useUserContext } from '@/core/context'
import {
  ErrorCategory,
  errorLogger,
  ErrorSeverity,
} from '@/core/error/errorLogger'
import { Api } from '@/core/trpc/base'
import { NavigationLayout } from '@/designSystem/layouts/NavigationLayout'
import { ReloadOutlined } from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from '@remix-run/react'
import { Button, notification, Spin } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MrbSplashScreen } from '~/designSystem'
import { useDesignSystem } from '~/designSystem/provider'
import { ErrorBoundary } from '@/core/components/ErrorBoundary'

export default function LoggedLayout() {
  const { isLoggedIn, isLoading } = useUserContext()
  const { forceReloadSystem, isReloading } = useDesignSystem()
  const router = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const utils = Api.useUtils()
  const maxRetries = 3
  const baseDelay = 1000 // 1 second
  const timeoutRef = useRef<NodeJS.Timeout>()
  const [errorCount, setErrorCount] = useState(0)
  const errorCountRef = useRef<NodeJS.Timeout>()
  const cleanupRef = useRef<(() => void)[]>([])

  const reloadSystems = async (retryCount = 0) => {
    try {
      await errorLogger.logError({
        severity: ErrorSeverity.INFO,
        category: ErrorCategory.UI,
        message: `System reload attempt ${retryCount + 1}/${maxRetries + 1}`,
        metadata: { retryCount },
      })

      await forceReloadSystem()
      await utils.invalidateQueries()

      await errorLogger.logError({
        severity: ErrorSeverity.INFO,
        category: ErrorCategory.UI,
        message: 'System reload successful',
        metadata: { retryCount },
      })

      notification.success({
        message: t('system.reload.success'),
        description: t('system.reload.successDescription', { retryCount }),
      })
    } catch (error) {
      await errorLogger.logError({
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.UI,
        message: 'System reload failed',
        error,
        metadata: { retryCount },
      })

      if (retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount)
        notification.warning({
          message: t('system.reload.retryWarning'),
          description: t('system.reload.retryDescription', {
            seconds: delay / 1000,
            attempt: retryCount + 1,
            maxRetries
          }),
        })
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => reloadSystems(retryCount + 1), delay)
      } else {
        notification.error({
          message: t('system.reload.error'),
          description: t('system.reload.errorDescription', { 
            maxRetries,
            error: error.message 
          }),
          duration: 0,
        })
      }
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'r') {
        e.preventDefault()
        reloadSystems()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    
    // Reset error count every minute
    errorCountRef.current = setInterval(() => {
      setErrorCount(0)
    }, 60000)

    return () => {
      // Cleanup all event listeners and timeouts
      window.removeEventListener('keydown', handleKeyDown)
      cleanupRef.current.forEach(cleanup => cleanup())
      cleanupRef.current = []
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (errorCountRef.current) clearInterval(errorCountRef.current)
      notification.destroy()
    }
  }, [])

  useEffect(() => {
    const unsubscribe = errorLogger.subscribe(error => {
      setErrorCount(prev => {
        const newCount = prev + 1
        if (newCount > 5) {
          reloadSystems()
        }
        return newCount
      })
    })
    cleanupRef.current.push(unsubscribe)
    return unsubscribe
  }, [])

  useEffect(() => {
    const handleRouteError = async (error: Error) => {
      await errorLogger.logError({
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.UI,
        message: 'Route transition failed',
        error,
        metadata: { path: location.pathname }
      })
      router('/error')
    }

    window.addEventListener('unhandledrejection', handleRouteError)
    cleanupRef.current.push(() => window.removeEventListener('unhandledrejection', handleRouteError))
    
    return () => window.removeEventListener('unhandledrejection', handleRouteError)
  }, [location])

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router('/login')
    }
  }, [isLoading, isLoggedIn])

  if (isLoading) {
    return <MrbSplashScreen />
  }

  if (isLoggedIn) {
    return (
      <ErrorBoundary
        onError={async (error) => {
          await errorLogger.logError({
            severity: ErrorSeverity.ERROR,
            category: ErrorCategory.UI,
            message: 'Layout error boundary caught error',
            error,
            metadata: { path: location.pathname }
          })
        }}
        fallback={
          <div className="flex flex-col items-center justify-center min-h-screen">
            <Button onClick={reloadSystems} loading={isReloading}>
              {t('error.boundary.retry')}
            </Button>
          </div>
        }
      >
        <NavigationLayout>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={reloadSystems}
            loading={isReloading}
            style={{
              position: 'fixed',
              top: '1rem',
              right: '1rem',
              zIndex: 1000,
            }}
          >
            {t('system.reload.button')} {errorCount > 0 && `(${errorCount})`}
          </Button>
          <Outlet />
        </NavigationLayout>
      </ErrorBoundary>
    )
  }
}
