import { ErrorBoundary } from '@/core/components/ErrorBoundary'
import { useUserContext } from '@/core/context'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'
import { DashboardGrid } from '@/plugins/custom-dashboard'
import { ChartConfigValue } from '@/plugins/custom-dashboard/types'
import { Appointment, Transaction } from '@prisma/client'
import { Link } from '@remix-run/react'
import {
  Button,
  Col,
  notification,
  Row,
  Skeleton,
  Space,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
const { Title, Text } = Typography

export default function HomeDashboardPage() {
  const { user, refetch } = useUserContext()
  const { mutateAsync: updateUser, isLoading: isUpdating } =
    Api.user.update.useMutation()

  // Fetch transactions for revenue calculations
  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions,
  } = Api.transaction.findMany.useQuery<Transaction[]>(
    {
      where: {
        userId: user?.id,
        type: 'REVENUE',
        date: {
          gte: dayjs().startOf('month').format('YYYY-MM-DD'),
        },
      },
      take: 10,
    },
    {
      staleTime: 300000, // 5 minutes
      cacheTime: 600000, // 10 minutes
      retry: 3,
      onError: error => {
        console.error('Error fetching transactions:', error)
        notification.error({
          message: t('revenue.error.dataLoad'),
          description: error.message,
        })
      },
    },
  )

  // Fetch upcoming appointments
  const {
    data: appointments,
    isLoading: isLoadingAppointments,
    refetch: refetchAppointments,
  } = Api.appointment.findMany.useQuery<Appointment[]>(
    {
      where: {
        userId: user?.id,
        startTime: {
          gte: dayjs().format('YYYY-MM-DD'),
        },
      },
      include: {
        client: true,
        service: true,
      },
      orderBy: {
        startTime: 'asc',
      },
      take: 10,
    },
    {
      staleTime: 60000, // 1 minute,
      retry: 3,
      onError: error => {
        console.error('Error fetching appointments:', error)
        notification.error({
          message: t('dashboard.error.loading'),
          description: error.message,
        })
      },
    },
  )

  // Fetch notifications
  const {
    data: notifications,
    isLoading: isLoadingNotifications,
    refetch: refetchNotifications,
  } = Api.notification.findMany.useQuery<Notification[]>(
    {
      where: {
        userId: user?.id,
        isRead: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    },
    {
      staleTime: 60000, // 1 minute,
      retry: 3,
      onError: error => {
        console.error('Error fetching notifications:', error)
        notification.error({
          message: t('notifications.error'),
          description: error.message,
        })
      },
    },
  )

  // Calculate daily and monthly revenue using useMemo with error handling
  const dailyRevenue = useMemo(() => {
    if (!transactions?.length) return 0

    try {
      return transactions
        .filter(t => dayjs(t.date).isSame(dayjs(), 'day'))
        .reduce((acc, curr) => {
          if (!curr.amount) return acc
          const amount = parseFloat(curr.amount.toString())
          if (!Number.isFinite(amount)) return acc
          return acc + amount
        }, 0)
    } catch (error) {
      console.error('Error calculating daily revenue:', error)
      return 0
    }
  }, [transactions])

  const monthlyRevenue = useMemo(() => {
    if (!transactions?.length) return 0

    try {
      return transactions.reduce((acc, curr) => {
        if (!curr.amount) return acc
        const amount = parseFloat(curr.amount.toString())
        if (!Number.isFinite(amount)) return acc
        return acc + amount
      }, 0)
    } catch (error) {
      console.error('Error calculating monthly revenue:', error)
      return 0
    }
  }, [transactions])

  const { t } = useTranslation()

  // Show notifications with cleanup using AbortController
  useEffect(() => {
    const abortController = new AbortController()
    const notificationKeys = new Set<string>()
    const cleanupNotifications = () => {
      notificationKeys.forEach(key => notification.destroy(key))
      notificationKeys.clear()
    }

    if (notifications?.length) {
      cleanupNotifications() // Cleanup existing notifications first

      if (!abortController.signal.aborted) {
        notifications.forEach(notif => {
          if (!notif.isRead) {
            const key = `${notif.id}-${Date.now()}`
            notificationKeys.add(key)
            notification.info({
              key,
              message: t('notifications.new'),
              description: notif.message,
              placement: 'topRight',
              duration: 5, // Auto dismiss after 5 seconds
              onClose: () => notificationKeys.delete(key),
            })
          }
        })
      }
    }

    return () => {
      abortController.abort()
      cleanupNotifications()
    }
  }, [notifications, t])

  return (
    <PageLayout layout="full-width">
      <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2}>
              <i className="las la-home" /> {t('Dashboard')}
            </Title>
            <Text type="secondary">{t('Welcome to CEO Express')}</Text>
          </Col>
          <Col>
            <Space>
              <Link to="/dashboard">
                <Button type="primary">{t('New Dashboard')}</Button>
              </Link>
              <Link to="/dashboard/settings">
                <Button>{t('Dashboard Settings')}</Button>
              </Link>
            </Space>
          </Col>
        </Row>

        <ErrorBoundary
          fallback={
            <div className="p-4">
              <Typography.Text type="danger">
                {t('dashboard.error.loading')}
              </Typography.Text>
              <Space>
                <Button onClick={() => refetchTransactions()}>
                  {t('Retry Transactions')}
                </Button>
                <Button onClick={() => refetchAppointments()}>
                  {t('Retry Appointments')}
                </Button>
                <Button onClick={() => refetchNotifications()}>
                  {t('Retry Notifications')}
                </Button>
              </Space>
            </div>
          }
        >
          <DashboardGrid
            isLoading={
              isLoadingTransactions ||
              isLoadingAppointments ||
              isLoadingNotifications
            }
            loadingFallback={<Skeleton active paragraph={{ rows: 6 }} />}
            chartConfigs={[
              {
                dataSet: 'Revenue',
                data: (transactions || []).map(t => ({
                  name: t.category || 'Uncategorized',
                  value: t.amount || 0,
                })),
                filters: [
                  {
                    property: 'date',
                    label: 'Date Range',
                    type: 'range-date',
                  },
                  {
                    property: 'category',
                    label: 'Category',
                    type: 'select',
                    options: [
                      ...new Set(
                        (transactions || []).map(t => ({
                          label: t.category || 'Uncategorized',
                          value: t.category || 'Uncategorized',
                        })),
                      ),
                    ],
                  },
                ],
              },
              {
                dataSet: 'Appointments',
                data: Object.entries(
                  (appointments || []).reduce((acc, curr) => {
                    const serviceName = curr.service?.name || 'Unnamed'
                    acc[serviceName] = (acc[serviceName] || 0) + 1
                    return acc
                  }, {} as Record<string, number>),
                ).map(([name, count]) => ({
                  name,
                  value: count,
                })),
                filters: [
                  {
                    property: 'startTime',
                    label: 'Date Range',
                    type: 'range-date',
                  },
                ],
              },
              {
                dataSet: 'Clients',
                data: Object.entries(
                  (appointments || []).reduce((acc, curr) => {
                    const clientName = curr.client?.name || 'Unknown'
                    acc[clientName] = (acc[clientName] || 0) + 1
                    return acc
                  }, {} as Record<string, number>),
                ).map(([name, count]) => ({
                  name,
                  value: count,
                })),
              },
            ]}
            value={(() => {
              try {
                if (!user?.customDashboard) {
                  return defaultDashboardConfig
                }

                const parsedConfig =
                  typeof user.customDashboard === 'string'
                    ? JSON.parse(user.customDashboard)
                    : user.customDashboard

                if (!Array.isArray(parsedConfig)) {
                  throw new Error('Invalid dashboard configuration')
                }

                return (
                  (parsedConfig as ChartConfigValue[]) || [
                    {
                      id: '1',
                      dataSet: 'Revenue',
                      title: t('Revenue Distribution'),
                      type: 'pie',
                    },
                    {
                      id: '2',
                      dataSet: 'Appointments',
                      title: t('Appointments by Service'),
                      type: 'pie',
                    },
                    {
                      id: '3',
                      dataSet: 'Clients',
                      title: t('Client Distribution'),
                      type: 'pie',
                    },
                  ]
                )
              } catch (error) {
                console.error('Failed to parse dashboard config:', error)
                return [
                  {
                    id: '1',
                    dataSet: 'Revenue',
                    title: t('Revenue Distribution'),
                    type: 'pie',
                  },
                  {
                    id: '2',
                    dataSet: 'Appointments',
                    title: t('Appointments by Service'),
                    type: 'pie',
                  },
                  {
                    id: '3',
                    dataSet: 'Clients',
                    title: t('Client Distribution'),
                    type: 'pie',
                  },
                ]
              }
            })()}
            onChange={async (values: ChartConfigValue[]) => {
              try {
                await updateUser({
                  where: { id: user?.id },
                  data: {
                    customDashboard: values,
                  },
                })
                refetch()
                notification.success({
                  message: t('dashboard.updateSuccess'),
                  description: t('dashboard.updateSuccessDescription'),
                })
              } catch (error) {
                console.error('Error updating dashboard:', error)
                notification.error({
                  message: t('dashboard.updateError'),
                  description: t('dashboard.updateErrorDescription'),
                })
              }
            }}
          />
        </ErrorBoundary>
      </div>
    </PageLayout>
  )
}
