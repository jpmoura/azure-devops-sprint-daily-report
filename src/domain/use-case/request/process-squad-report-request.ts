import AzureDevOpsConfigurationDto from '../../interface/azure-devops-configuration-dto';
import EmailConfigurationDto from '../../interface/email-configuration-dto';

export default interface ProcessSquadReportRequest {
  email: EmailConfigurationDto;

  azureDevOps: AzureDevOpsConfigurationDto;
}
