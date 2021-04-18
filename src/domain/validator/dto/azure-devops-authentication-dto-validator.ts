import { Validator } from 'fluentvalidation-ts';
import AzureDevOpsAuthenticationDto from '../../interface/azure-devops-authentication-dto';

export default class AzureDevOpsAuthenticationDtoValidator
  extends Validator<AzureDevOpsAuthenticationDto> {
  constructor(shouldValidateCredentials: boolean) {
    super();

    this.ruleFor('pat')
      .notNull()
      .notEmpty();

    if (shouldValidateCredentials) {
      this.ruleFor('user')
        .notNull()
        .notEmpty();
      this.ruleFor('password')
        .notNull()
        .notEmpty();
    }
  }
}
