import { SNSEvent } from 'aws-lambda';

export default interface ConsumeSquadReportProcessMessagesRequest {
  event: SNSEvent;
}
