import { useUserContext } from '@/core/context'
import { Api } from '@/core/trpc'
import { ErrorBoundary, PageLayout } from '@/designSystem'
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  notification,
  Table,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
const { Title, Text } = Typography

export default function NotificaeseLembretesPage() {
  const { user } = useUserContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const { t } = useTranslation()

  // Fetch notifications with retry mechanism
  const {
    data: notifications,
    refetch,
    isLoading,
  } = Api.notification.findMany.useQuery(
    {
      where: { userId: user?.id },
      orderBy: { createdAt: 'desc' },
    },
    {
      retry: 3,
      onError: error => {
        notification.error({
          message: t('notifications.error'),
          description: error.message,
        })
      },
    },
  )

  // Create notification mutation with retry
  const { mutateAsync: createNotification, isLoading: isCreating } =
    Api.notification.create.useMutation({
      retry: 3,
      onError: error => {
        notification.error({
          message: t('notifications.reminderCreateError'),
          description: error.message,
        })
      },
    })

  // Cleanup notification subscriptions and form state
  useEffect(() => {
    const abortController = new AbortController()
    const cleanupTimeouts: NodeJS.Timeout[] = []

    return () => {
      abortController.abort()
      cleanupTimeouts.forEach(timeout => clearTimeout(timeout))
      notification.destroy()
      message.destroy()
      setIsModalOpen(false)
      form.resetFields()
    }
  }, [form])

  const handleCreateReminder = async (values: any) => {
    if (
      !values.message?.trim() ||
      !values.date ||
      !dayjs(values.date).isValid()
    ) {
      notification.error({
        message: t('notifications.validation.error'),
        description: t('notifications.validation.invalidData'),
      })
      return
    }

    if (dayjs(values.date).isBefore(dayjs())) {
      notification.error({
        message: t('notifications.validation.error'),
        description: t('notifications.validation.pastDate'),
      })
      return
    }

    try {
      await createNotification({
        data: {
          type: 'REMINDER',
          message: values.message.trim(),
          isRead: false,
          sentAt: dayjs(values.date).toISOString(),
          userId: user?.id,
        },
      })
      notification.success({
        message: t('notifications.success'),
        description: t('notifications.reminderCreatedSuccess'),
      })
      setIsModalOpen(false)
      form.resetFields()
      refetch()
    } catch (error) {
      console.error('Error creating notification:', error)
      notification.error({
        message: t('notifications.error'),
        description: error.message || t('notifications.reminderCreateError'),
      })
    }
  }

  const columns = [
    {
      title: t('notifications.type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <span>
          <i
            className={`las ${
              type === 'REMINDER' ? 'la-bell' : 'la-envelope'
            } mr-2`}
          ></i>
          {t(`notifications.types.${type.toLowerCase()}`)}
        </span>
      ),
    },
    {
      title: t('notifications.message'),
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: t('notifications.date'),
      dataIndex: 'sentAt',
      key: 'sentAt',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: t('notifications.status'),
      dataIndex: 'isRead',
      key: 'isRead',
      render: (isRead: boolean) => (
        <span>
          <i
            className={`las ${
              isRead ? 'la-check-circle text-success' : 'la-clock text-warning'
            } mr-2`}
          ></i>
          {isRead ? t('notifications.read') : t('notifications.unread')}
        </span>
      ),
    },
  ]

  return (
    <PageLayout layout="full-width">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Title level={2}>{t('notifications.title')}</Title>
            <Text>{t('notifications.description')}</Text>
          </div>
          <Button
            type="primary"
            onClick={() => setIsModalOpen(true)}
            icon={<i className="las la-plus mr-2"></i>}
          >
            {t('notifications.newReminder')}
          </Button>
        </div>

        <ErrorBoundary
          fallback={
            <div className="p-4">
              <Typography.Text type="danger">
                {t('notifications.error')}
              </Typography.Text>
              <Button onClick={() => refetch()}>{t('common.retry')}</Button>
            </div>
          }
        >
          <Table
            dataSource={(() => {
              try {
                return notifications
                  ?.map(notification => {
                    // Validate required fields
                    if (
                      !notification.id ||
                      !notification.type ||
                      !notification.message
                    ) {
                      console.error('Invalid notification data:', notification)
                      return null
                    }
                    // Validate date format
                    if (
                      notification.sentAt &&
                      !dayjs(notification.sentAt).isValid()
                    ) {
                      console.error('Invalid date format:', notification.sentAt)
                      return null
                    }
                    // Validate boolean field
                    if (typeof notification.isRead !== 'boolean') {
                      console.error(
                        'Invalid isRead status:',
                        notification.isRead,
                      )
                      return null
                    }
                    return notification
                  })
                  .filter(Boolean)
              } catch (error) {
                console.error('Notification validation error:', error)
                notification.error({
                  message: t('notifications.error'),
                  description: t('notifications.validation.error'),
                })
                return []
              }
            })()}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            loading={isLoading || isCreating}
          />
        </ErrorBoundary>

        <Modal
          title={t('notifications.createNewReminder')}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleCreateReminder}>
            <Form.Item
              name="message"
              label={t('notifications.messageLabel')}
              rules={[
                { required: true, message: t('notifications.messageRequired') },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item
              name="date"
              label={t('notifications.dateLabel')}
              rules={[
                { required: true, message: t('notifications.dateRequired') },
              ]}
            >
              <Input type="datetime-local" />
            </Form.Item>

            <Form.Item className="mb-0 text-right">
              <Button
                type="default"
                onClick={() => setIsModalOpen(false)}
                className="mr-2"
              >
                {t('common.cancel')}
              </Button>
              <Button type="primary" htmlType="submit" loading={isCreating}>
                {t('notifications.createReminder')}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PageLayout>
  )
}
