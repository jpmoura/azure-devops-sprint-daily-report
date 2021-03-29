import * as AzureDevOps from 'azure-devops-node-api';
import { TeamContext, TeamProjectReference, WebApiTeam } from 'azure-devops-node-api/interfaces/CoreInterfaces';
import { TeamSettingsIteration } from 'azure-devops-node-api/interfaces/WorkInterfaces';
import { WorkItemLink, WorkItemReference } from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';
import { Logger } from 'tslog';
import puppeteer from 'puppeteer';
import CustomWorkItem from '../../domain/model/custom-work-item';

export default class AzureDevOpsRepository {
  private readonly connection: AzureDevOps.WebApi;

  private readonly organization: string;

  private readonly logger = new Logger({ name: 'AzureDevOpsRepository' });

  constructor(pat?: string, organization?: string) {
    if (!organization) {
      throw new Error('Organization URL not set!');
    }

    if (!pat) {
      throw new Error('PAT not set!');
    }

    const authHandler = AzureDevOps.getPersonalAccessTokenHandler(pat);
    this.connection = new AzureDevOps.WebApi(`https://dev.azure.com/${organization}`, authHandler);
    this.organization = organization;
  }

  private async getProject(name: string): Promise<TeamProjectReference | undefined> {
    const coreApiClient = await this.connection.getCoreApi();
    const projects = await coreApiClient.getProjects();

    return projects?.find((project) => project.name === name);
  }

  private async getTeam(projectId: string, name: string): Promise<WebApiTeam | undefined> {
    const coreApiClient = await this.connection.getCoreApi();
    const teams = await coreApiClient.getTeams(projectId, true);

    return teams?.find((team) => team.name === name);
  }

  private static addWorkItemInSet(set: Set<number>, workItemReference?: WorkItemReference) {
    if (workItemReference && workItemReference.id) {
      set.add(workItemReference.id);
    }
  }

  private static getChildrenWorkItems(
    backlogItemId: number,
    workItemRelations: Array<WorkItemLink> | undefined,
    customWorkItems: Array<CustomWorkItem>,
  ): Array<CustomWorkItem> {
    if (!workItemRelations) {
      return [];
    }

    const backlogItemRelations = workItemRelations
      .filter((relation) => relation.source?.id === backlogItemId);

    const childrenWorkItemsId = backlogItemRelations
      .map((childrenRelation) => childrenRelation.target?.id);

    return customWorkItems.filter(
      (customWorkItem) => childrenWorkItemsId.includes(customWorkItem.id),
    );
  }

  private async getCustomWorkItems(
    teamContext: TeamContext,
    iterationId: string,
  ): Promise<Array<CustomWorkItem>> {
    const workApiClient = await this.connection.getWorkApi();
    const workItemTrackingApiClient = await this.connection.getWorkItemTrackingApi();

    const iterationWorkItems = await workApiClient.getIterationWorkItems(teamContext, iterationId);

    const sourceIds = new Set<number>();
    const ids = new Set<number>();

    iterationWorkItems.workItemRelations?.forEach((workItemLink) => {
      AzureDevOpsRepository.addWorkItemInSet(sourceIds, workItemLink.source);
      AzureDevOpsRepository.addWorkItemInSet(ids, workItemLink.source);
      AzureDevOpsRepository.addWorkItemInSet(ids, workItemLink.target);
    });

    const workItemsIds = Array.from(ids);

    if (workItemsIds.length === 0) {
      this.logger.warn('Sprint does not have a single Work Item!', { teamContext, iterationId });
      return [];
    }

    const enrichedWorkItems = await workItemTrackingApiClient.getWorkItemsBatch({
      fields: [
        'System.Title',
        'System.State',
        'System.WorkItemType',
        'Microsoft.VSTS.Scheduling.StoryPoints',
        'Microsoft.VSTS.Scheduling.OriginalEstimate',
        'Microsoft.VSTS.Scheduling.RemainingWork',
        'Microsoft.VSTS.Scheduling.CompletedWork',
      ],
      ids: Array.from(ids),
    });

    const customWorkItems = enrichedWorkItems.map(
      (enrichedWorkItem) => CustomWorkItem.from(enrichedWorkItem),
    );

    const workItemsTree = new Array<CustomWorkItem>();

    sourceIds.forEach((backlogItemId) => {
      const backlogLevelWorkItem = customWorkItems.find(
        (workItem) => workItem.id === backlogItemId,
      );

      if (backlogLevelWorkItem) {
        const children = AzureDevOpsRepository.getChildrenWorkItems(
          backlogItemId,
          iterationWorkItems.workItemRelations,
          customWorkItems,
        );

        backlogLevelWorkItem.children = children;

        workItemsTree.push(backlogLevelWorkItem);
      } else {
        this.logger.warn('Backlog Item not found', backlogItemId);
      }
    });

    return workItemsTree;
  }

