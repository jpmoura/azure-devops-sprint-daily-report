import chromeLambda from 'chrome-aws-lambda';
import * as AzureDevOps from 'azure-devops-node-api';
import { TeamContext, TeamProjectReference, WebApiTeam } from 'azure-devops-node-api/interfaces/CoreInterfaces';
import { TeamSettingsIteration, TimeFrame } from 'azure-devops-node-api/interfaces/WorkInterfaces';
import { WorkItemLink, WorkItemReference } from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';
import { Logger } from 'tslog';
import axios, { AxiosInstance } from 'axios';
import CustomWorkItem from '../../domain/model/custom-work-item';

export default class AzureDevOpsRepository {
  private readonly connection: AzureDevOps.WebApi;

  private readonly organization: string;

  private readonly user?: string;

  private readonly password?: string;

  private readonly client: AxiosInstance;

  private readonly logger = new Logger({
    name: 'AzureDevOpsRepository',
    type: 'json',
  });

  constructor(pat: string, organization: string, user?: string, password?: string) {
    const authHandler = AzureDevOps.getPersonalAccessTokenHandler(pat);
    this.connection = new AzureDevOps.WebApi(`https://dev.azure.com/${organization}`, authHandler);
    this.organization = organization;
    this.user = user;
    this.password = password;
    this.client = axios.create({
      auth: {
        password: pat,
        username: '',
      },
      baseURL: 'https://dev.azure.com/',
    });
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

    return iterations?.find((iteration) => iteration.attributes?.timeFrame === TimeFrame.Current);
  }

  async getIterationBacklog(
    projectName: string,
    teamName: string,
    sprint: TeamSettingsIteration,
  ): Promise<Array<CustomWorkItem>> {
    if (!sprint || !sprint?.id) {
      this.logger.warn('There\'s no current active iteration therefore it is not necessary send a report');
      return [];
    }

    const project = await this.getProject(projectName);

    if (!project || !project.id) {
      throw new Error(`Project with name ${projectName} not found or does not has an ID.\nProject: ${JSON.stringify(project)}`);
    }

    const team = await this.getTeam(project.id, teamName);

    if (!team) {
      throw new Error(`Team with name ${teamName} not found!`);
    }

    const teamContext = AzureDevOpsRepository.buildTeamContext(project, team);

    return this.getCustomWorkItems(teamContext, sprint.id);
  }

  private async getCustomIterationBurndown(
    project: string,
    team: string,
    sprint: TeamSettingsIteration,
  ): Promise<string> {
    if (!this.user || !this.password) {
      throw Error(`Azure DevOps Credentials not set!\nUser: ${this.user}\nPassword: ${this.password}`);
    }

    const url = `https://dev.azure.com/${this.organization}/${project}/_sprints/analytics/${team}/${sprint?.path}?fullScreen=true`;
    const browser = await chromeLambda.puppeteer.launch({
      args: chromeLambda.args,
      headless: true,
      executablePath: await chromeLambda.executablePath,
      ignoreHTTPSErrors: true,
      dumpio: true,
    });
    let screenshot: string | void | Buffer | undefined;

    try {
      const page = await browser.newPage();
      await page.setViewport({
        height: 1200,
        width: 1200,
      });
      await page.goto(url, { waitUntil: 'networkidle0' });
      await page.type('#i0116', this.user);
      await page.click('[type=submit]');
      await page.waitForTimeout(1500);
      await page.type('#i0118', this.password);
      await page.click('[type=submit]');
      await page.waitForTimeout(1500);
      await page.click('#idBtn_Back');
      await page.waitForTimeout(15000);
      screenshot = await page.screenshot(
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
      screenshot = undefined;
    } finally {
      browser.close();
    }

    const screenshotBuffer: Buffer | undefined = screenshot as Buffer;

    return screenshotBuffer?.toString('base64');
  }

  private async getDefaultIterationBurndown(
    project: string,
    team: string,
    sprint: TeamSettingsIteration,
  ): Promise<string> {
    const chartTitle = `Burndown - ${sprint.name}`;
    const response = await this.client.get(
      `${this.organization}/${project}/${team}/_apis/work/iterations/${sprint.id}/chartimages/burndown?width=800&height=800&showDetails=true&title=${chartTitle}&api-version=6.1-preview.1`,
      {
        responseType: 'arraybuffer',
      },
    );
    return Buffer.from(response.data, 'binary').toString('base64');
  }

  async getIterationBurndown(
    project: string,
    team: string,
    sprint: TeamSettingsIteration,
    isCustomBurndown: boolean,
  ): Promise<string> {
    if (isCustomBurndown) {
      return this.getCustomIterationBurndown(project, team, sprint);
    }

    return this.getDefaultIterationBurndown(project, team, sprint);
  }
}
