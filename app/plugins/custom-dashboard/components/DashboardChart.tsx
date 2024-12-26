import { Alert, Card, Flex, Spin, theme, Typography } from 'antd'
import React from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
const { useToken } = theme

interface DashboardChartProps {
  type: 'pie' | 'line' | 'bar' | 'number'
  data: any[]
  isLoading?: boolean
  height?: number
}

export const DashboardChart: React.FC<DashboardChartProps> = ({
  type,
  data,
  height = 300,
  isLoading = false,
}) => {
  const CustomTooltip = ({ payload, label }) => {
    if (payload && payload.length) {
      const labelName = payload?.[0].payload?.name || payload?.[0].name || label
      return (
        <Card size="small">
          <Flex vertical>
            <Typography.Text type="secondary">
              {labelName?.toString()}
            </Typography.Text>
            <Typography.Text>{payload[0].value}</Typography.Text>
          </Flex>
        </Card>
      )
    }
    return null
  }

  const { token } = useToken()

  const chartData = data
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Alert
        message="No data available"
        description="There is no data to display for this chart"
        type="info"
      />
    )
  }

  const renderChart = () => {
    const data = chartData ?? []

    switch (type) {
      case 'pie':
        return (
          <div
            style={{
              width: '100%',
              height: height,
            }}
          >
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={height / 3 - 20}
                  outerRadius={height / 3}
                  stroke="transparent"
                />
                <Tooltip content={CustomTooltip} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              <CartesianGrid stroke={token.colorBorder} vertical={false} />
              <XAxis
                style={{ marginTop: '100px' }}
                axisLine={false}
                tickLine={false}
                dataKey="date"
                dy={15}
              />
              <YAxis dx={-5} axisLine={false} tickLine={false} />
              <Tooltip content={CustomTooltip} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={token.colorPrimary}
              />
            </LineChart>
          </ResponsiveContainer>
        )

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid stroke={token.colorBorder} vertical={false} />
              <XAxis
                style={{ marginTop: '100px' }}
                axisLine={true}
                tickLine={true}
                dataKey="name"
                dy={15}
              />
              <YAxis dx={-5} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                content={CustomTooltip}
              />
              <Bar dataKey="value" fill={token.colorPrimary} />
            </BarChart>
          </ResponsiveContainer>
        )

      case 'number': {
        const total = data?.length || 0
        return (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Typography.Title level={1}>{total.toString()}</Typography.Title>
          </div>
        )
      }
      default:
        return (
          <Alert
            message="Invalid chart type"
            description="The specified chart type is not supported"
            type="error"
          />
        )
    }
  }

  return <div style={{ width: '100%' }}>{renderChart()}</div>
}
