import { Validator } from 'fluentvalidation-ts';
import EmailAuthenticationDto from '../../interface/email-authentication-dto';

export default class EmailAuthenticationDtoValidator extends Validator<EmailAuthenticationDto> {
  constructor() {
    super();

    this.ruleFor('user')
      .notNull()
      .notEmpty();
  }
}
