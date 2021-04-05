import { TeamSettingsIteration } from 'azure-devops-node-api/interfaces/WorkInterfaces';
import CustomWorkItem from '../domain/model/custom-work-item';
import BuildDailyReportRequest from '../domain/use-case/request/build-daily-report-request';
import BuildDailyReportResponse from '../domain/use-case/response/build-daily-report-response';
import BuildDailyReportRequestValidator from '../domain/validator/use-case/request/build-daily-report-request-validator';
import AzureDevOpsRepository from '../infra/repository/azure-dev-ops-repository';
import CreateHtmlUseCase from './create-html-use-case';

export default class BuildDailyReportUseCase {
  private readonly azureDevOpsRepository;

  private readonly createHtmlUseCase = new CreateHtmlUseCase();

  private readonly validator = new BuildDailyReportRequestValidator();

  constructor(pat: string, organization: string, user?: string, password?: string) {
    this.azureDevOpsRepository = new AzureDevOpsRepository(pat, organization, user, password);
  }

  private validate(request: BuildDailyReportRequest) {
    const validationErrors = this.validator.validate(request);

    if (Object.keys(validationErrors).length > 0) {
      throw new Error(`BuildDailyReportUseCaseRequest is not valid!\nValidation errors: ${JSON.stringify(validationErrors)}`);
    }
  }

  private async getCurrentIteration(project: string, team: string): Promise<TeamSettingsIteration> {
    const currentSprint = await this.azureDevOpsRepository.getCurrentSprint({
      project,
      team,
    });

    if (!currentSprint) {
      throw new Error(`No active iteration found!\nProject: ${project}\nTeam: ${team}`);
    }

    return currentSprint;
  }

  private async getIterationBacklog(project: string, team: string, iteration: TeamSettingsIteration): Promise<Array<CustomWorkItem>> {
    const backlog = await this.azureDevOpsRepository.getIterationBacklog(project, team, iteration);

    if (backlog.length === 0) {
      throw new Error(`Backlog size is equals to zero, therefore there's nothing to report.\nProject:${project}\nTeam:${team}\nCurrent sprint: ${JSON.stringify(iteration)}`);
    }

    return backlog;
  }

  private async getIterationBurndown(project: string, team: string, iteration: TeamSettingsIteration, hasCustomBurndown: boolean): Promise<string> {
    const base64EncodedBurndownImage = await this.azureDevOpsRepository.getIterationBurndown(
      project,
      team,
      iteration,
      hasCustomBurndown,
    );

    if (!base64EncodedBurndownImage) {
      throw new Error(`Not able to fetch burndown image.\nProject: ${JSON.stringify(project)}\nTeam: ${team}\nIteration: ${JSON.stringify(iteration)}\nHas Custom Burndown: ${hasCustomBurndown}`);
    }

    return base64EncodedBurndownImage;
  }

  async execute(request: BuildDailyReportRequest): Promise<BuildDailyReportResponse> {
    this.validate(request);

    const currentIteration = await this.getCurrentIteration(request.projectName, request.teamName);
    const backlog = await this.getIterationBacklog(request.projectName, request.teamName, currentIteration);
    const burndown = await this.getIterationBurndown(request.projectName, request.teamName, currentIteration, request.hasCustomBurndown);

    const response = await this.createHtmlUseCase.execute({
      backlog,
      burndown,
      iteration: currentIteration,
    });

    return {
      report: response.html,
      iterationName: currentIteration.name,
    };
  }
}
