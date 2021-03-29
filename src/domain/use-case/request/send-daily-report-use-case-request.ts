import EmailConfiguration from '../../model/email-configuration';

export default interface SendDailyReportUseCaseRequest {
  emailConfiguration: EmailConfiguration;

  recipients: string;

  carbonCopyRecipients?: string;

  report: string;

  sprintName?: string;

  teamName: string;
}
