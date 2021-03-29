import { Logger } from 'tslog';
import BuildDailyReportUseCase from './build-daily-report-use-case';
import SendDailyReportUseCase from './send-daily-report-use-case';

export default class StartupUseCase {
  private readonly buildDailyReportUseCase = new BuildDailyReportUseCase();

  private readonly sendDailyReportUseCase = new SendDailyReportUseCase();

  private readonly logger = new Logger({
    name: 'StartupUseCase',
  });

  async execute(): Promise<void> {
    const weekday = new Date().getDay();

    if (weekday % 6 === 0 && process.env.DEBUG !== 'true') {
      this.logger.info('Today is weekend therefore there\'s no need to send a daily report');
      return;
    }

    const projectName = process.env.PROJECT_NAME;
    const teamName = process.env.TEAM_NAME;
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const emailRecipients = process.env.EMAIL_RECIPIENTS;
    const emailCarbonCopyRecipients = process.env.EMAIL_CARBON_COPY_RECIPIENTS;

    if (!projectName) {
      throw new Error('Project name not set!');
    }

    if (!teamName) {
      throw new Error('Team name not set!');
    }

    if (!smtpUser) {
      throw new Error('SMTP user not set!');
    }

    if (!smtpPassword) {
      throw new Error('SMTP password not set!');
    }

    if (!smtpHost) {
      throw new Error('SMTP host not set!');
    }

    if (!smtpPort) {
      throw new Error('SMTP port not set!');
    }

    if (!emailRecipients) {
      throw new Error('Email recipients not set!');
    }

    const response = await this.buildDailyReportUseCase.execute({
      projectName,
      teamName,
    });

    if (!response.report) {
      throw new Error('Report not generated!');
    }

    await this.sendDailyReportUseCase.execute({
      emailConfiguration: {
        authentication: {
          password: smtpPassword,
          user: smtpUser,
        },
        host: smtpHost,
        port: Number(smtpPort),
      },
      carbonCopyRecipients: emailCarbonCopyRecipients,
      recipients: emailRecipients,
      report: response.report,
      sprintName: response.sprintName,
      teamName,
    });
  }
}
