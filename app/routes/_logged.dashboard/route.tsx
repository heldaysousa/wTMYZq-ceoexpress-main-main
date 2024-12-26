import { PageLayout } from '@/designSystem'
import { DashboardGrid } from '@/plugins/custom-dashboard'
import { ChartConfigValue } from '@/plugins/custom-dashboard/types'
import { useUserContext } from '~/core/context'
import { Api } from '~/core/trpc'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { ErrorBoundary } from '@/core/components/ErrorBoundary'
import { notification } from 'antd'

export default function DashboardPage() {
  const { t } = useTranslation()
  const { user, refetch } = useUserContext()
  const { mutateAsync: updateUser } = Api.user.update.useMutation()

  const { data: todayTransactions, isLoading: isLoadingToday } = Api.transaction.findMany.useQuery({
    where: {
      date: {
        gte: dayjs().startOf('day').toDate(),
        lte: dayjs().endOf('day').toDate()
      }
    }
  })

  const { data: monthlyTransactions, isLoading: isLoadingMonthly } = Api.transaction.findMany.useQuery({
    where: {
      date: {
        gte: dayjs().startOf('month').toDate(),
        lte: dayjs().endOf('month').toDate()
      }
    }
  })

  const { data: todayAppointments, isLoading: isLoadingAppointments } = Api.appointment.findMany.useQuery({
    where: {
      startTime: {
        gte: dayjs().startOf('day').toDate(),
        lte: dayjs().endOf('day').toDate()
      }
    }
  })

  const todayRevenue = useMemo(() => {
    try {
      return todayTransactions?.reduce((sum, t) => {
        const amount = parseFloat(t.amount?.toString() || '0')
        return Number.isFinite(amount) ? sum + amount : sum
      }, 0) || 0
    } catch (error) {
      console.error('Error calculating today revenue:', error)
      return 0
    }
  }, [todayTransactions])

  const monthlyRevenue = useMemo(() => {
    try {
      return monthlyTransactions?.map(t => {
        const amount = parseFloat(t.amount?.toString() || '0')
        return {
          date: dayjs(t.date).format('DD/MM'),
          value: Number.isFinite(amount) ? amount : 0
        }
      }) || []
    } catch (error) {
      console.error('Error calculating monthly revenue:', error)
      return []
    }
  }, [monthlyTransactions])
  const appointmentsCount = todayAppointments?.length || 0

  const monthlyGoals = [
    { name: 'Week 1', value: 5000 },
    { name: 'Week 2', value: 6000 },
    { name: 'Week 3', value: 7000 },
    { name: 'Week 4', value: 8000 }
  ]

  return (
    <PageLayout>
      <ErrorBoundary
        fallback={
          <div className="p-4">
            <Typography.Text type="danger">
              {t('dashboard.error.loading')}
            </Typography.Text>
          </div>
        }
      >
        <DashboardGrid
          isLoading={isLoadingToday || isLoadingMonthly || isLoadingAppointments}
        chartConfigs={[
          {
            dataSet: 'TodayRevenue',
            data: [{ value: todayRevenue }]
          },
          {
            dataSet: 'MonthlyRevenue',
            data: monthlyRevenue
          },
          {
            dataSet: 'AppointmentsCount',
            data: [{ value: appointmentsCount }]
          },
          {
            dataSet: 'MonthlyGoals',
            data: monthlyGoals
          }
        ]}
        value={[
          {
            id: '1',
            dataSet: 'TodayRevenue',
            title: t('dashboard.todayRevenue'),
            type: 'number'
          },
          {
            id: '2', 
            dataSet: 'MonthlyRevenue',
            title: t('dashboard.monthlyRevenue'),
            type: 'line'
          },
          {
            id: '3',
            dataSet: 'AppointmentsCount', 
            title: t('dashboard.todayAppointments'),
            type: 'number'
          },
          {
            id: '4',
            dataSet: 'MonthlyGoals',
            title: t('dashboard.monthlyGoals'),
            type: 'bar'
          }
        ]}
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
              message: t('dashboard.update.success'),
              description: t('dashboard.update.successDescription')
            })
          } catch (error) {
            console.error('Error updating dashboard:', error)
            notification.error({
              message: t('dashboard.update.error'),
              description: t('dashboard.update.errorDescription')
            })
          }
        }}
      />
      </ErrorBoundary>
    </PageLayout>
  )
}
