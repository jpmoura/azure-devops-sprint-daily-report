import EmailAuthenticationDto from './email-authentication-dto';
import EmailServerDto from './email-server-dto';

export default interface EmailConfigurationDto {
  authentication: EmailAuthenticationDto;

  server: EmailServerDto;

  recipients: Array<string>;

  carbonCopyRecipients: Array<string>
}
