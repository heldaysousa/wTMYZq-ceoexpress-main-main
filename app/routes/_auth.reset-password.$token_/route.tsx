import { Api } from '@/core/trpc'
import { AppHeader } from '@/designSystem'
import { useNavigate, useParams } from '@remix-run/react'
import { Alert, Button, Flex, Form, Input, message, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

const { Text } = Typography

export default function ResetPasswordTokenPage() {
  const router = useNavigate()

  const { token } = useParams<{ token: string }>()

  const [form] = Form.useForm()

  const {
    mutateAsync: resetPassword,
    isLoading,
    isSuccess,
  } = Api.authentication.resetPassword.useMutation()

  const { t } = useTranslation()

  const handleSubmit = async (values: any) => {
    try {
      await resetPassword({ token, password: values.password })
    } catch (error) {
      message.error(t('resetPassword.error.reset'))
    }
  }

  return (
    <>
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
          <AppHeader description={t('resetPassword.changePassword')} />

          {isSuccess && (
            <Alert
              style={{ textAlign: 'center' }}
              type="success"
              message={t('resetPassword.success.changed')}
            />
          )}

          {!isSuccess && (
            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              requiredMark={false}
            >
              <Form.Item
                label={t('resetPassword.password')}
                name="password"
                rules={[
                  {
                    required: true,
                    message: t('resetPassword.passwordRequired'),
                  },
                ]}
              >
                <Input.Password
                  type="password"
                  placeholder={t('resetPassword.passwordPlaceholder')}
                  autoComplete="current-password"
                />
              </Form.Item>

              <Form.Item
                label={t('resetPassword.passwordConfirmation')}
                name="passwordConfirmation"
                rules={[
                  {
                    required: true,
                    message: t('resetPassword.passwordConfirmationRequired'),
                  },
                ]}
              >
                <Input.Password
                  type="password"
                  placeholder={t(
                    'resetPassword.passwordConfirmationPlaceholder',
                  )}
                  autoComplete="current-password"
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
          )}

          <Flex justify="center" align="center">
            <Button
              ghost
              style={{ border: 'none' }}
              onClick={() => router('/login')}
            >
              <Flex gap={'small'} justify="center">
                <Text>{t('auth.signIn')}</Text>
              </Flex>
            </Button>

            <Text type="secondary">{t('auth.or')}</Text>

            <Button
              ghost
              style={{ border: 'none' }}
              onClick={() => router('/register')}
            >
              <Flex gap={'small'} justify="center">
                <Text>{t('auth.signUp')}</Text>
              </Flex>
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}
