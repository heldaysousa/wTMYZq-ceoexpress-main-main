import { Flex, Menu } from 'antd'
import { useDesignSystem } from '~/designSystem/provider'
import { Theme } from '~/designSystem/theme/theme'
import { NavigationItem } from '../../types'
import { useTranslation } from 'react-i18next'

const styles = {
  nav: { backgroundColor: '#f8f9fa', padding: '10px' },
  ul: { listStyleType: 'none', padding: 0, margin: 0 },
  a: {
    textDecoration: 'none',
    color: '#333', 
    fontSize: '16px',
    cursor: 'pointer'
  }
}

interface Props {
  keySelected?: string
  items: NavigationItem[]
  itemsBottom?: NavigationItem[]
}

export const Leftbar: React.FC<Props> = ({
  keySelected,
  items,
  itemsBottom,
}) => {
  const { isMobile } = useDesignSystem()
  const { t } = useTranslation()

  if (isMobile || items.length === 0) {
    return <></>
  }

  return (
    <nav style={styles.nav}>
      <style>{`
        .nav-link:hover {
          color: #007bff;
        }
      `}</style>
      <ul style={styles.ul}>
        {items.map((item, index) => (
          <li 
            key={item.key}
            style={{
              padding: '10px 0',
              borderBottom: index === items.length - 1 ? 'none' : '1px solid #e9ecef'
            }}
          >
            <a
              className="nav-link"
              onClick={item.onClick}
              style={styles.a}
            >
              {t(item.label.toString())}
            </a>
          </li>
        ))}
      </ul>
      {itemsBottom && itemsBottom.length > 0 && (
        <ul style={styles.ul}>
          {itemsBottom.map((item, index) => (
            <li
              key={item.key}
              style={{
                padding: '10px 0',
                borderBottom: index === itemsBottom.length - 1 ? 'none' : '1px solid #e9ecef'
              }}
            >
              <a
                onClick={item.onClick}
                className="nav-link"
                style={styles.a}
              >
                {t(item.label.toString())}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
