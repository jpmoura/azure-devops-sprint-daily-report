import { Validator } from 'fluentvalidation-ts';
import EmailServerDto from '../../interface/email-server-dto';

export default class EmailServerDtoValidator extends Validator<EmailServerDto> {
  constructor() {
    super();

    this.ruleFor('host')
      .notNull()
      .notEmpty();

    this.ruleFor('port')
      .greaterThanOrEqualTo(0);
  }
}
