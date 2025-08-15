import { Resend } from 'resend';
import twilio from 'twilio';
import fetch from 'node-fetch';

interface SocialMediaConfig {
  resend: {
    apiKey: string;
    fromEmail: string;
    toEmail: string;
  };
  twilio: {
    accountSid: string;
    authToken: string;
    fromPhone: string;
    toPhone: string;
    whatsappFrom: string;
    whatsappTo: string;
  };
  slack: {
    webhookUrl: string;
  };
}

interface MessageResult {
  platform: string;
  success: boolean;
  message: string;
  error?: string;
}

export class SocialMediaService {
  private config: SocialMediaConfig;
  private resend: Resend;
  private twilioClient: twilio.Twilio;

  constructor() {
    this.config = {
      resend: {
        apiKey: process.env.RESEND_API_KEY || process.env.RESEND_KEY || '',
        fromEmail: process.env.RESEND_FROM_EMAIL || '',
        toEmail: process.env.RESEND_TO_EMAIL || ''
      },
      twilio: {
        accountSid: process.env.TWILLIO_ACCOUNT_SID || '',
        authToken: process.env.TWILLIO_AUTH_TOKEN || '',
        fromPhone: process.env.TWILIO_FROM_PHONE || '',
        toPhone: process.env.TWILIO_TO_PHONE || '',
        whatsappFrom: process.env.TWILIO_WHATSAPP_FROM || '',
        whatsappTo: process.env.TWILIO_WHATSAPP_TO || ''
      },
      slack: {
        webhookUrl: process.env.SLACK_WEBHOOK_URL || ''
      }
    };

    // Initialize clients
    this.resend = new Resend(this.config.resend.apiKey);
    this.twilioClient = twilio(this.config.twilio.accountSid, this.config.twilio.authToken);
  }

  async sendToAllPlatforms(content: string, visitorInfo?: { ip?: string; userAgent?: string }): Promise<MessageResult[]> {
    const results: MessageResult[] = [];
    
    // Send to all platforms concurrently
    const promises = [
      this.sendEmail(content, visitorInfo),
      this.sendSMS(content, visitorInfo),
      this.sendWhatsApp(content, visitorInfo),
      this.sendSlack(content, visitorInfo)
    ];

    const platformResults = await Promise.allSettled(promises);
    
    platformResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        const platforms = ['Email', 'SMS', 'WhatsApp', 'Slack'];
        results.push({
          platform: platforms[index],
          success: false,
          message: 'Failed to send message',
          error: result.reason?.message || 'Unknown error'
        });
      }
    });

    return results;
  }

  private async sendEmail(content: string, visitorInfo?: { ip?: string; userAgent?: string }): Promise<MessageResult> {
    try {
      if (!this.config.resend.apiKey) {
        return {
          platform: 'Email',
          success: false,
          message: 'Resend API key not configured',
          error: 'Missing API key'
        };
      }

      const visitorDetails = visitorInfo ? 
        `\n\nVisitor Details:\nIP: ${visitorInfo.ip || 'Unknown'}\nUser Agent: ${visitorInfo.userAgent || 'Unknown'}` : '';

      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Portfolio Message</h2>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px; line-height: 1.6; margin: 0;">${content}</p>
          </div>
          ${visitorDetails ? `<div style="background-color: #f1f5f9; padding: 15px; border-radius: 6px; font-size: 12px; color: #64748b;">${visitorDetails}</div>` : ''}
          <p style="color: #64748b; font-size: 14px; margin-top: 20px;">Sent from your portfolio terminal at ${new Date().toLocaleString()}</p>
        </div>
      `;

      await this.resend.emails.send({
        from: this.config.resend.fromEmail,
        to: this.config.resend.toEmail,
        subject: 'New Portfolio Message',
        html: emailContent
      });

      return {
        platform: 'Email',
        success: true,
        message: 'Email sent successfully'
      };
    } catch (error) {
      return {
        platform: 'Email',
        success: false,
        message: 'Failed to send email',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async sendSMS(content: string, visitorInfo?: { ip?: string; userAgent?: string }): Promise<MessageResult> {
    try {
      if (!this.config.twilio.accountSid || !this.config.twilio.authToken) {
        return {
          platform: 'SMS',
          success: false,
          message: 'Twilio credentials not configured',
          error: 'Missing credentials'
        };
      }

      const visitorDetails = visitorInfo ? 
        `\n\nVisitor Details:\nIP: ${visitorInfo.ip || 'Unknown'}\nUser Agent: ${visitorInfo.userAgent || 'Unknown'}` : '';

      const smsContent = `New Portfolio Message: ${content}${visitorDetails}`;

      await this.twilioClient.messages.create({
        body: smsContent,
        from: this.config.twilio.fromPhone,
        to: this.config.twilio.toPhone
      });

      return {
        platform: 'SMS',
        success: true,
        message: 'SMS sent successfully'
      };
    } catch (error) {
      return {
        platform: 'SMS',
        success: false,
        message: 'Failed to send SMS',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async sendWhatsApp(content: string, visitorInfo?: { ip?: string; userAgent?: string }): Promise<MessageResult> {
    try {
      if (!this.config.twilio.accountSid || !this.config.twilio.authToken) {
        return {
          platform: 'WhatsApp',
          success: false,
          message: 'Twilio credentials not configured',
          error: 'Missing credentials'
        };
      }

      const visitorDetails = visitorInfo ? 
        `\n\nVisitor Details:\nIP: ${visitorInfo.ip || 'Unknown'}\nUser Agent: ${visitorInfo.userAgent || 'Unknown'}` : '';

      const whatsappContent = `New Portfolio Message: ${content}${visitorDetails}`;

      await this.twilioClient.messages.create({
        from: this.config.twilio.whatsappFrom,
        body: whatsappContent,
        to: this.config.twilio.whatsappTo
      });

      return {
        platform: 'WhatsApp',
        success: true,
        message: 'WhatsApp message sent successfully'
      };
    } catch (error) {
      return {
        platform: 'WhatsApp',
        success: false,
        message: 'Failed to send WhatsApp message',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async sendSlack(content: string, visitorInfo?: { ip?: string; userAgent?: string }): Promise<MessageResult> {
    try {
      if (!this.config.slack.webhookUrl) {
        return {
          platform: 'Slack',
          success: false,
          message: 'Slack webhook not configured',
          error: 'Missing webhook URL'
        };
      }

      const visitorDetails = visitorInfo ? 
        `\n\n*Visitor Details:*\n• IP: ${visitorInfo.ip || 'Unknown'}\n• User Agent: ${visitorInfo.userAgent || 'Unknown'}` : '';

      const slackPayload = {
        text: `:new: *New Portfolio Message*\n\n${content}${visitorDetails}\n\n:clock1: Sent at ${new Date().toLocaleString()}`,
        attachments: [
          {
            color: '#2563eb',
            fields: [
              {
                title: 'Platform',
                value: 'Portfolio Terminal',
                short: true
              },
              {
                title: 'Status',
                value: 'New Message',
                short: true
              }
            ]
          }
        ]
      };

      const response = await fetch(this.config.slack.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slackPayload)
      });

      if (!response.ok) {
        throw new Error(`Slack API responded with status: ${response.status}`);
      }

      return {
        platform: 'Slack',
        success: true,
        message: 'Slack notification sent successfully'
      };
    } catch (error) {
      return {
        platform: 'Slack',
        success: false,
        message: 'Failed to send Slack notification',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
