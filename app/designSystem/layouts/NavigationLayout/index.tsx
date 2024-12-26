import { Link, useLocation, useNavigate, useParams } from '@remix-run/react'
import { Flex } from 'antd'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Leftbar } from './components/Leftbar'
import { Mobilebar } from './components/Mobilebar'
import { Topbar } from './components/Topbar'
import { NavigationItem } from './types'

interface Props {
  children: ReactNode
}

export const NavigationLayout: React.FC<Props> = ({ children }) => {
  const router = useNavigate()
  const pathname = useLocation().pathname
  const params: Record<string, string> = useParams()

  const goTo = (url: string) => {
    router(url)
  }

  const { t } = useTranslation()
  
  const items: NavigationItem[] = [
    {
      key: '/home',
      label: t('Home'),
      position: 'leftbar',
      onClick: () => goTo('/home'),
    },
    {
      key: '/calendar', 
      label: t('Calendar'),
      position: 'leftbar',
      onClick: () => goTo('/calendar'),
    },
    {
      key: '/clients',
      label: t('Clientes'), 
      position: 'leftbar',
      onClick: () => goTo('/clients'),
    },
    {
      key: '/services',
      label: t('Services'),
      position: 'leftbar', 
      onClick: () => goTo('/services'),
    },
    {
      key: '/finances',
      label: t('Finances'),
      position: 'leftbar',
      onClick: () => goTo('/finances'),
    },
    {
      key: '/subscription',
      label: t('Subscriptions'),
      position: 'leftbar',
      onClick: () => goTo('/subscription'),
    },
    {
      key: '/social',
      label: t('SocialMedia'),
      position: 'leftbar',
      onClick: () => goTo('/social'),
    },
    {
      key: '/products-services',
      label: t('Products'),
      position: 'leftbar',
      onClick: () => goTo('/products-services'),
    },
    {
      key: '/help',
      label: t('HelpCenter'),
      position: 'leftbar',
      onClick: () => goTo('/help'),
    }
  ]

  const itemsVisible = items
    .filter(item => item.isVisible !== false)
    .map(item => ({
      key: item.key,
      label: item.label,
      icon: item.icon,
      position: item.position,
      onClick: item.onClick,
    }))

  const itemsTopbar = itemsVisible.filter(item => item.position === 'topbar')

  const itemsLeftbar = itemsVisible.filter(item => item.position === 'leftbar')

  const itemsLeftbottom = itemsVisible.filter(
    item => item.position === 'leftbar-bottom',
  )

  const itemsMobile = itemsVisible

  let keySelected = pathname

  Object.entries(params).forEach(([key, value]) => {
    keySelected = keySelected.replace(`/${value}`, `/:${key}`)
  })

  return (
    <>
      <Topbar keySelected={keySelected} items={itemsTopbar} />

      <Mobilebar keySelected={keySelected} items={itemsMobile} />

      <Flex flex={1} style={{ overflowY: 'hidden' }}>
        <Leftbar
          keySelected={keySelected}
          items={itemsLeftbar}
          itemsBottom={itemsLeftbottom}
        />

        <Flex flex={1} vertical style={{ overflowY: 'hidden' }}>
          {children}
        </Flex>
      </Flex>
    </>
  )
}
