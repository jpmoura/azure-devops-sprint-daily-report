import AzureDevOpsConfiguration from './azure-devops-configuration';
import EmailConfiguration from './email-configuration';

export default interface SquadConfiguration {
  id: string;

  email: EmailConfiguration;

  azureDevOps: AzureDevOpsConfiguration;

  isActive: boolean;
}
