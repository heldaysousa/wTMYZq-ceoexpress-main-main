import { InfoCircleFilled } from '@ant-design/icons'
import { Badge, Tooltip, TooltipProps } from 'antd'
import React, { ReactNode } from 'react'

type Props = {
  tooltipContent?: ReactNode
  children: ReactNode
  propsTooltip?: TooltipProps
}

export const TooltipBadge: React.FC<Props> = ({
  tooltipContent,
  children,
  propsTooltip = {},
}) => {
  return (
    <Badge
      count={
        <Tooltip title={tooltipContent} placement="bottom" {...propsTooltip}>
          <InfoCircleFilled style={{ cursor: 'help' }} />
        </Tooltip>
      }
    >
      {children}
    </Badge>
  )
}
