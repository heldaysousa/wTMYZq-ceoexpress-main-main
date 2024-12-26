import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'
import { ErrorBoundary } from '@/designSystem/core/ErrorBoundary'
import {
  Button,
  Calendar,
  DatePicker,
  Form,
  message,
  Modal,
  Select,
  Skeleton,
  Typography,
  notification,
} from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
const { Title, Text } = Typography

interface AppointmentFormValues {
  startTime: string
  clientId: string
  serviceId: string
}

export default function CalendarPage() {
  const { t } = useTranslation()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Dayjs>()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  
  // Cleanup subscriptions and states on unmount
  useEffect(() => {
    const abortController = new AbortController()
    const cleanupTimeouts: NodeJS.Timeout[] = []
    
    return () => {
      abortController.abort()
      cleanupTimeouts.forEach(timeout => clearTimeout(timeout))
      notification.destroy()
      message.destroy()
      setIsModalVisible(false)
      setSelectedDate(undefined)
      setLoading(false)
      form.resetFields()
    }
  }, [form])
  // Fetch appointments with retry
  const {
    data: appointments,
    refetch,
    isLoading: isLoadingAppointments,
  } = Api.appointment.findMany.useQuery(
    {
      include: {
        client: true,
        service: true,
      },
    },
    {
      retry: 3,
      onError: error => {
        console.error('Error fetching appointments:', error)
        message.error(t('submenu.calendar.error.load'))
      },
    },
  )

  // Fetch clients for the form with retry
  const { data: clients, isLoading: isLoadingClients } =
    Api.client.findMany.useQuery(
      {},
      {
        retry: 3,
        onError: error => {
          console.error('Error fetching clients:', error)
          message.error(t('submenu.calendar.error.loadClients'))
        },
      },
    )

  // Fetch services for the form with retry
  const { data: services, isLoading: isLoadingServices } =
    Api.service.findMany.useQuery(
      {},
      {
        retry: 3,
        onError: error => {
          console.error('Error fetching services:', error)
          message.error(t('submenu.calendar.error.loadServices'))
        },
      },
    )

  // Create appointment mutation
  const { mutateAsync: createAppointment } =
    Api.appointment.create.useMutation()

  // Update appointment mutation with retry and loading state
  const { mutateAsync: updateAppointment, isLoading: isUpdating } =
    Api.appointment.update.useMutation({
      retry: 3,
      onError: (error) => {
        console.error('Error updating appointment:', error)
        notification.error({
          message: t('submenu.calendar.error.update'),
          description: error.message
        })
      }
    })

  const handleDateSelect = (date: Dayjs) => {
    if (!dayjs(date).isValid()) {
      message.error(t('submenu.calendar.error.invalidDate'))
      return
    }
    if (dayjs(date).isBefore(dayjs(), 'day')) {
      message.error(t('submenu.calendar.error.pastDate'))
      return
    }
    setSelectedDate(date)
    setIsModalVisible(true)
  }

  const validateAppointmentTime = (startTime: string, appointments: any[]) => {
    const newStart = dayjs(startTime)
    const newEnd = newStart.add(2, 'hour')

    return !appointments?.some(app => {
      const existingStart = dayjs(app.startTime)
      const existingEnd = dayjs(app.endTime)
      return (
        (newStart.isAfter(existingStart) && newStart.isBefore(existingEnd)) ||
        (newEnd.isAfter(existingStart) && newEnd.isBefore(existingEnd)) ||
        (newStart.isSame(existingStart) || newEnd.isSame(existingEnd))
      )
    })
  }

  const handleCreateAppointment = async (values: AppointmentFormValues) => {
    if (!dayjs(values.startTime).isValid()) {
      notification.error({
        message: t('calendar.validation.time'),
        description: t('submenu.calendar.error.invalidStartTime')
      })
      return
    }

    if (dayjs(values.startTime).isBefore(dayjs(), 'minute')) {
      notification.error({
        message: t('calendar.validation.date'),
        description: t('submenu.calendar.error.pastDate')
      })
      return
    }

    if (!validateAppointmentTime(values.startTime, appointments)) {
      notification.error({
        message: t('calendar.validation.time'),
        description: t('submenu.calendar.error.overlap')
      })
      return
    }

    try {
      setLoading(true)
      await createAppointment(
        {
          data: {
            startTime: dayjs(values.startTime).toISOString(),
            endTime: dayjs(values.startTime).add(2, 'hour').toISOString(),
            status: 'SCHEDULED',
            clientId: values.clientId,
            serviceId: values.serviceId,
          },
        },
        {
          retry: 3,
        },
      )
      notification.success({
        message: t('submenu.calendar.success.create'),
        description: t('submenu.calendar.success.createDescription')
      })
      setIsModalVisible(false)
      form.resetFields()
      refetch()
    } catch (error) {
      console.error('Calendar creation error:', error)
      notification.error({
        message: t('submenu.calendar.error.create'),
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (
    appointmentId: string,
    newStatus: string,
  ) => {
    if (!appointmentId || !newStatus) {
      notification.error({
        message: t('submenu.calendar.error.invalidStatus'),
        description: t('submenu.calendar.error.invalidStatusDescription')
      })
      return
    }

    try {
      await updateAppointment({
        where: { id: appointmentId },
        data: { status: newStatus },
      })
      notification.success({
        message: t('submenu.calendar.success.update'),
        description: t('submenu.calendar.success.updateDescription')
      })
      refetch()
    } catch (error) {
      console.error('Error updating appointment status:', error)
      notification.error({
        message: t('submenu.calendar.error.update'),
        description: error.message
      })
    }
  }

  const dateCellRender = (date: Dayjs) => {
    if (!dayjs(date).isValid() || !appointments) {
      return null
    }

    // Validate appointment data before rendering
    const validateAppointment = (app: any) => {
      try {
        return Boolean(
          app?.id &&
          app?.startTime &&
          dayjs(app.startTime).isValid() &&
          app?.client?.id &&
          app?.client?.name &&
          app?.status &&
          ['SCHEDULED', 'CONFIRMED', 'CANCELLED'].includes(app.status)
        )
      } catch (error) {
        console.error('Invalid appointment data:', error, app)
        return false
      }
    }

    const dayAppointments = appointments.filter(app => {
      const startTime = dayjs(app.startTime)
      return (
        startTime.isValid() &&
        startTime.format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
      )
    })

    return (
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {dayAppointments?.filter(validateAppointment).map(app => (
          <li key={app.id} style={{ marginBottom: '4px' }}>
            <div
              style={{
                padding: '2px 4px',
                backgroundColor:
                  app.status === 'CONFIRMED'
                    ? '#e6f7ff'
                    : app.status === 'CANCELLED'
                    ? '#fff1f0'
                    : '#f6ffed',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            >
              <i className="las la-clock"></i>
              <Text style={{ marginLeft: '4px' }}>
                {dayjs(app.startTime).format('YYYY-MM-DD HH:mm')} -{' '}
                {app.client?.name}
              </Text>
              <Select
                size="small"
                style={{ marginLeft: '4px' }}
                defaultValue={app.status}
                onChange={value => handleStatusChange(app.id, value)}
              >
                <Select.Option value="SCHEDULED">
                  <i className="las la-calendar"></i>{' '}
                  {t('submenu.calendar.view')}
                </Select.Option>
                <Select.Option value="CONFIRMED">
                  <i className="las la-check"></i> {t('submenu.calendar.edit')}
                </Select.Option>
                <Select.Option value="CANCELLED">
                  <i className="las la-times"></i>{' '}
                  {t('submenu.calendar.cancel')}
                </Select.Option>
              </Select>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <PageLayout layout="full-width">
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={2}>
          <i className="las la-calendar"></i> {t('submenu.calendar.title')}
        </Title>
        <Text>{t('submenu.calendar.subtitle')}</Text>

        <ErrorBoundary
          fallback={
            <div className="p-4">
              <Typography.Text type="danger">
                {t('calendar.error.loading')}
              </Typography.Text>
              <Button onClick={() => refetch()} loading={isLoadingAppointments}>
                {t('common.retry')}
              </Button>
            </div>
          }
        >
          <div style={{ marginTop: '24px' }}>
            {isLoadingAppointments || isUpdating ? (
              <Skeleton active />
            ) : (
              <Calendar
                onSelect={handleDateSelect}
                cellRender={dateCellRender}
                loading={isLoadingAppointments || isUpdating}
              />
            )}
          </div>
        </ErrorBoundary>

        <Modal
          title={t('botao.submenu.calendar.create')}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            onFinish={handleCreateAppointment}
            layout="vertical"
          >
            <Form.Item
              name="clientId"
              label={t('submenu.calendar.form.client')}
              rules={[{ required: true }]}
            >
              <Select
                placeholder={t('submenu.calendar.form.selectClient')}
                loading={isLoadingClients}
              >
                {clients?.map(client => (
                  <Select.Option key={client.id} value={client.id}>
                    {client.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="serviceId"
              label={t('submenu.calendar.form.service')}
              rules={[{ required: true }]}
            >
              <Select
                placeholder={t('submenu.calendar.form.selectService')}
                loading={isLoadingServices}
              >
                {services?.map(service => (
                  <Select.Option key={service.id} value={service.id}>
                    {service.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="startTime"
              label={t('submenu.calendar.form.startTime')}
              initialValue={selectedDate}
              rules={[
                {
                  required: true,
                  type: 'date',
                  message: t('submenu.calendar.form.dateRequired'),
                },
              ]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                {t('botao.submenu.calendar.create')}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PageLayout>
  )
}
