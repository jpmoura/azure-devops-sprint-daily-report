import { Validator } from 'fluentvalidation-ts';
import EmailConfigurationDto from '../../interface/email-configuration-dto';
import EmailAuthenticationDtoValidator from './email-authentication-dto-validator';
import EmailServerDtoValidator from './email-server-dto-validator';

export default class EmailConfigurationDtoValidator extends Validator<EmailConfigurationDto> {
  private readonly emailAuthenticationDtoValidator = new EmailAuthenticationDtoValidator();

  private readonly emailServerDtoValidator = new EmailServerDtoValidator();

  constructor() {
    super();

    this.ruleFor('authentication')
      .notNull()
      .setValidator(() => this.emailAuthenticationDtoValidator);

    this.ruleFor('server')
      .notNull()
      .setValidator(() => this.emailServerDtoValidator);

    this.ruleForEach('carbonCopyRecipients')
      .notNull()
      .notEmpty()
      .emailAddress()
      .unless((dto) => !dto.carbonCopyRecipients || dto.carbonCopyRecipients.length === 0);

    this.ruleFor('recipients').notNull();
    this.ruleForEach('recipients')
      .notNull()
      .notEmpty()
      .emailAddress();
  }
}
