import EmailAuthentication from './email-authentication';

export default interface EmailConfiguration {
  authentication: EmailAuthentication;

  host: string;

  port: number;
}
