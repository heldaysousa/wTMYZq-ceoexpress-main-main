import { Flex, Typography } from 'antd'
import React, { MouseEventHandler, ReactNode } from 'react'
import { ImageOptimizedClient } from '~/plugins/image-optimize/client'

type Props = {
  title?: ReactNode
  subtitle?: ReactNode
  price?: ReactNode
  priceInfo?: ReactNode
  coverUrl?: string

  onClick?: MouseEventHandler<HTMLElement>
}

export const CardAirbnb: React.FC<Props> = ({
  title,
  subtitle,
  price,
  priceInfo,
  coverUrl,
  onClick,
}) => {
  return (
    <>
      <Flex
        vertical
        style={{
          maxWidth: '300px',
          width: '100%',
          cursor: onClick ? 'pointer' : undefined,
        }}
        gap={8}
        onClick={onClick}
      >
        <ImageOptimizedClient.Img src={coverUrl} width="300px" isPretty />

        <Flex vertical>
          {title && <Typography.Text strong>{title}</Typography.Text>}
          {subtitle && (
            <Typography.Text type="secondary">{subtitle}</Typography.Text>
          )}
          {(price || priceInfo) && (
            <Flex gap={4}>
              {price && <Typography.Text strong>{price}</Typography.Text>}
              {priceInfo && <Typography.Text>{priceInfo}</Typography.Text>}
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  )
}
