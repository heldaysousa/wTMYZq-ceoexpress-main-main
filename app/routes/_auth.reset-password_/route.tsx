import { Api } from '@/core/trpc'
import { AppHeader } from '@/designSystem/ui/AppHeader'
import { useNavigate } from '@remix-run/react'
import { Alert, Button, Flex, Form, Input, message, Typography } from 'antd'
import { useState } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'

const { Text } = Typography

export default function ResetPasswordPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [email, setEmail] = useState<string>()

  const [form] = Form.useForm()

  const {
    mutateAsync: resetPassword,
    isLoading,
    isSuccess,
  } = Api.authentication.sendResetPasswordEmail.useMutation()

  const handleSubmit = async (values: any) => {
    try {
      setEmail(values.email)

      await resetPassword({ email: values.email })
    } catch (error) {
      message.error(t('resetPassword.error'))
    }
  }

  return (
    <Flex align="center" justify="center" vertical flex={1}>
      <Flex
        vertical
        style={{
          width: '340px',
          paddingBottom: '100px',
          paddingTop: '100px',
        }}
        gap="middle"
      >
        <AppHeader description={t('resetPassword.description')} />

        {isSuccess && (
          <Alert
            style={{ textAlign: 'center' }}
            message={t('resetPassword.success', { email })}
            type="success"
          />
        )}

        {!isSuccess && (
          <>
            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              requiredMark={false}
            >
              <Form.Item
                label={t('resetPassword.email')}
                name="email"
                rules={[{ required: true, message: t('resetPassword.emailRequired') }]}
              >
                <Input
                  type="email"
                  placeholder="Your email"
                  autoComplete="email"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  block
                >
                  {t('resetPassword.button')}
                </Button>
              </Form.Item>
            </Form>
          </>
        )}

        <Flex justify="center" align="center">
          <Button
            ghost
            style={{ border: 'none' }}
            onClick={() => navigate('/login')}
          >
            <Flex gap={'small'} justify="center">
              <Text>{t('auth.signIn')}</Text>
            </Flex>
          </Button>

          <Text type="secondary">{t('auth.or')}</Text>

          <Button
            ghost
            style={{ border: 'none' }}
            onClick={() => navigate('/register')}
          >
            <Flex gap={'small'} justify="center">
              <Text>{t('auth.signUp')}</Text>
            </Flex>
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}
