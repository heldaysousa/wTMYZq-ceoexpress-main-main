import { useNavigate } from '@remix-run/react'
import { Button, Card, Flex, Typography } from 'antd'
import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useUserContext } from '~/core/context'
import { Api } from '~/core/trpc'
import { DesignBox } from '~/plugins/designbox'

export const WelcomeCard = () => {
  const navigate = useNavigate()
  const { user } = useUserContext()

  const { data: transactions } = Api.transaction.findMany.useQuery({
    where: {
      userId: user?.id,
      date: {
        gte: dayjs().startOf('month').toDate(),
      },
    },
  })

  const { data: notifications } = Api.notification.findMany.useQuery({
    where: {
      userId: user?.id,
      isRead: false,
    },
  })

  const monthlyRevenue = useMemo(
    () => transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0,
    [transactions],
  )

  const unreadCount = notifications?.length || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card style={{ overflow: 'hidden' }}>
        <DesignBox.CardAirbnb
          title={
            <Flex align="center" justify="space-between">
              <DesignBox.UserAvatar
                pictureUrl={user?.pictureUrl}
                title={user?.name}
                subtitle="Welcome back!"
              />
              <DesignBox.TooltipBadge
                tooltipContent={`${unreadCount} unread notifications`}
              >
                <Button type="text" onClick={() => navigate('/notifications')}>
                  <i className="las la-bell" /> {unreadCount}
                </Button>
              </DesignBox.TooltipBadge>
            </Flex>
          }
          subtitle={
            <Typography.Text strong>
              Monthly Revenue: ${monthlyRevenue.toLocaleString()}
            </Typography.Text>
          }
          price={
            <Flex gap={8}>
              <Button
                type="primary"
                onClick={() => navigate('/appointments/new')}
              >
                New Appointment
              </Button>
              <Button onClick={() => navigate('/transactions/new')}>
                New Transaction
              </Button>
            </Flex>
          }
        />
      </Card>
    </motion.div>
  )
}
