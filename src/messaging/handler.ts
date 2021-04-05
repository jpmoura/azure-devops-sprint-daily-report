import {
  ScheduledEvent,
  ScheduledHandler, SNSEvent, SNSHandler,
} from 'aws-lambda';
import { Logger } from 'tslog';
import ConsumeSquadReportProcessMessagesUseCase from '../use-case/consume-squad-report-process-messages-use-case';
import ProduceSquadReportProcessMessagesUseCase from '../use-case/produce-squad-report-process-messages-use-case';

const produceSquadReportProcessMessagesUseCase = new ProduceSquadReportProcessMessagesUseCase();
const consumeSquadReportProcessMessagesUseCase = new ConsumeSquadReportProcessMessagesUseCase();
const logger = new Logger({
  name: 'messaging.handler',
  type: 'json',
});

export const produce: ScheduledHandler = async (event: ScheduledEvent): Promise<void> => {
  logger.info('Producing daily report messages', { event, timestamp: new Date().toISOString() });
  await produceSquadReportProcessMessagesUseCase.execute();
};

export const consume: SNSHandler = async (event: SNSEvent): Promise<void> => {
  await consumeSquadReportProcessMessagesUseCase.execute({ event });
};
