import { PageLayout } from '@/designSystem'
import { DashboardGrid } from '@/plugins/custom-dashboard'
import { ChartConfigValue } from '@/plugins/custom-dashboard/types'
import { Button, Form, InputNumber, Modal } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useUserContext } from '~/core/context'
import { Api } from '~/core/trpc'

export default function DashboardSettingsPage() {
  const { user, refetch } = useUserContext()
  const { mutateAsync: updateUser } = Api.user.update.useMutation()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  const { data: todayTransactions } = Api.transaction.findMany.useQuery({
    where: {
      date: {
        gte: dayjs().startOf('day').toDate(),
        lte: dayjs().endOf('day').toDate(),
      },
    },
  })

  const { data: monthlyTransactions } = Api.transaction.findMany.useQuery({
    where: {
      date: {
        gte: dayjs().startOf('month').toDate(),
        lte: dayjs().endOf('month').toDate(),
      },
    },
  })

  const { data: todayAppointments } = Api.appointment.findMany.useQuery({
    where: {
      startTime: {
        gte: dayjs().startOf('day').toDate(),
        lte: dayjs().endOf('day').toDate(),
      },
    },
  })

  const todayRevenue =
    todayTransactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0
  const monthlyRevenue = (monthlyTransactions as any[])?.map(t => ({
    date: dayjs(t.date).format('DD/MM'),
    value: t.amount || 0,
  }))
  const appointmentsCount = todayAppointments?.length || 0

  const monthlyGoals = (user?.customDashboard as any[])?.find(
    chart => chart.id === '4',
  )?.data || [
    { name: 'Week 1', value: 5000 },
    { name: 'Week 2', value: 6000 },
    { name: 'Week 3', value: 7000 },
    { name: 'Week 4', value: 8000 },
  ]

  const handleUpdateGoals = async (values: any) => {
    const updatedGoals = [
      { name: 'Week 1', value: values.week1 },
      { name: 'Week 2', value: values.week2 },
      { name: 'Week 3', value: values.week3 },
      { name: 'Week 4', value: values.week4 },
    ]

    const currentDashboard = user?.customDashboard || []
    const updatedDashboard = currentDashboard.map(chart =>
      chart.id === '4' ? { ...chart, data: updatedGoals } : chart,
    )

    await updateUser({
      where: { id: user?.id },
      data: {
        customDashboard: updatedDashboard,
      },
    })
    setIsModalVisible(false)
    refetch()
  }

  return (
    <PageLayout>
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: 16 }}
      >
        Set Monthly Goals
      </Button>

      <DashboardGrid
        chartConfigs={[
          {
            dataSet: 'TodayRevenue',
            data: [{ value: todayRevenue }],
          },
          {
            dataSet: 'MonthlyRevenue',
            data: monthlyRevenue,
          },
          {
            dataSet: 'AppointmentsCount',
            data: [{ value: appointmentsCount }],
          },
          {
            dataSet: 'MonthlyGoals',
            data: monthlyGoals,
          },
        ]}
        value={
          (user?.customDashboard as ChartConfigValue[]) || [
            {
              id: '1',
              dataSet: 'TodayRevenue',
              title: "Today's Revenue",
              type: 'number',
            },
            {
              id: '2',
              dataSet: 'MonthlyRevenue',
              title: 'Monthly Revenue',
              type: 'line',
            },
            {
              id: '3',
              dataSet: 'AppointmentsCount',
              title: "Today's Appointments",
              type: 'number',
            },
            {
              id: '4',
              dataSet: 'MonthlyGoals',
              title: 'Monthly Financial Goals',
              type: 'bar',
            },
          ]
        }
        onChange={async (values: ChartConfigValue[]) => {
          await updateUser({
            where: { id: user?.id },
            data: {
              customDashboard: values,
            },
          })
          refetch()
        }}
      />

      <Modal
        title="Set Monthly Financial Goals"
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form
          form={form}
          onFinish={handleUpdateGoals}
          initialValues={{
            week1: monthlyGoals[0]?.value,
            week2: monthlyGoals[1]?.value,
            week3: monthlyGoals[2]?.value,
            week4: monthlyGoals[3]?.value,
          }}
        >
          <Form.Item
            label="Week 1 Goal"
            name="week1"
            rules={[
              { required: true, message: 'Please input goal for week 1' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Week 2 Goal"
            name="week2"
            rules={[
              { required: true, message: 'Please input goal for week 2' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Week 3 Goal"
            name="week3"
            rules={[
              { required: true, message: 'Please input goal for week 3' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Week 4 Goal"
            name="week4"
            rules={[
              { required: true, message: 'Please input goal for week 4' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </PageLayout>
  )
}
