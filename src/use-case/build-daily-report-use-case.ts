import { Logger } from 'tslog';
import BuildDailyReportUseCaseRequest from '../domain/use-case/request/build-daily-report-use-case-request';
import BuildDailyReportUseCaseResponse from '../domain/use-case/response/build-daily-report-use-case-response';
import AzureDevOpsRepository from '../infra/repository/azure-dev-ops-repository';
import CreateHtmlUseCase from './create-html-use-case';

export default class BuildDailyReportUseCase {
  private readonly azureDevOpsRepository = new AzureDevOpsRepository(process.env.PAT, process.env.ORGANIZATION_NAME);

  private readonly createHtmlUseCase = new CreateHtmlUseCase();

  private readonly logger = new Logger({
    name: 'BuildDailyReportUseCase',
  });

  async execute(request: BuildDailyReportUseCaseRequest): Promise<BuildDailyReportUseCaseResponse> {
    const currentSprint = await this.azureDevOpsRepository.getCurrentSprint({
      project: request.projectName,
      team: request.teamName,
    });

    if (!currentSprint) {
      this.logger.warn('Active sprint not found!', { request });
      return {
        report: undefined,
        sprintName: undefined,
      };
    }

    const backlog = await this.azureDevOpsRepository.getSprintBacklog(request.projectName, request.teamName, currentSprint);
    const burndownImageBase64Encoded = await this.azureDevOpsRepository.getCustomSprintBurndown(request.projectName, request.teamName, currentSprint);

    if (!burndownImageBase64Encoded) {
      this.logger.error('Error while trying to get sprint burndown', { request, currentSprint });
      return {
        report: undefined,
        sprintName: undefined,
      };
    }

    const response = await this.createHtmlUseCase.execute({
      backlog,
      burndown: burndownImageBase64Encoded,
      sprint: currentSprint,
    });

    return {
      report: response.html,
      sprintName: currentSprint.name,
    };
  }
}
