import { TeamSettingsIteration } from 'azure-devops-node-api/interfaces/WorkInterfaces';
import CustomWorkItem from '../../model/custom-work-item';

export default interface CreateHtmlRequest {
  backlog: Array<CustomWorkItem>;

  burndown: string;

  iteration: TeamSettingsIteration;
}
