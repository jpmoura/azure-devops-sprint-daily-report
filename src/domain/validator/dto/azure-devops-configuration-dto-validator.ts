import { Validator } from 'fluentvalidation-ts';
import AzureDevOpsConfigurationDto from '../../interface/azure-devops-configuration-dto';
import AzureDevOpsAuthenticationDtoValidator from './azure-devops-authentication-dto-validator';

export default class AzureDevOpsConfigurationDtoValidator extends
  Validator<AzureDevOpsConfigurationDto> {
  constructor() {
    super();

    this.ruleFor('hasCustomBurndown')
      .notNull();
    this.ruleFor('organization')
      .notNull()
      .notEmpty();
    this.ruleFor('project')
      .notNull()
      .notEmpty();
    this.ruleFor('team')
      .notNull()
      .notEmpty();
    this.ruleFor('authentication')
      .notNull()
      .setValidator(
        (dto) => new AzureDevOpsAuthenticationDtoValidator(dto.hasCustomBurndown),
      );
  }
}
