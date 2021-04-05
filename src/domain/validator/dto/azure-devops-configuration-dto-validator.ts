import { Validator } from 'fluentvalidation-ts';
import AzureDevOpsConfigurationDto from '../../interface/azure-devops-configuration-dto';
import AzureDevOpsAuthenticationDtoValidator from './azure-devops-authentication-dto-validator';

export default class AzureDevOpsConfigurationDtoValidator extends
  Validator<AzureDevOpsConfigurationDto> {
  constructor() {
    super();

    this.ruleFor('hasCustomBurndown').notNull();
    this.ruleFor('organization').notEmpty();
    this.ruleFor('project').notEmpty();
    this.ruleFor('team').notEmpty();
    this.ruleFor('authentication')
      .setValidator(
        (dto) => new AzureDevOpsAuthenticationDtoValidator(dto.hasCustomBurndown),
      );
  }
}
