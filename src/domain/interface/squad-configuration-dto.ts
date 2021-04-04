import AzureDevOpsConfigurationDto from './azure-devops-configuration-dto';
import EmailConfigurationDto from './email-configuration-dto';

export default interface SquadConfigurationDto {
  id: string;

  email: EmailConfigurationDto;

  azureDevOps: AzureDevOpsConfigurationDto;

  isActive: boolean;
}
