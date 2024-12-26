import { useUserContext } from '@/core/context'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Table,
  Typography,
  message,
} from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
const { Title, Text } = Typography

export default function ProductsServicesPage() {
  const { t } = useTranslation()
  const { user } = useUserContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [itemType, setItemType] = useState<'product' | 'service'>('product')
  const [editingId, setEditingId] = useState<string | null>(null)

  const { data: services, refetch: refetchServices } =
    Api.service.findMany.useQuery({
      where: { userId: user?.id },
    })

  const { mutateAsync: createService } = Api.service.create.useMutation()
  const { mutateAsync: updateService } = Api.service.update.useMutation()
  const { mutateAsync: deleteService } = Api.service.delete.useMutation()

  const handleSubmit = async (values: any) => {
    try {
      const serviceData = {
        name: values.name,
        description: values.description,
        price: values.price.toString(),
        duration: values.duration || 0,
        category: values.category,
        isActive: true,
        imageUrl: 'https://placeholder.com/300x200',
        promotion: {},
        availability: {},
        userId: user?.id,
      }

      if (editingId) {
        await updateService({
          where: { id: editingId },
          data: serviceData,
        })
      } else {
        await createService({ data: serviceData })
      }

      message.success(
        t('products.successMessage', {
          type: t(
            itemType === 'product' ? 'products.product' : 'products.service',
          ),
          action: t(editingId ? 'common.updated' : 'common.created'),
        }),
      )
      setIsModalOpen(false)
      form.resetFields()
      refetchServices()
    } catch (error) {
      message.error(t('common.errorSaving'))
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteService({ where: { id } })
      message.success(t('common.deleteSuccess'))
      refetchServices()
    } catch (error) {
      message.error(t('common.errorDeleting'))
    }
  }

  const columns = [
    {
      title: t('common.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('common.description'),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: t('common.price'),
      dataIndex: 'price',
      key: 'price',
      render: (price: string) => `R$ ${price}`,
    },
    {
      title: t('common.category'),
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_: any, record: any) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setEditingId(record.id)
              form.setFieldsValue(record)
              setIsModalOpen(true)
            }}
          >
            <i className="las la-edit"></i>
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            <i className="las la-trash-alt"></i>
          </Button>
        </>
      ),
    },
  ]

  return (
    <PageLayout layout="full-width">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <Title level={2}>{t('products.management')}</Title>
          <Button
            type="primary"
            onClick={() => {
              setEditingId(null)
              form.resetFields()
              setIsModalOpen(true)
            }}
          >
            <i className="las la-plus"></i> {t('products.newItem')}
          </Button>
        </div>

        <Table dataSource={services} columns={columns} rowKey="id" />

        <Modal
          title={t('products.modalTitle', {
            action: t(editingId ? 'common.edit' : 'common.new'),
            type: t(
              itemType === 'product' ? 'products.product' : 'products.service',
            ),
          })}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="type" label={t('common.type')}>
              <Select
                onChange={(value: 'product' | 'service') => setItemType(value)}
                defaultValue="product"
              >
                <Select.Option value="product">
                  {t('products.product')}
                </Select.Option>
                <Select.Option value="service">
                  {t('products.service')}
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="name"
              label={t('common.name')}
              rules={[{ required: true, message: t('common.required') }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="description"
              label={t('common.description')}
              rules={[{ required: true, message: t('common.required') }]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              name="price"
              label={t('common.price')}
              rules={[{ required: true, message: t('common.required') }]}
            >
              <InputNumber style={{ width: '100%' }} prefix="R$" step={0.01} />
            </Form.Item>

            {itemType === 'service' && (
              <Form.Item
                name="duration"
                label={t('products.duration')}
                rules={[{ required: true, message: t('common.required') }]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            )}

            <Form.Item
              name="category"
              label={t('common.category')}
              rules={[{ required: true, message: t('common.required') }]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                {t(editingId ? 'common.update' : 'common.create')}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PageLayout>
  )
}
