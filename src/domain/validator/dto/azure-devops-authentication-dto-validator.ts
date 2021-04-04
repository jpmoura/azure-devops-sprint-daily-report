import { Validator } from 'fluentvalidation-ts';
import AzureDevOpsAuthenticationDto from '../../interface/azure-devops-authentication-dto';

export default class AzureDevOpsAuthenticationDtoValidator
  extends Validator<AzureDevOpsAuthenticationDto> {
  constructor(shouldValidateCredentials: boolean) {
    super();

    this.ruleFor('pat').notEmpty();

    if (shouldValidateCredentials) {
      this.ruleFor('user').notEmpty();
      this.ruleFor('password').notEmpty();
    }
  }
}
