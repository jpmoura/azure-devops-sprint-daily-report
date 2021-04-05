import { Logger } from 'tslog';
import nodemailer from 'nodemailer';
import SendEmailRequest from '../domain/use-case/request/send-email-request';
import SendEmailRequestValidator from '../domain/validator/use-case/request/send-email-request-validator';

export default class SendEmailUseCase {
  private readonly validator = new SendEmailRequestValidator();

  private readonly logger = new Logger({
    name: 'SendEmailUseCase',
    type: 'json',
  });

  private validate(request: SendEmailRequest) {
    const validationErrors = this.validator.validate(request);

    if (Object.keys(validationErrors).length > 0) {
      throw new Error(`SendEmailRequest is not valid!\nValidation errors: ${JSON.stringify(validationErrors)}`);
    }
  }

  async execute(request: SendEmailRequest): Promise<void> {
    this.validate(request);

    const transporter = nodemailer.createTransport({
      host: request.server.host,
      port: request.server.port,
      secure: request.server.port === 465,
      auth: {
        user: request.authentication.user,
        pass: request.authentication.password,
      },
    });

    try {
      await transporter.sendMail({
        from: request.authentication.user,
        to: request.recipients.join(','),
        cc: request.carbonCopyRecipients?.join(','),
        html: request.htmlContent,
        subject: request.subject,
      });
    } catch (error) {
      this.logger.error('Error while sending daily report', { request, error });
      throw error;
    }
  }
}
