import AzureDevOpsAuthentication from './azure-devops-authentication';

export default interface AzureDevOpsConfiguration {
  authentication: AzureDevOpsAuthentication;

  organization: string;

  project: string;

  team: string;

  hasCustomBurndown: boolean;
}
