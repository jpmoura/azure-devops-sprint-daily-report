import ProcessSquadReportRequest from '../domain/use-case/request/process-squad-report-request';
import ProcessSquadReportRequestValidator from '../domain/validator/use-case/request/process-squad-report-request-validator';
import BuildDailyReportUseCase from './build-daily-report-use-case';
import SendEmailUseCase from './send-email-use-case';

export default class ProcessSquadReportUseCase {
  private readonly sendDailyReportUseCase = new SendEmailUseCase();

  private readonly validator = new ProcessSquadReportRequestValidator();

  private validate(request: ProcessSquadReportRequest) {
    const validationErrors = this.validator.validate(request);

    if (Object.keys(validationErrors).length > 0) {
      throw new Error(`Process Squad Report request is not valid!\nValidation errors: ${JSON.stringify(validationErrors)}`);
    }
  }

  async execute(request: ProcessSquadReportRequest): Promise<void> {
    this.validate(request);

    const buildDailyReportUseCase = new BuildDailyReportUseCase(
      request.azureDevOps.authentication.pat,
      request.azureDevOps.organization,
      request.azureDevOps.authentication.user,
      request.azureDevOps.authentication.password,
    );

    const response = await buildDailyReportUseCase.execute({
      projectName: request.azureDevOps.project,
      teamName: request.azureDevOps.team,
      hasCustomBurndown: request.azureDevOps.hasCustomBurndown,
    });

    const iterationName = response.iterationName ? ` - ${response.iterationName}` : '';
    const subject = `[${request.azureDevOps.team}] Daily Report${iterationName}`;

    await this.sendDailyReportUseCase.execute({
      authentication: request.email.authentication,
      server: request.email.server,
      carbonCopyRecipients: request.email.carbonCopyRecipients,
      recipients: request.email.recipients,
      htmlContent: response.report,
      subject,
    });
  }
}
