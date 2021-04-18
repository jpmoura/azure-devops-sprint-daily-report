import { Validator } from 'fluentvalidation-ts';
import SendEmailRequest from '../../../use-case/request/send-email-request';
import EmailAuthenticationDtoValidator from '../../dto/email-authentication-dto-validator';
import EmailServerDtoValidator from '../../dto/email-server-dto-validator';

export default class SendEmailRequestValidator extends Validator<SendEmailRequest> {
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

    this.ruleFor('htmlContent')
      .notNull()
      .notEmpty();

    this.ruleFor('subject')
      .notNull()
      .notEmpty();
  }
}