  private static buildTeamContext(project: TeamProjectReference, team: WebApiTeam): TeamContext {
    return {
      project: project.name,
      projectId: project.id,
      team: team.name,
      teamId: team.id,
    };
  }

  async getCurrentSprint(teamContext: TeamContext):
  Promise<TeamSettingsIteration | undefined> {
    const workApiClient = await this.connection.getWorkApi();
    const iterations = await workApiClient.getTeamIterations(teamContext);

    // return iterations?.find((iteration) => iteration.attributes?.timeFrame === TimeFrame.Current);
    return iterations?.find((iteration) => iteration.name === 'Sprint 3.1');
  }

  async getSprintBacklog(projectName: string, teamName: string, sprint: TeamSettingsIteration): Promise<Array<CustomWorkItem>> {
    if (!sprint || !sprint?.id) {
      this.logger.warn('There\'s no current active iteration therefore it is not necessary send a report');
      return [];
    }

    if (!projectName) {
      throw new Error('Project name not set!');
    }

    if (!teamName) {
      throw new Error('Team name not set!');
    }

    const project = await this.getProject(projectName);

    if (!project) {
      throw new Error(`Project with name ${projectName} not found!`);
    }

    if (!project.id) {
      throw new Error(`Project with name ${projectName} does not have an ID`);
    }

    const team = await this.getTeam(project.id, teamName);

    if (!team) {
      throw new Error(`Team with name ${teamName} not found!`);
    }

    const teamContext = AzureDevOpsRepository.buildTeamContext(project, team);
    const workItems = await this.getCustomWorkItems(teamContext, sprint.id);

    return workItems;
  }

  async getCustomSprintBurndown(projectName: string, teamName: string, sprint: TeamSettingsIteration): Promise<string> {
    const user = process.env.DEVOPS_USER;
    const password = process.env.DEVOPS_PASSWORD;

    if (!user || !password) {
      this.logger.error('DevOps credentials not set!', { user, password });
      return '';
    }

    const url = `https://dev.azure.com/${this.organization}/${projectName}/_sprints/analytics/${teamName}/${sprint?.path}?fullScreen=true`;
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true });
    let buffer: any;

    try {
      const page = await browser.newPage();
      await page.setViewport({
        height: 1200,
        width: 1200,
      });
      await page.goto(url, { waitUntil: 'networkidle0' });
      await page.type('#i0116', user);
      await page.click('[type=submit]');
      await page.waitForTimeout(1500);
      await page.type('#i0118', password);
      await page.click('[type=submit]');
      await page.waitForTimeout(1500);
      await page.click('#idBtn_Back');
      await page.waitForTimeout(15000);
      buffer = await page.screenshot(
        {
          clip: {
            height: 650,
            width: 1025,
            x: 25,
            y: 260,
          },
        },
      );
    } catch (e) {
      this.logger.error('Error while getting burndown', e);
      buffer = undefined;
    } finally {
      browser.close();
    }

    return buffer.toString('base64');
  }
}
