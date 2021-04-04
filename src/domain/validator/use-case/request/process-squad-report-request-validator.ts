import { Validator } from 'fluentvalidation-ts';
import ProcessSquadReportRequest from '../../../use-case/request/process-squad-report-request';
import AzureDevOpsConfigurationDtoValidator from '../../dto/azure-devops-configuration-dto-validator';
import EmailConfigurationDtoValidator from '../../dto/email-configuration-dto-validator';

export default class ProcessSquadReportRequestValidator extends Validator<ProcessSquadReportRequest> {
  private readonly azureDevOpsConfigurationDtoValidator = new AzureDevOpsConfigurationDtoValidator();

  private readonly emailConfigurationDtoValidator = new EmailConfigurationDtoValidator();

  constructor() {
    super();

    this.ruleFor('azureDevOps')
      .notNull()
      .setValidator(() => this.azureDevOpsConfigurationDtoValidator);

    this.ruleFor('email')
      .notNull()
      .setValidator(() => this.emailConfigurationDtoValidator);
  }
}
