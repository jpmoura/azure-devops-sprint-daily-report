import EmailAuthentication from '../../model/email-authentication';
import EmailServer from '../../model/email-server';

export default interface SendEmailRequest {
  server: EmailServer;

  authentication: EmailAuthentication;

  recipients: Array<string>;

  carbonCopyRecipients?: Array<string>;

  htmlContent: string;

  subject: string;
}
