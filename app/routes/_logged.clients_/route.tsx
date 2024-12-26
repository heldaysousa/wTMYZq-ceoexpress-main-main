import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'
import type { Client } from '@prisma/client'
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Table,
  Typography,
} from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
const { Title, Text } = Typography
const { Search } = Input

console.log('Api object content:', Object.keys(Api))

export default function ClientsPage() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [form] = Form.useForm()

  // Fetch clients
  const {
    data: clients,
    isLoading,
    refetch,
  } = Api.client.findMany.useQuery({
    where: {
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
        { phoneNumber: { contains: searchTerm, mode: 'insensitive' } },
      ],
    },
  })

  // Mutations
  const { mutateAsync: createClient } = Api.client.create.useMutation()
  const { mutateAsync: updateClient } = Api.client.update.useMutation()
  const { mutateAsync: deleteClient } = Api.client.delete.useMutation()

  const handleSubmit = async (values: any) => {
    try {
      if (editingClient) {
        await updateClient({
          where: { id: editingClient.id },
          data: values,
        })
      } else {
        await createClient({
          data: {
            ...values,
            serviceHistory: [],
            loyaltyPoints: 0,
            userId: '1', // Replace with actual user ID from context
          },
        })
      }
      await refetch()
      setIsModalVisible(false)
      form.resetFields()
      setEditingClient(null)
    } catch (error) {
      console.error('Error saving client:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteClient({ where: { id } })
      await refetch()
    } catch (error) {
      console.error('Error deleting client:', error)
    }
  }

  const columns = [
    {
      title: t('clients.columns.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('clients.columns.email'),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t('clients.columns.phone'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: t('clients.columns.lastVisit'),
      dataIndex: 'lastVisit',
      key: 'lastVisit',
    },
    {
      title: t('clients.columns.actions'),
      key: 'actions',
      render: (_: any, record: Client) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditingClient(record)
              form.setFieldsValue(record)
              setIsModalVisible(true)
            }}
            title={t('clients.actions.edit')}
          >
            <i className="las la-edit" />
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record.id)}
            title={t('clients.actions.delete')}
          >
            <i className="las la-trash" />
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <PageLayout layout="full-width">
      <Row justify="center">
        <Col xs={23} sm={23} md={22} lg={20}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography.Title level={2}>
                  {t('clients.title')}
                </Typography.Title>
                <Button type="primary" onClick={() => setIsModalVisible(true)}>
                  <i className="las la-user-plus" /> {t('clients.addNew')}
                </Button>
              </div>

              <Search
                placeholder={t('clients.search.placeholder')}
                allowClear
                onChange={e => setSearchTerm(e.target.value)}
                style={{ maxWidth: 400 }}
              />

              <Table
                columns={columns}
                dataSource={clients}
                loading={isLoading}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            </Space>
          </Card>
        </Col>
      </Row>

      <Modal
            title={editingClient ? t('clients.modal.edit') : t('clients.modal.add')}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingClient(null)
          form.resetFields()
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label={t('clients.form.name.label')}
            rules={[
              { required: true, message: t('clients.form.name.required') },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="email" label={t('clients.form.email.label')}>
            <Input type="email" />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label={t('clients.form.phone.label')}
            rules={[
              { required: true, message: t('clients.form.phone.required') },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="notes" label={t('clients.form.notes.label')}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="lastVisit" label={t('clients.form.lastVisit.label')}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingClient
                  ? t('clients.form.button.update')
                  : t('clients.form.button.create')}
              </Button>
              <Button
                onClick={() => {
                  setIsModalVisible(false)
                  setEditingClient(null)
                  form.resetFields()
                }}
              >
                {t('clients.form.button.cancel')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </PageLayout>
  )
}
