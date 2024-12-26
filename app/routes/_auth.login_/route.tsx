import { Api } from '@/core/trpc'
import { AppHeader } from '@/designSystem/ui/AppHeader'
import { useNavigate, useSearchParams } from '@remix-run/react'
import { Button, Flex, Form, Input, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthenticationClient } from '~/core/authentication/client'

export default function LoginPage() {
  const router = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [isLoading, setLoading] = useState(false)

  const { mutateAsync: login } = Api.authentication.login.useMutation({
    onSuccess: data => {
      if (data.redirect) {
        window.location.href = data.redirect
      }
    },
  })

  const errorKey = searchParams.get('error')

  const errorMessage = {
    Signin: t('login.errors.default'),
    OAuthSignin: t('login.errors.default'),
    OAuthCallback: t('login.errors.default'),
    OAuthCreateAccount: t('login.errors.default'),
    EmailCreateAccount: t('login.errors.default'),
    Callback: t('login.errors.default'),
    OAuthAccountNotLinked: t('login.errors.default'),
    EmailSignin: t('login.errors.email'),
    CredentialsSignin: t('login.errors.credentials'),
    default: t('login.errors.default'),
  }[errorKey ?? 'default']

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      form.setFieldValue('email', 'test@test.com')
      form.setFieldValue('password', 'password')
    }
  }, [])

  const handleSubmit = async (values: any) => {
    setLoading(true)

    try {
      await login({ email: values.email, password: values.password })
    } catch (error) {
      console.error(`Could not login: ${error.message}`, { variant: 'error' })

      setLoading(false)
    }
  }

  return (
    <Flex align="center" justify="center" vertical flex={1}>
      <Flex
        vertical
        style={{
          width: '340px',
          paddingBottom: '50px',
          paddingTop: '50px',
        }}
        gap="middle"
      >
        <AppHeader description={t('login.welcome')} />

        {errorKey && (
          <Typography.Text type="danger">{errorMessage}</Typography.Text>
        )}

        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            label={t('login.email')}
            name="email"
            rules={[{ required: true, message: t('login.emailRequired') }]}
          >
            <Input type="email" placeholder={t('login.emailPlaceholder')} autoComplete="email" />
          </Form.Item>

          <Form.Item
            label={t('login.password')}
            name="password"
            rules={[{ required: true, message: t('login.passwordRequired') }]}
          >
            <Input.Password
              type="password"
              placeholder={t('login.passwordPlaceholder')}
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Flex justify="end">
              <Button
                type="link"
                onClick={() => router('/reset-password')}
                style={{ padding: 0, margin: 0 }}
              >
                {t('login.forgotPassword')}
              </Button>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isLoading}>
              {t('login.signIn')}
            </Button>
          </Form.Item>
        </Form>

        <AuthenticationClient.SocialButtons />

        <Button
          ghost
          style={{ border: 'none' }}
          onClick={() => router('/register')}
        >
          <Flex gap={'small'} justify="center">
            <Typography.Text type="secondary">{t('login.noAccount')}</Typography.Text>{' '}
            <Typography.Text>{t('login.signUp')}</Typography.Text>
          </Flex>
        </Button>
      </Flex>
    </Flex>
  )
}
