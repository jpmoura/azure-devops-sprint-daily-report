import AzureDevOpsAuthenticationDto from './azure-devops-authentication-dto';

export default interface AzureDevOpsConfigurationDto {
  authentication: AzureDevOpsAuthenticationDto;

  hasCustomBurndown: boolean;

  organization: string;

  project: string;

  team: string;
}
