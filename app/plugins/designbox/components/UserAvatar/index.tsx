import { Avatar, AvatarProps, Flex, Typography, TypographyProps } from 'antd'
import React, { MouseEventHandler } from 'react'
import { Utility } from '~/core/helpers/utility'

type Props = {
  title?: string
  subtitle?: string
  pictureUrl?: string

  propsAvatar?: AvatarProps
  propsTitle?: TypographyProps['Text']
  propsSubtitle?: TypographyProps['Text']

  onClick?: MouseEventHandler<HTMLElement>
}

export const UserAvatar: React.FC<Props> = ({
  title,
  subtitle,
  pictureUrl,
  propsAvatar,
  propsTitle,
  propsSubtitle,
  onClick,
}) => {
  const initials = Utility.stringToInitials(title ?? subtitle ?? 'unknown')

  return (
    <>
      <Flex
        align="center"
        gap={8}
        style={{ overflow: 'hidden', cursor: onClick ? 'pointer' : undefined }}
        onClick={onClick}
      >
        <Avatar size={44} src={pictureUrl} {...propsAvatar}>
          {initials}
        </Avatar>

        <Flex vertical style={{ overflow: 'hidden' }} flex={1}>
          {title && (
            <Typography.Text strong ellipsis {...propsTitle}>
              {title}
            </Typography.Text>
          )}

          {subtitle && (
            <Typography.Text type="secondary" ellipsis {...propsSubtitle}>
              {subtitle}
            </Typography.Text>
          )}
        </Flex>
      </Flex>
    </>
  )
}
