import {
  Typography,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  message,
} from 'antd'
import { useState } from 'react'
import type { TeamMember, Service } from '@prisma/client'
const { Title, Text } = Typography
import { useUserContext } from '@/core/context'
import dayjs from 'dayjs'
import { useLocation, useNavigate, useParams } from '@remix-run/react'
import { useUploadPublic } from '@/plugins/upload/client'
import { Api } from '@/core/trpc/client'
import { PageLayout } from '@/designSystem'

export default function GestodeEquipePage() {
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
  const [form] = Form.useForm()

  // Fetch team members and services
  const { data: teamMembers, refetch: refetchTeam } =
    Api.teamMember.findMany.useQuery({})
  const { data: services, refetch: refetchServices } =
    Api.service.findMany.useQuery({})

  // Mutations
  const { mutateAsync: createTeamMember } = Api.teamMember.create.useMutation()
  const { mutateAsync: createService } = Api.service.create.useMutation()
  const { mutateAsync: deleteTeamMember } = Api.teamMember.delete.useMutation()
  const { mutateAsync: deleteService } = Api.service.delete.useMutation()

  const handleCreateTeamMember = async (values: Partial<TeamMember>) => {
    try {
      await createTeamMember({
        data: {
          name: values.name || '',
          role: values.role || '',
          isActive: true,
          phoneNumber: values.phoneNumber || '',
          availability: {},
        },
      })
      message.success('Team member added successfully')
      setIsTeamModalOpen(false)
      form.resetFields()
      refetchTeam()
    } catch (error) {
      message.error('Failed to add team member')
    }
  }

  const handleCreateService = async (values: Partial<Service>) => {
    try {
      await createService({
        data: {
          name: values.name || '',
          description: values.description || '',
          price: parseFloat(values.price?.toString() || '0'),
          isActive: true,
          imageUrl: 'https://placeholder.com/150',
          promotion: {},
          availability: {},
        },
      })
      message.success('Service added successfully')
      setIsServiceModalOpen(false)
      form.resetFields()
      refetchServices()
    } catch (error) {
      message.error('Failed to add service')
    }
  }

  const teamColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Text type={isActive ? 'success' : 'danger'}>
          {isActive ? 'Active' : 'Inactive'}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: TeamMember) => (
        <Button
          danger
          onClick={async () => {
            await deleteTeamMember({ where: { id: record.id } })
            refetchTeam()
          }}
        >
          <i className="las la-trash"></i>
        </Button>
      ),
    },
  ]

  const serviceColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Text type={isActive ? 'success' : 'danger'}>
          {isActive ? 'Active' : 'Inactive'}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Service) => (
        <Button
          danger
          onClick={async () => {
            await deleteService({ where: { id: record.id } })
            refetchServices()
          }}
        >
          <i className="las la-trash"></i>
        </Button>
      ),
    },
  ]

  return (
    <PageLayout layout="full-width">
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={2}>
          <i className="las la-users"></i> Team & Services Management
        </Title>
        <Text>
          Manage your team members and services offered by your business.
        </Text>

        <div style={{ marginTop: '24px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <Title level={4}>Team Members</Title>
            <Button type="primary" onClick={() => setIsTeamModalOpen(true)}>
              <i className="las la-plus"></i> Add Team Member
            </Button>
          </div>
          <Table columns={teamColumns} dataSource={teamMembers} rowKey="id" />
        </div>

        <div style={{ marginTop: '48px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <Title level={4}>Services</Title>
            <Button type="primary" onClick={() => setIsServiceModalOpen(true)}>
              <i className="las la-plus"></i> Add Service
            </Button>
          </div>
          <Table columns={serviceColumns} dataSource={services} rowKey="id" />
        </div>

        <Modal
          title="Add Team Member"
          open={isTeamModalOpen}
          onCancel={() => setIsTeamModalOpen(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleCreateTeamMember} layout="vertical">
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="role" label="Role" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add Member
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Add Service"
          open={isServiceModalOpen}
          onCancel={() => setIsServiceModalOpen(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleCreateService} layout="vertical">
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="price" label="Price" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add Service
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PageLayout>
  )
}
