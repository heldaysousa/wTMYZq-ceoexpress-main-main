import { Col, ColProps, Row } from 'antd'
import React, { ReactNode } from 'react'

const ItemComponent = React.memo(({ item, index, renderChild }: any) => {
  return renderChild(item, index)
})

ItemComponent.displayName = 'GalleryItem'

type Props<ItemType> = {
  items: ItemType[]
  children: (item: ItemType, index?: number) => ReactNode
  rowProps?: ColProps
  colProps?: ColProps
}

export const Gallery = <ItemType,>({
  items,
  children,
  colProps = {},
  rowProps = {},
}: Props<ItemType>) => {
  return (
    <Row gutter={[24, 48]} className="w-full" {...rowProps}>
      {items.map((item, index) => (
        <Col key={index} xs={24} sm={12} md={6} {...colProps}>
          <ItemComponent item={item} index={index} renderChild={children} />
        </Col>
      ))}
    </Row>
  )
}
