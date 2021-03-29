import { WorkItem } from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';

export default class CustomWorkItem {
  id: number;

  title: string;

  type: string;

  state: string;

  url: string;

  storyPoints?: number;

  originalEstimate?: number;

  remainingWork?: number;

  completedWork?: number;

  children?: Array<CustomWorkItem>;

  constructor(id: number, title: string, type: string, state: string, url: string, storyPoints?: number, originalEstimate?: number, remainingWork?: number, completedWork?: number) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.state = state;
    this.url = url.replace('_apis/wit', '_workitems').replace('workItems', 'edit');
    this.storyPoints = storyPoints;
    this.originalEstimate = originalEstimate;
    this.remainingWork = remainingWork;
    this.completedWork = completedWork;
    this.children = [];
  }

  static from(workItem: WorkItem): CustomWorkItem {
    if (!workItem || !workItem.id || !workItem.fields || !workItem.url) {
      throw new Error('Invalid source work item');
    }

    return new CustomWorkItem(
      workItem.id,
      workItem.fields['System.Title'],
      workItem.fields['System.WorkItemType'],
      workItem.fields['System.State'],
      workItem.url,
      workItem.fields['Microsoft.VSTS.Scheduling.StoryPoints'],
      workItem.fields['Microsoft.VSTS.Scheduling.OriginalEstimate'],
      workItem.fields['Microsoft.VSTS.Scheduling.RemainingWork'],
      workItem.fields['Microsoft.VSTS.Scheduling.CompletedWork'],
    );
  }
}
