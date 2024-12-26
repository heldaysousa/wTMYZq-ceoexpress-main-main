import { ConfigProvider, message, notification, Result, Spin } from 'antd'
import ptBR from 'antd/es/locale/pt_BR'
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { I18nextProvider } from 'react-i18next'
import { Utility } from '~/core/helpers/utility'
import i18n from '../i18n/config'

import { MessageInstance } from 'antd/es/message/interface'
import { ErrorBoundary, MrbHtml } from './core'
import { Theme } from './theme/theme'

export type DesignSystemContext = {
  isMobile: boolean
  message: MessageInstance
  currentLanguage: string
  changeLanguage: (lang: string) => Promise<void>
  forceReloadSystem: () => Promise<void>
  isReloading: boolean
  themeError: Error | null
  retryThemeLoad: () => Promise<void>
  errorCount: number
  lastError: Error | null
  systemState: Record<string, any>
}

const DesignSystemContext = createContext<DesignSystemContext>({
  isMobile: false,
  message: null,
  currentLanguage: 'pt',
  changeLanguage: async () => {},
  forceReloadSystem: async () => {},
  isReloading: false,
  themeError: null,
  retryThemeLoad: async () => {},
})

export const useDesignSystem = (): DesignSystemContext => {
  return useContext(DesignSystemContext)
}

const ProviderGeneral = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage()
  const [isLoading, setLoading] = useState(true)
  const [isMobile, setMobile] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState('pt')
  const [themeError, setThemeError] = useState<Error | null>(null)
  const [forceReload, setForceReload] = useState(false)
  const [isReloading, setIsReloading] = useState(false)
  const [errorCount, setErrorCount] = useState(0)
  const [lastError, setLastError] = useState<Error | null>(null)
  const [systemState, setSystemState] = useState<Record<string, any>>({})
  const reloadTimeoutRef = useRef<NodeJS.Timeout>()
  const maxRetries = 3
  const baseDelay = 1000

  const isWindow = typeof window !== 'undefined'

  const theme = useMemo(() => {
    try {
      return Theme
    } catch (error) {
      setThemeError(error as Error)
      notification.error({
        message: 'Theme Loading Error',
        description: error.message,
        duration: 0,
      })
      return {}
    }
  }, [])

  const retryThemeLoad = async () => {
    try {
      setThemeError(null)
      const newTheme = Theme
      setForceReload(true)
      await new Promise(resolve => setTimeout(resolve, 100))
      setForceReload(false)
      notification.success({
        message: 'Theme Loaded Successfully',
        description: 'The application theme has been restored.',
      })
    } catch (error) {
      setThemeError(error as Error)
      notification.error({
        message: 'Theme Loading Error',
        description: error.message,
        duration: 0,
      })
    }
  }

  const forceReloadSystem = async (retryCount = 0) => {
    try {
      // Save current system state
      setSystemState({
        theme,
        language: currentLanguage,
        mobile: isMobile
      })
      
      setIsReloading(true)
      setForceReload(true)

      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current)
      }

      // Cleanup stale contexts
      Object.keys(window).forEach(key => {
        if (key.startsWith('__REACT_CONTEXT__')) {
          delete window[key]
        }
      })

      // Force garbage collection if available
      if (window.gc) {
        window.gc()
      }

      await new Promise(resolve => setTimeout(resolve, 500))
      setForceReload(false)
      setIsReloading(false)

      notification.success({
        message: t('system.reload.success'),
      })
    } catch (error) {
      console.error('System reload failed:', error)
      setLastError(error)
      setErrorCount(prev => prev + 1)

      if (retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount)
        notification.warning({
          message: t('system.reload.retrying'),
          description: t('system.reload.retryDescription', {
            attempt: retryCount + 1,
            maxRetries
          })
        })
        
        reloadTimeoutRef.current = setTimeout(
          () => forceReloadSystem(retryCount + 1),
          delay
        )
      } else {
        notification.error({
          message: t('system.reload.failed'),
          description: error.message
        })
        
        // Restore previous state
        if (systemState.theme) {
          Theme.apply(systemState.theme)
        }
        if (systemState.language) {
          await changeLanguage(systemState.language)
        }
        setMobile(systemState.mobile)
      }
      
      setForceReload(false)
      setIsReloading(false)
    }
  }

  const changeLanguage = async (lang: string) => {
    try {
      await i18n.changeLanguage(lang)
      setCurrentLanguage(lang)
    } catch (error) {
      console.error('Language change failed:', error)
      notification.error({
        message: 'Language Change Failed',
        description: 'Falling back to default language (pt)',
      })
      setCurrentLanguage('pt')
    }
  }

  useEffect(() => {
    if (!isWindow) return

    if (reloadTimeoutRef.current) {
      clearTimeout(reloadTimeoutRef.current)
    }

    const handleResize = Utility.debounce(() => {
      setMobile(window.innerWidth < 992)
    }, 150)

    const cleanup = () => {
      window.removeEventListener('resize', handleResize)
    }

    setMobile(window.innerWidth < 992)
    window.addEventListener('resize', handleResize)
    setLoading(false)

    return cleanup
  }, [isWindow])

  useEffect(() => {
    if (!isWindow) return

    const setVhVariable = Utility.debounce(() => {
      document.documentElement.style.setProperty(
        '--100vh',
        `${window.innerHeight}px`,
      )
    }, 150)

    const cleanup = () => {
      window.removeEventListener('resize', setVhVariable)
    }

    setVhVariable()
    window.addEventListener('resize', setVhVariable)

    return cleanup
  }, [isWindow])

  if (isLoading || isReloading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" tip="Loading..." />
      </div>
    )
  }

  if (themeError) {
    return (
      <Result
        status="error"
        title="Theme Loading Error"
        subTitle={themeError.message}
      />
    )
  }

  return (
    <ErrorBoundary
      fallback={
        <Result
          status="error"
          title="Provider Error"
          subTitle="There was an error in the design system provider"
        />
      }
    >
      <ErrorBoundary
        fallback={
          <Result
            status="error"
            title="i18n Provider Error"
            subTitle="Failed to initialize internationalization"
            extra={
              <Button onClick={() => window.location.reload()}>
                Reload Application
              </Button>
            }
          />
        }
      >
        <I18nextProvider i18n={i18n} key={forceReload}>
          <ErrorBoundary
            fallback={
              <Result
                status="error"
                title="Theme Provider Error"
                subTitle="Failed to initialize application theme"
                extra={
                  <Button onClick={retryThemeLoad}>
                    Retry Loading Theme
                  </Button>
                }
              />
            }
          >
            <ConfigProvider theme={theme} locale={ptBR} key={forceReload}>
              <DesignSystemContext.Provider
                value={{
                  isMobile,
                  message: messageApi,
                  currentLanguage,
                  changeLanguage,
                  forceReloadSystem,
                  isReloading,
                  themeError,
                  retryThemeLoad,
                  errorCount,
                  lastError,
                  systemState
                }}
              >
                {contextHolder}
                {children}
              </DesignSystemContext.Provider>
            </ConfigProvider>
          </ErrorBoundary>
        </I18nextProvider>
      </ErrorBoundary>
    </ErrorBoundary>
  )
}

type Props = {
  children: ReactNode
}

export const DesignSystemProvider: React.FC<Props> = ({ children }) => {
  return (
    <ErrorBoundary>
      <ProviderGeneral>
        <MrbHtml>{children}</MrbHtml>
      </ProviderGeneral>
    </ErrorBoundary>
  )
}
