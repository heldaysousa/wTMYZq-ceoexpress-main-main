import { useUserContext } from '@/core/context'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'
import {
  Button,
  Card,
  Col,
  message,
  Modal,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
const { Title, Text } = Typography

export default function SubscriptionPage() {
  const { user } = useUserContext()
  const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false)

  // Fetch current subscription
  const { data: currentSubscription, refetch } =
    Api.subscription.findFirst.useQuery({
      where: {
        userId: user?.id,
        status: 'ACTIVE',
      },
      orderBy: { createdAt: 'desc' },
    })

  // Fetch subscription history
  const { data: subscriptionHistory } = Api.subscription.findMany.useQuery({
    where: { userId: user?.id },
    orderBy: { createdAt: 'desc' },
  })

  // Mutation for upgrading subscription
  const { mutateAsync: updateSubscription } =
    Api.subscription.update.useMutation()
  const { mutateAsync: createSubscription } =
    Api.subscription.create.useMutation()

  const handleUpgrade = async (plan: string) => {
    try {
      if (currentSubscription) {
        // Update current subscription to inactive
        await updateSubscription({
          where: { id: currentSubscription.id },
          data: { status: 'INACTIVE' },
        })
      }

      // Create new subscription
      await createSubscription({
        data: {
          plan,
          status: 'ACTIVE',
          startDate: dayjs().format('YYYY-MM-DD'),
          endDate:
            plan === 'SEMESTER'
              ? dayjs().add(6, 'month').format('YYYY-MM-DD')
              : dayjs().add(1, 'year').format('YYYY-MM-DD'),
          userId: user?.id,
        },
      })

      message.success('Subscription upgraded successfully!')
      setIsUpgradeModalVisible(false)
      refetch()
    } catch (error) {
      message.error('Failed to upgrade subscription')
    }
  }

  const subscriptionColumns = [
    {
      title: 'Plan',
      dataIndex: 'plan',
      key: 'plan',
      render: (plan: string) => (
        <Tag
          color={
            plan === 'ANNUAL' ? 'gold' : plan === 'SEMESTER' ? 'blue' : 'green'
          }
        >
          {plan}
        </Tag>
      ),
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'success' : 'default'}>{status}</Tag>
      ),
    },
  ]

  return (
    <PageLayout layout="full-width">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        <Title level={2}>
          <i className="las la-credit-card" style={{ marginRight: 8 }} />
          Subscription Management
        </Title>
        <Text type="secondary">
          Manage your subscription plan and payment methods
        </Text>

        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24} lg={12}>
            <Card
              title={
                <span>
                  <i className="las la-star" style={{ marginRight: 8 }} />
                  Current Plan
                </span>
              }
            >
              {currentSubscription ? (
                <>
                  <Title level={4}>{currentSubscription.plan}</Title>
                  <Text>
                    Valid until:{' '}
                    {dayjs(currentSubscription.endDate).format('MMM DD, YYYY')}
                  </Text>
                  <div style={{ marginTop: 16 }}>
                    <Button
                      type="primary"
                      onClick={() => setIsUpgradeModalVisible(true)}
                    >
                      <i
                        className="las la-arrow-up"
                        style={{ marginRight: 8 }}
                      />
                      Upgrade Plan
                    </Button>
                  </div>
                </>
              ) : (
                <Text>No active subscription</Text>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              title={
                <span>
                  <i className="las la-wallet" style={{ marginRight: 8 }} />
                  Payment Methods
                </span>
              }
            >
              <Button type="primary">
                <i className="las la-plus" style={{ marginRight: 8 }} />
                Add Payment Method
              </Button>
            </Card>
          </Col>
        </Row>

        <Card
          title={
            <span>
              <i className="las la-history" style={{ marginRight: 8 }} />
              Subscription History
            </span>
          }
          style={{ marginTop: 24 }}
        >
          <Table
            dataSource={subscriptionHistory}
            columns={subscriptionColumns}
            rowKey="id"
          />
        </Card>

        <Modal
          title="Upgrade Plan"
          open={isUpgradeModalVisible}
          onCancel={() => setIsUpgradeModalVisible(false)}
          footer={null}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Card onClick={() => handleUpgrade('SEMESTER')}>
              <Title level={4}>Semester Plan</Title>
              <Text>6 months of premium features</Text>
            </Card>
            <Card onClick={() => handleUpgrade('ANNUAL')}>
              <Title level={4}>Annual Plan</Title>
              <Text>12 months of premium features with 20% discount</Text>
            </Card>
          </Space>
        </Modal>
      </div>
    </PageLayout>
  )
}
