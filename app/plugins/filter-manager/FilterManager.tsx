import { FilterOutlined } from '@ant-design/icons'
import {
  Badge,
  Button,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Slider,
  Space,
} from 'antd'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { FilterManagerItem, FilterManagerValue } from './types'

interface FilterManagerProps {
  filters?: FilterManagerItem[]
  value?: FilterManagerValue
  onChange?: (value: FilterManagerValue) => void
  onSave?: (value: FilterManagerValue) => void
}

export const FilterManager: React.FC<FilterManagerProps> = ({
  filters = [],
  value = {},
  onSave,
  onChange,
}) => {
  const [filterForm] = Form.useForm()
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>(value)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const computeFilters = (values: any) => {
    const newFilters = Object.entries(values).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value
      }
      return acc
    }, {} as Record<string, any>)
    return newFilters
  }

  const handleFilterChange = _.debounce((values: any) => {
    const filters = computeFilters(values)
    setActiveFilters(filters)
    onChange?.(filters)
  }, 1000)

  const resetFilters = () => {
    setActiveFilters({})
    filterForm.resetFields()
    onChange?.({})
  }

  const saveFilters = async () => {
    const values = (await filterForm.validateFields()) as any
    const filters = computeFilters(values)
    setActiveFilters(filters)
    onSave?.(filters)
    setIsModalOpen(false)
  }

  useEffect(() => {
    if (!_.isEqual(value, activeFilters)) {
      setActiveFilters(value ?? {})
      filterForm.setFieldsValue(value ?? {})
    }
  }, [value])

  const activeFilterCount = Object.keys(activeFilters ?? {})?.length ?? 0

  const renderFilterComponent = (filter: FilterManagerItem) => {
    switch (filter.type) {
      case 'text':
        return (
          <Input placeholder={filter.label || `Filter by ${filter.property}`} />
        )
      case 'select':
        return (
          <Select
            placeholder={filter.label || `Filter by ${filter.property}`}
            options={filter.options}
            allowClear
          />
        )
      case 'multi-select':
        return (
          <Select
            mode="multiple"
            placeholder={filter.label || `Filter by ${filter.property}`}
            options={filter.options}
            allowClear
          />
        )
      case 'date':
        return <DatePicker placeholder={filter.label || `Select date`} />
      case 'range-date':
        return (
          <DatePicker.RangePicker placeholder={['Start date', 'End date']} />
        )
      case 'number':
        return (
          <InputNumber
            placeholder={filter.label || `Filter by ${filter.property}`}
            formatter={value =>
              filter.currency
                ? new Intl.NumberFormat(undefined, {
                    style: 'currency',
                    currency: filter.currency,
                  }).format(value as number)
                : new Intl.NumberFormat().format(value as number)
            }
            suffix={filter.currency}
          />
        )
      case 'range-number':
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Slider
              range
              min={filter.interval?.min}
              max={filter.interval?.max}
              step={filter.interval?.increment}
            />
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <span>
                {filter.currency
                  ? new Intl.NumberFormat(undefined, {
                      style: 'currency',
                      currency: filter.currency,
                    }).format(
                      activeFilters[filter.property]?.min ||
                        filter.interval?.min,
                    )
                  : new Intl.NumberFormat().format(
                      activeFilters[filter.property]?.min ||
                        filter.interval?.min,
                    )}
              </span>
              <span>
                {filter.currency
                  ? new Intl.NumberFormat(undefined, {
                      style: 'currency',
                      currency: filter.currency,
                    }).format(
                      activeFilters[filter.property]?.max ||
                        filter.interval?.max,
                    )
                  : new Intl.NumberFormat().format(
                      activeFilters[filter.property]?.max ||
                        filter.interval?.max,
                    )}
              </span>
            </Space>
          </Space>
        )
      default:
        return <></>
    }
  }

  return (
    <>
      <Badge count={activeFilterCount} color="black" size="small">
        <Button
          size="small"
          variant="outlined"
          color={activeFilterCount > 0 ? 'primary' : 'default'}
          onClick={() => setIsModalOpen(true)}
        >
          <FilterOutlined /> Filters
        </Button>
      </Badge>
      <Modal
        centered
        title="Filters"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={
          <>
            <Divider
              style={{
                marginTop: 0,
              }}
            />
            <Flex justify="space-between" style={{ padding: 0 }}>
              <Button type="text" onClick={() => resetFilters()}>
                Clear
              </Button>
              <Button type="primary" onClick={() => saveFilters()}>
                Save
              </Button>
            </Flex>
          </>
        }
        styles={{
          body: { maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' },
          footer: {
            padding: 0,
            margin: 0,
          },
        }}
      >
        <Form
          form={filterForm}
          layout="horizontal"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 19 }}
          colon={false}
          variant={'borderless'}
          labelAlign={'left'}
          onValuesChange={(_, allValues) => handleFilterChange(allValues)}
          style={{ marginBottom: 20, paddingRight: 20 }}
        >
          {filters.map(filter => (
            <Form.Item
              key={filter.property}
              name={filter.property}
              label={filter.label || filter.property}
            >
              {renderFilterComponent(filter)}
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </>
  )
}
