import {
  DeleteOutlined,
  EditOutlined,
  ExpandAltOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Skeleton,
  Typography,
  notification,
} from 'antd'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { ErrorBoundary } from '~/designSystem'
import { FilterManager } from '~/plugins/filter-manager'
import { ChartConfig, ChartConfigValue } from '../types'
import { DashboardChart } from './DashboardChart'
import { filterChartData } from './internal/filterChartData'

interface Props {
  chartConfigs: ChartConfig[]
  value: ChartConfigValue[]
  onChange?: (value: ChartConfigValue[]) => void
  isEditable?: boolean
  isLoading?: boolean
  loadingFallback?: React.ReactNode
  onRetry?: () => void
  retryCount?: number
}

export const DashboardGrid: React.FC<Props> = ({
  onChange,
  chartConfigs,
  value,
  isEditable = true,
  isLoading = false,
  loadingFallback = <Skeleton active />,
  onRetry,
  retryCount = 3,
}) => {
  const [charts, setCharts] = useState<ChartConfig[]>(chartConfigs)
  const [displayEdit, setDisplayEdit] = useState<string>(null)
  const [chartsValues, setChartsValues] = useState<ChartConfigValue[]>(value)
  const [isModalAddEditVisible, setIsModalAddEditVisible] = useState(false)
  const [editingChart, setEditingChart] = useState<ChartConfigValue | null>(
    null,
  )
  const [largerChart, setLargerChart] = useState<ChartConfigValue | null>(null)
  const [editChartForm] = Form.useForm()
  const dataSetValue = Form.useWatch('dataSet', editChartForm)

  const handleAddChart = (values: any) => {
    const newChart: ChartConfigValue = {
      id: Date.now().toString(),
      dataSet: values.dataSet ?? null,
      type: values.type ?? null,
      title: values.title ?? null,
      groupBy: values.groupBy ?? null,
      filtersValue: values.filtersValue ?? null,
    }
    onChange?.([...chartsValues, newChart])
    setChartsValues([...chartsValues, newChart])

    setIsModalAddEditVisible(false)
    editChartForm.resetFields()
  }

  const handleEditChart = (values: any) => {
    const updatedCharts = chartsValues.map(chart =>
      chart.id === editingChart?.id
        ? {
            ...chart,
            title: values.title ?? null,
            type: values.type ?? null,
            groupBy: values.groupBy ?? null,
            filtersValue: values.filtersValue ?? null,
          }
        : chart,
    )

    setChartsValues(updatedCharts)
    onChange?.(updatedCharts)
    setIsModalAddEditVisible(false)
    setEditingChart(null)
    editChartForm.resetFields()
  }

  const handleRemoveChart = (chartId: string) => {
    const updatedCharts = chartsValues.filter(chart => chart.id !== chartId)
    setChartsValues(updatedCharts)
    onChange?.(updatedCharts)
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(chartsValues)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setChartsValues(items)
    onChange?.(items)
  }

  useEffect(() => {
    if (!_.isEqual(chartConfigs, charts) || !_.isEqual(value, chartsValues)) {
      setCharts(chartConfigs ?? [])
      setChartsValues(value ?? [])
    }

    // Cleanup chart instances on unmount
    return () => {
      chartsValues?.forEach(chart => {
        if (chart.id) {
          try {
            const chartInstance = document.querySelector(`#chart-${chart.id}`)
            if (chartInstance) {
              // Remove chart instance and cleanup any event listeners
              chartInstance.remove()
              window[`chart_${chart.id}`]?.dispose?.()
              delete window[`chart_${chart.id}`]
            }
          } catch (error) {
            console.error('Error cleaning up chart:', error)
          }
        }
      })
    }
  }, [chartConfigs, value, chartsValues])

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Button size="small" onClick={() => setIsModalAddEditVisible(true)}>
          Add Chart
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="charts">
          {provided => (
            <Row
              gutter={[16, 16]}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {chartsValues?.map((chart, index) => (
                <Draggable
                  isDragDisabled={!isEditable}
                  key={chart.id}
                  draggableId={chart.id}
                  index={index}
                >
                  {provided => (
                    <Col
                      xs={24}
                      sm={12}
                      lg={12}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Card
                        onMouseEnter={() => setDisplayEdit(chart.id)}
                        onMouseLeave={() => setDisplayEdit(null)}
                      >
                        <Flex justify="space-between">
                          <Typography.Title level={4}>
                            {chart.title}
                          </Typography.Title>
                          {isEditable && displayEdit === chart.id && (
                            <Flex gap={2}>
                              <Button
                                type="text"
                                size="small"
                                onClick={e => {
                                  e.stopPropagation()
                                  setLargerChart(chart)
                                }}
                              >
                                <ExpandAltOutlined />
                              </Button>
                              <Button
                                type="text"
                                size="small"
                                onClick={e => {
                                  e.stopPropagation()
                                  setEditingChart(chart)
                                  editChartForm.setFieldsValue(chart)
                                  setIsModalAddEditVisible(true)
                                }}
                              >
                                <EditOutlined />
                              </Button>
                              <Button
                                type="text"
                                size="small"
                                onClick={e => {
                                  e.stopPropagation()
                                  handleRemoveChart(chart.id)
                                }}
                              >
                                <DeleteOutlined />
                              </Button>
                            </Flex>
                          )}
                        </Flex>

                        <ErrorBoundary
                          fallback={
                            <div>
                              <Typography.Text type="danger">
                                Error loading chart
                              </Typography.Text>
                              <Button
                                onClick={() => {
                                  if (retryCount > 0) {
                                    onRetry?.()
                                  } else {
                                    notification.error({
                                      message: 'Max retries exceeded',
                                      description:
                                        'Please refresh the page to try again',
                                    })
                                  }
                                }}
                                loading={isLoading}
                              >
                                Retry ({retryCount} attempts remaining)
                              </Button>
                            </div>
                          }
                          onError={error => {
                            console.error('Chart error:', error)
                            notification.error({
                              message: 'Chart Error',
                              description: error.message,
                            })
                          }}
                        >
                          {isLoading ? (
                            loadingFallback
                          ) : (
                            <DashboardChart
                              type={chart.type}
                              data={(() => {
                                try {
                                  // Validate chart configuration
                                  if (!chart.type || !chart.dataSet) {
                                    throw new Error(
                                      'Invalid chart configuration',
                                    )
                                  }

                                  // Get and validate data
                                  const filteredData = filterChartData(
                                    chart,
                                    charts,
                                  )
                                  if (!Array.isArray(filteredData)) {
                                    throw new Error('Invalid chart data format')
                                  }

                                  // Validate data structure
                                  filteredData.forEach(item => {
                                    if (
                                      typeof item !== 'object' ||
                                      !('value' in item)
                                    ) {
                                      throw new Error('Invalid data structure')
                                    }
                                  })

                                  return filteredData
                                } catch (error) {
                                  console.error(
                                    'Chart data validation error:',
                                    error,
                                  )
                                  notification.error({
                                    message: 'Chart Error',
                                    description: `Failed to validate chart data: ${error.message}`,
                                  })
                                  return []
                                }
                              })()}
                              isLoading={isLoading}
                              onError={error => {
                                console.error('Chart render error:', error)
                                notification.error({
                                  message: 'Chart Error',
                                  description: error.message,
                                })
                              }}
                              onRetry={() => {
                                if (retryCount > 0) {
                                  onRetry?.()
                                }
                              }}
                              retryCount={retryCount}
                            />
                          )}
                        </ErrorBoundary>
                      </Card>
                    </Col>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Row>
          )}
        </Droppable>
      </DragDropContext>
      <Modal
        centered
        width="80%"
        title={largerChart?.title}
        footer={<></>}
        open={largerChart != null}
        onCancel={() => {
          setLargerChart(null)
        }}
      >
        <DashboardChart
          height={600}
          type={largerChart?.type}
          data={filterChartData(largerChart, charts)}
        />
      </Modal>
      <Modal
        title={editingChart ? 'Edit Chart' : 'Add New Chart'}
        open={isModalAddEditVisible}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsModalAddEditVisible(false)
              editChartForm.resetFields()
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => editChartForm.submit()}
          >
            {editingChart ? 'Save' : 'Add'}
          </Button>,
        ]}
        onCancel={() => {
          setIsModalAddEditVisible(false)
          editChartForm.resetFields()
        }}
      >
        <Form
          form={editChartForm}
          onFinish={editingChart ? handleEditChart : handleAddChart}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Chart Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dataSet"
            label="Data"
            initialValue={charts?.[0]?.dataSet}
            rules={[{ required: true, message: 'Please select a data type' }]}
          >
            <Select>
              {charts.map(chartConfig => (
                <Select.Option
                  key={chartConfig.dataSet}
                  value={chartConfig.dataSet}
                >
                  {chartConfig.dataSet}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="type"
            label="Chart Type"
            rules={[{ required: true, message: 'Please select a chart type' }]}
          >
            <Select>
              <Select.Option value="pie">Pie Chart</Select.Option>
              <Select.Option value="line">Line Chart</Select.Option>
              <Select.Option value="bar">Bar Chart</Select.Option>
              <Select.Option value="number">Number</Select.Option>
            </Select>
          </Form.Item>
          {dataSetValue &&
            (() => {
              const options =
                charts.find(item => item.dataSet === dataSetValue)?.groupBy ??
                []
              const filters =
                charts.find(item => item.dataSet === dataSetValue)?.filters ??
                []

              return (
                <>
                  <Form.Item name="groupBy" label="Group By">
                    <Select allowClear>
                      {options.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {filters?.length > 0 && (
                    <Form.Item name="filtersValue" label="Filters">
                      <FilterManager filters={filters} />
                    </Form.Item>
                  )}
                </>
              )
            })()}
        </Form>
      </Modal>
    </div>
  )
}
