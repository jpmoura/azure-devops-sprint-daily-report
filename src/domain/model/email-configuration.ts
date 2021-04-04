import EmailAuthentication from './email-authentication';
import EmailServer from './email-server';

export default interface EmailConfiguration {
  authentication: EmailAuthentication;

  server: EmailServer;

  recipients: Array<string>;

  carbonCopyRecipients: Array<string>
}
