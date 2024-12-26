import { Button, Divider, Flex, Result, Skeleton, Typography, notification } from 'antd'
import React, { Component, ReactNode } from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import * as Sentry from '@sentry/react'

interface SentryErrorInfo extends React.ErrorInfo {
  [key: string]: any
}

interface Props extends WithTranslation {
  children: ReactNode
  fallback?: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: SentryErrorInfo | null
  isResetting: boolean
  retryCount: number
  retryTimeout: NodeJS.Timeout | null
}

class ErrorBoundaryComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isResetting: false,
      retryCount: 3,
      retryTimeout: null
    }
  }

  componentWillUnmount() {
    if (this.state.retryTimeout) {
      clearTimeout(this.state.retryTimeout)
    }
    notification.destroy()
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: SentryErrorInfo): void {
    this.setState({ errorInfo })
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by ErrorBoundary:', error, errorInfo)
    }
    
    // Report to Sentry with additional context
    Sentry.withScope(scope => {
      scope.setLevel('error')
      scope.setExtras(errorInfo as SentryErrorInfo)
      scope.setTags({
        component: this.constructor.name,
        errorType: error.name
      })
      scope.setContext('error', {
        stack: error.stack,
        componentStack: errorInfo.componentStack
      })
      Sentry.captureException(error)
    })

    // Show localized notification
    notification.error({
      message: this.props.t('error.boundary.title'),
      description: this.props.t('error.boundary.description', {
        error: error.message
      }),
      duration: 5
    })
  }

  handleReset = async () => {
    this.setState({ isResetting: true })
    
    while (this.state.retryCount > 0) {
      try {
        if (this.props.onReset) {
          await this.props.onReset()
        }
        this.setState({
          hasError: false,
          error: null,
          errorInfo: null,
          isResetting: false,
          retryCount: 3
        })
        notification.success({
          message: this.props.t('error.boundary.resetSuccess'),
          description: this.props.t('error.boundary.componentRestored')
        })
        return
      } catch (error) {
        const newRetryCount = this.state.retryCount - 1
        this.setState({ retryCount: newRetryCount })

        if (newRetryCount === 0) {
          console.error('Max retry attempts reached:', error)
          this.setState({ isResetting: false })
          
          Sentry.withScope(scope => {
            scope.setLevel('error')
            scope.setTag('action', 'reset')
            scope.setExtra('remainingRetries', 0)
            Sentry.captureException(error)
          })

          notification.error({
            message: this.props.t('error.boundary.resetFailed'),
            description: this.props.t('error.boundary.maxRetries')
          })
        } else {
          console.warn(`Retry attempt ${3 - newRetryCount} failed:`, error)
          const timeout = setTimeout(() => this.handleReset(), 1000)
          this.setState({ retryTimeout: timeout })
        }
      }
    }
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    const { hasError, error, errorInfo, isResetting } = this.state
    const { children, fallback, t } = this.props

    if (isResetting) {
      return <Skeleton active />
    }

    if (hasError) {
      if (fallback) {
        return fallback
      }

      return (
        <Result
          status="error"
          title={t('error.boundary.title')}
          subTitle={t('error.boundary.subtitle')}
          extra={
            <Flex vertical gap="middle">
              <Flex gap="small">
                <Button type="primary" onClick={this.handleReset} loading={isResetting}>
                  {t('error.boundary.retry')}
                </Button>
                <Button onClick={this.handleReload}>
                  {t('error.boundary.reload')}
                </Button>
                <Button onClick={this.handleGoHome}>
                  {t('error.boundary.home')}
                </Button>
                <Button onClick={() => window.history.back()}>
                  {t('error.boundary.back')}
                </Button>
              </Flex>

              {process.env.NODE_ENV === 'development' && (
                <Flex vertical className="mt-5" style={{ textAlign: 'left' }}>
                  <Typography.Title level={5}>{t('error.boundary.errorDetails')}</Typography.Title>
                  <pre style={{ whiteSpace: 'pre-wrap' }}>
                    {error?.message}
                  </pre>
                  <Divider />
                  <Typography.Title level={5}>{t('error.boundary.stackTrace')}</Typography.Title>
                  <pre style={{ whiteSpace: 'pre-wrap' }}>
                    {error?.stack}
                  </pre>
                  {errorInfo && (
                    <>
                      <Divider />
                      <Typography.Title level={5}>{t('error.boundary.componentStack')}</Typography.Title>
                      <pre style={{ whiteSpace: 'pre-wrap' }}>
                        {errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </Flex>
              )}
            </Flex>
          }
        />
      )
    }

    return children
  }
}

export const ErrorBoundary = withTranslation()(ErrorBoundaryComponent)
