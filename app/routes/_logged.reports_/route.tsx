import {
  Card,
  Row,
  Col,
  Typography,
  Select,
  DatePicker,
  Table,
  Statistic,
  Skeleton,
  notification,
} from 'antd'
import { ErrorBoundary } from '@/core/components/ErrorBoundary'
import { useTranslation } from 'react-i18next'
import { Line } from '@ant-design/charts'
import { useState } from 'react'
const { Title, Text } = Typography
const { RangePicker } = DatePicker
import { useUserContext } from '@/core/context'
import dayjs from 'dayjs'
import { useLocation, useNavigate, useParams } from '@remix-run/react'
import { useUploadPublic } from '@/plugins/upload/client'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'

export default function RelatrioseAnlisesPage() {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'days'),
    dayjs(),
  ])
  const [reportType, setReportType] = useState<'financial' | 'appointments'>(
    'financial',
  )

  const { t } = useTranslation()

  // Fetch transactions for financial data with retry
  const { data: transactions, isLoading: isLoadingTransactions, refetch: refetchTransactions } = Api.transaction.findMany.useQuery({
    where: {
      date: {
        gte: dateRange[0].format('YYYY-MM-DD'),
        lte: dateRange[1].format('YYYY-MM-DD'),
      },
    },
  }, {
    retry: 3,
    onError: (error) => {
      console.error('Error fetching transactions:', error)
      notification.error({
        message: t('revenue.error.dataLoad'),
        description: error.message
      })
    }
  })

  // Fetch appointments for scheduling data with retry
  const { data: appointments, isLoading: isLoadingAppointments, refetch: refetchAppointments } = Api.appointment.findMany.useQuery({
    where: {
      startTime: {
        gte: dateRange[0].format('YYYY-MM-DD'),
        lte: dateRange[1].format('YYYY-MM-DD'),
      },
    },
    include: {
      service: true,
      client: true,
    },
  }, {
    retry: 3,
    onError: (error) => {
      console.error('Error fetching appointments:', error)
      notification.error({
        message: t('dashboard.error.loading'),
        description: error.message
      })
    }
  })

  // Calculate financial metrics with validation
  const totalRevenue = useMemo(() => {
    try {
      return transactions?.reduce((sum, t) => {
        if (t.type !== 'INCOME' || !t.amount) return sum
        const amount = parseFloat(t.amount.toString())
        if (!Number.isFinite(amount)) return sum
        return sum + amount
      }, 0) || 0
    } catch (error) {
      console.error('Error calculating revenue:', error)
      notification.error({
        message: t('revenue.error.calculation'),
        description: error.message
      })
      return 0
    }
  }, [transactions])

  const totalExpenses = useMemo(() => {
    try {
      return transactions?.reduce((sum, t) => {
        if (t.type !== 'EXPENSE' || !t.amount) return sum
        const amount = parseFloat(t.amount.toString())
        if (!Number.isFinite(amount)) return sum
        return sum + amount
      }, 0) || 0
    } catch (error) {
      console.error('Error calculating expenses:', error)
      notification.error({
        message: t('revenue.error.calculation'),
        description: error.message
      })
      return 0
    }
  }, [transactions])

  // Prepare data for financial chart
  const financialChartData = transactions?.map(t => ({
    date: dayjs(t.date).format('DD/MM/YYYY'),
    value: t.amount || 0,
    type: t.type,
  }))

  // Prepare data for appointments chart
  const appointmentChartData = appointments?.map(a => ({
    date: dayjs(a.startTime).format('DD/MM/YYYY'),
    value: 1,
    service: a.service?.name,
  }))

  const columns =
    reportType === 'financial'
      ? [
          {
            title: 'Data',
            dataIndex: 'date',
            key: 'date',
          },
          {
            title: 'Tipo',
            dataIndex: 'type',
            key: 'type',
          },
          {
            title: 'Categoria',
            dataIndex: 'category',
            key: 'category',
          },
          {
            title: 'Valor',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: string) => `R$ ${amount}`,
          },
        ]
      : [
          {
            title: 'Data',
            dataIndex: 'startTime',
            key: 'startTime',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
          },
          {
            title: 'Cliente',
            dataIndex: ['client', 'name'],
            key: 'clientName',
          },
          {
            title: 'Serviço',
            dataIndex: ['service', 'name'],
            key: 'serviceName',
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
          },
        ]

  return (
    <PageLayout layout="full-width">
      <div style={{ padding: '24px' }}>
        <Title level={2}>
          <i className="las la-chart-bar" style={{ marginRight: '8px' }}></i>
          Relatórios e Análises
        </Title>
        <Text>
          Visualize e analise o desempenho do seu negócio através de relatórios
          detalhados
        </Text>

        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col span={24}>
            <Card>
              <Row gutter={16}>
                <Col span={8}>
                  <Select
                    style={{ width: '100%' }}
                    value={reportType}
                    onChange={setReportType}
                    options={[
                      { label: 'Relatório Financeiro', value: 'financial' },
                      {
                        label: 'Relatório de Agendamentos',
                        value: 'appointments',
                      },
                    ]}
                  />
                </Col>
                <Col span={8}>
                  <RangePicker
                    value={dateRange}
                    onChange={dates => dates && setDateRange(dates)}
                    style={{ width: '100%' }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          {reportType === 'financial' && (
            <>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Receita Total"
                    value={totalRevenue}
                    prefix="R$"
                    precision={2}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Despesas Totais"
                    value={totalExpenses}
                    prefix="R$"
                    precision={2}
                    valueStyle={{ color: '#cf1322' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Lucro Líquido"
                    value={totalRevenue - totalExpenses}
                    prefix="R$"
                    precision={2}
                    valueStyle={{
                      color:
                        totalRevenue - totalExpenses >= 0
                          ? '#3f8600'
                          : '#cf1322',
                    }}
                  />
                </Card>
              </Col>
            </>
          )}

          <Col span={24}>
            <ErrorBoundary>
              <Card>
                {isLoadingTransactions || isLoadingAppointments ? (
                  <Skeleton active />
                ) : (
                  <Line
                    data={
                      reportType === 'financial'
                        ? financialChartData || []
                        : appointmentChartData || []
                    }
                    xField="date"
                    yField="value"
                    seriesField={reportType === 'financial' ? 'type' : 'service'}
                  />
                )}
              </Card>
            </ErrorBoundary>
          </Col>

          <Col span={24}>
            <ErrorBoundary>
              <Card>
                <Table
                  loading={isLoadingTransactions || isLoadingAppointments}
                  dataSource={
                    (reportType === 'financial' ? transactions : appointments) as any[]
                  }
                  columns={columns}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            </ErrorBoundary>
          </Col>
        </Row>
      </div>
    </PageLayout>
  )
}
