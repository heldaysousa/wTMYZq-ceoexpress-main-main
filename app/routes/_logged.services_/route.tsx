import { useUserContext } from '@/core/context'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'
import type { Service } from '@prisma/client'
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Typography,
  message,
} from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
const { Title, Text, Paragraph } = Typography

export default function ServicesPage() {
  const { t } = useTranslation()
  const { user } = useUserContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [form] = Form.useForm()

  const { data: services, refetch } = Api.service.findMany.useQuery({
    where: { userId: user?.id },
    orderBy: { createdAt: 'desc' },
  })

  const { mutateAsync: createService } = Api.service.create.useMutation()
  const { mutateAsync: updateService } = Api.service.update.useMutation()
  const { mutateAsync: deleteService } = Api.service.delete.useMutation()

  const handleSubmit = async (values: any) => {
    try {
      if (editingService) {
        await updateService({
          where: { id: editingService.id },
          data: {
            ...values,
            isActive: true,
            imageUrl: values.imageUrl || 'https://placeholder.com/300x200',
            promotion: {},
            availability: {},
            userId: user?.id,
          },
        })
        message.success(t('services.message.updateSuccess'))
      } else {
        await createService({
          data: {
            ...values,
            isActive: true,
            imageUrl: values.imageUrl || 'https://placeholder.com/300x200',
            promotion: {},
            availability: {},
            userId: user?.id,
          },
        })
        message.success(t('services.message.createSuccess'))
      }
      form.resetFields()
      setIsModalOpen(false)
      setEditingService(null)
      refetch()
    } catch (error) {
      message.error(t('services.message.error'))
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteService({ where: { id } })
      message.success(t('services.message.deleteSuccess'))
      refetch()
    } catch (error) {
      message.error('An error occurred')
    }
  }

  const categories = Array.from(
    new Set(services?.map(service => service.category)),
  ).filter(Boolean)

  return (
    <PageLayout layout="full-width">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <div>
            <Title level={2}>
              <i className="las la-concierge-bell"></i> {t('services.title')}
            </Title>
            <Text>{t('services.subtitle')}</Text>
          </div>
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            <i className="las la-plus"></i> {t('submenu.services.create')}
          </Button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
          }}
        >
          {services?.map(service => (
            <Card key={service.id} hoverable>
              <Title level={5}>{service.name}</Title>
              <Text type="secondary">{service.category}</Text>
              <Paragraph>{service.description}</Paragraph>
              <Text strong>
                {t('services.price', { price: service.price })}
              </Text>
              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <Button
                  onClick={() => {
                    setEditingService(service)
                    form.setFieldsValue(service)
                    setIsModalOpen(true)
                  }}
                >
                  <i className="las la-edit"></i> {t('submenu.services.edit')}
                </Button>
                <Popconfirm
                  title={t('services.delete.title')}
                  description={t('services.delete.description')}
                  onConfirm={() => handleDelete(service.id)}
                >
                  <Button danger>
                    <i className="las la-trash"></i>{' '}
                    {t('submenu.services.delete')}
                  </Button>
                </Popconfirm>
              </div>
            </Card>
          ))}
        </div>

        <Modal
          title={
            editingService
              ? t('services.modal.titleEdit')
              : t('services.modal.titleAdd')
          }
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false)
            setEditingService(null)
            form.resetFields()
          }}
          footer={null}
        >
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item
              name="name"
              label={t('services.form.name.label')}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label={t('services.form.description.label')}
              rules={[{ required: true }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="price" label="Price" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} prefix="$" />
            </Form.Item>
            <Form.Item
              name="duration"
              label={t('services.form.duration.label')}
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="category" label="Category">
              <Select
                allowClear
                showSearch
                options={categories.map(cat => ({ value: cat, label: cat }))}
              />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {editingService
                    ? t('services.form.button.update')
                    : t('services.form.button.create')}
                </Button>
                <Button
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingService(null)
                    form.resetFields()
                  }}
                >
                  {t('services.form.button.cancel')}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PageLayout>
  )
}
