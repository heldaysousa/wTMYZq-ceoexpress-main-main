import { useUserContext } from '@/core/context'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'
import { ErrorBoundary } from '@/core/components/ErrorBoundary'
import {
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  Modal,
  Row,
  Select,
  Statistic,
  Table,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
const { Title, Text } = Typography
const { Option } = Select

interface TransactionFormValues {
  amount: number
  type: 'INCOME' | 'EXPENSE'
  category: string
}

export default function FinancialManagementPage() {
  const { t } = useTranslation()
  const { user } = useUserContext()
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState(dayjs())

  const totals = useMemo(() => {
    try {
      let income = 0
      let expenses = 0
      transactions?.forEach(transaction => {
        const amount = parseFloat(transaction.amount?.toString() ?? '0')
        if (!Number.isFinite(amount)) return
        
        if (transaction.type === 'INCOME') {
          income += amount
        } else {
          expenses += amount
        }
      })
      return { income, expenses, balance: income - expenses }
    } catch (error) {
      console.error('Error calculating totals:', error)
      notification.error({
        message: t('finances.error.calculation'),
        description: error.message
      })
      return { income: 0, expenses: 0, balance: 0 }
    }
  }, [transactions])

  // Queries with retry and error handling
  const { data: transactions, refetch, isLoading } = Api.transaction.findMany.useQuery({
    where: { userId: user?.id },
    orderBy: { createdAt: 'desc' },
  }, {
    retry: 3,
    onError: (error) => {
      notification.error({
        message: t('finances.error.loading'),
        description: error.message
      });
    }
  })

  // Mutations with loading state
  const { mutateAsync: createTransaction, isLoading: isCreating } =
    Api.transaction.create.useMutation({
      onError: (error) => {
        notification.error({
          message: t('finances.error.create'),
          description: error.message
        });
      }
    })

  const handleAddTransaction = async (values: TransactionFormValues) => {
    try {
      const amount = parseFloat(values.amount.toString());
      if (!Number.isFinite(amount)) {
        throw new Error(t('finances.error.invalidAmount'));
      }
      
      await createTransaction({
        data: {
          amount,
          type: values.type,
          category: values.category,
          date: dayjs().format('YYYY-MM-DD'),
          userId: user?.id,
        },
      })
      form.resetFields()
      setIsModalVisible(false)
      refetch()
      notification.success({
        message: t('finances.success.create')
      });
    } catch (error) {
      console.error('Error creating transaction:', error)
      notification.error({
        message: t('finances.error.create'),
        description: error.message
      });
    }
  }

  const columns = [
    {
      title: t('finances.table.date'),
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: t('finances.table.type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Text type={type === 'INCOME' ? 'success' : 'danger'}>
          <i
            className={`las ${
              type === 'INCOME' ? 'la-arrow-up' : 'la-arrow-down'
            }`}
          ></i>{' '}
          {t(`finances.type.${type.toLowerCase()}`)}
        </Text>
      ),
    },
    {
      title: t('finances.table.category'),
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => t(`finances.category.${category.toLowerCase()}`),
    },
    {
      title: t('finances.table.amount'),
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: string) => (
        <Text>
          {(amount ?? 0).toLocaleString('en-US', {
            style: 'currency',
            currency: 'BRL',
          })}
        </Text>
      ),
    },
  ]


  return (
    <PageLayout layout="full-width">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        <Title level={2}>
          <i className="las la-wallet"></i> {t('finances.title')}
        </Title>
        <Text>{t('finances.description')}</Text>

        <ErrorBoundary
          fallback={
            <Typography.Text type="danger">
              {t('finances.error.statistics')}
            </Typography.Text>
          }
        >
        <Row gutter={16} style={{ marginTop: 24, marginBottom: 24 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title={t('finances.totalIncome')}
                value={totals.income}
                precision={2}
                prefix={<i className="las la-arrow-up"></i>}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title={t('finances.totalExpenses')}
                value={totals.expenses}
                precision={2}
                prefix={<i className="las la-arrow-down"></i>}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title={t('finances.balance')}
                value={totals.balance}
                precision={2}
                prefix={<i className="las la-balance-scale"></i>}
                valueStyle={{
                  color: totals.balance >= 0 ? '#3f8600' : '#cf1322',
                }}
              />
            </Card>
          </Col>
        </Row>
        </ErrorBoundary>

        <Card
          title={
            <span>
              <i className="las la-list"></i> {t('finances.transactions')}
            </span>
          }
          extra={
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
              <i className="las la-plus"></i> {t('finances.form.button.add')}
            </Button>
          }
        >
          <Table 
            columns={columns} 
            dataSource={transactions} 
            rowKey="id"
            loading={isLoading} 
          />
        </Card>

        <Modal
          title={t('finances.modal.title')}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleAddTransaction} layout="vertical">
            <Form.Item
              name="type"
              label={t('finances.form.type.label')}
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="INCOME">{t('finances.type.income')}</Option>
                <Option value="EXPENSE">{t('finances.type.expense')}</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="category"
              label={t('finances.form.category.label')}
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="SALES">{t('finances.category.sales')}</Option>
                <Option value="SERVICES">
                  {t('finances.category.services')}
                </Option>
                <Option value="SUPPLIES">
                  {t('finances.category.supplies')}
                </Option>
                <Option value="UTILITIES">
                  {t('finances.category.utilities')}
                </Option>
                <Option value="OTHER">{t('finances.category.other')}</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="amount" 
              label={t('finances.form.amount.label')}
              rules={[
                { required: true },
                {
                  validator: async (_, value) => {
                    const amount = parseFloat(value?.toString() ?? '')
                    if (!Number.isFinite(amount) || amount <= 0) {
                      throw new Error(t('finance.validation.amount'))
                    }
                  }
                }
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={value =>
                  `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={value => value!.replace(/R\$\s?|(,*)/g, '')}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={isCreating}>
                {t('finances.form.button.add')}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PageLayout>
  )
}
