import {
  Typography,
  Input,
  Card,
  Row,
  Col,
  Collapse,
  Button,
  message,
} from 'antd'
import { useState } from 'react'
const { Title, Text, Paragraph } = Typography
const { Search } = Input
const { Panel } = Collapse
import { useUserContext } from '@/core/context'
import dayjs from 'dayjs'
import { useLocation, useNavigate, useParams } from '@remix-run/react'
import { useUploadPublic } from '@/plugins/upload/client'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch help content
  const { data: helpContent, isLoading } = Api.helpContent.findMany.useQuery({
    where: {
      OR: [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { content: { contains: searchQuery, mode: 'insensitive' } },
      ],
    },
  })

  // Create support ticket
  const { mutateAsync: createTicket } = Api.helpContent.create.useMutation()

  // Filter content by type
  const faqs = helpContent?.filter(item => item.type === 'FAQ')
  const videos = helpContent?.filter(item => item.type === 'VIDEO')

  const handleContactSupport = async () => {
    try {
      await createTicket({
        data: {
          title: 'Support Request from Help Center',
          content: 'User requested support from help center',
          type: 'SUPPORT_TICKET'
        },
      })
      message.success('Support request sent successfully!')
    } catch (error) {
      message.error('Failed to send support request')
    }
  }

  return (
    <PageLayout layout="full-width">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        <Title level={2} style={{ textAlign: 'center' }}>
          <i className="las la-question-circle" /> Help Center
        </Title>
        <Paragraph style={{ textAlign: 'center', marginBottom: 40 }}>
          Find answers to your questions, watch tutorials, or contact our
          support team
        </Paragraph>

        <Search
          placeholder="Search help topics..."
          size="large"
          style={{ marginBottom: 40 }}
          onChange={e => setSearchQuery(e.target.value)}
        />

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card
              title={
                <>
                  <i className="las la-book" /> FAQ Sections
                </>
              }
              loading={isLoading}
            >
              <Collapse>
                {faqs?.map(faq => (
                  <Panel header={faq.title} key={faq.id}>
                    <Paragraph>{faq.content}</Paragraph>
                  </Panel>
                ))}
              </Collapse>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              title={
                <>
                  <i className="las la-video" /> Video Tutorials
                </>
              }
              loading={isLoading}
            >
              {videos?.map(video => (
                <div key={video.id} style={{ marginBottom: 16 }}>
                  <Text strong>{video.title}</Text>
                  <div style={{ marginTop: 8 }}>
                    <iframe
                      width="100%"
                      height="200"
                      src={video.content}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              ))}
            </Card>
          </Col>
        </Row>

        <Card
          style={{ marginTop: 24 }}
          title={
            <>
              <i className="las la-envelope" /> Need More Help?
            </>
          }
        >
          <Paragraph>
            Can't find what you're looking for? Our support team is here to
            help!
          </Paragraph>
          <Button
            type="primary"
            icon={<i className="las la-paper-plane" />}
            onClick={handleContactSupport}
          >
            Contact Support
          </Button>
        </Card>
      </div>
    </PageLayout>
  )
}
