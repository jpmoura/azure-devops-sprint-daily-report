import { Logger } from 'tslog';
import nodemailer from 'nodemailer';
import SendDailyReportUseCaseRequest from '../domain/use-case/request/send-daily-report-use-case-request';

export default class SendDailyReportUseCase {
  private readonly logger = new Logger({
    name: 'SendDailyReportUseCase',
  });

  async execute(request: SendDailyReportUseCaseRequest): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: request.emailConfiguration.host,
      port: request.emailConfiguration.port,
      secure: request.emailConfiguration.port === 465,
      auth: {
        user: request.emailConfiguration.authentication.user,
        pass: request.emailConfiguration.authentication.password,
      },
    });

    const subject = `[${request.teamName}] Daily Report${request.sprintName ? ` - ${request.sprintName}` : ''}`;

    try {
      await transporter.sendMail({
        from: request.emailConfiguration.authentication.user,
        to: request.recipients,
        cc: request.carbonCopyRecipients,
        html: request.report,
        subject,
      });
    } catch (error) {
      this.logger.error('Error while sending daily report', { request, error });
    }
  }
}
