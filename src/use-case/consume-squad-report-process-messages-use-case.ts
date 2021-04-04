import { Logger } from 'tslog';
import ConsumeSquadReportProcessMessagesRequest from '../domain/use-case/request/consume-squad-process-messages-request';
import ProcessSquadReportRequest from '../domain/use-case/request/process-squad-report-request';
import ConsumeSquadReportProcessMessagesRequestValidator from '../domain/validator/use-case/request/consume-squad-report-process-messages-request-validator';
import ProcessSquadReportUseCase from './process-squad-report-use-case';

export default class ConsumeSquadReportProcessMessagesUseCase {
  private readonly validator = new ConsumeSquadReportProcessMessagesRequestValidator();

  private readonly processSquadReportUseCase = new ProcessSquadReportUseCase();

  private readonly logger = new Logger({
    name: 'ConsumeSquadReportProcessMessagesUseCase',
  });

  private validate(request: ConsumeSquadReportProcessMessagesRequest) {
    const validationErrors = this.validator.validate(request);

    if (Object.keys(validationErrors).length > 0) {
      throw new Error(`ConsumeSquadReportProcessMessagesRequest is not valid!\nValidation errors: ${JSON.stringify(validationErrors)}`);
    }
  }

  private async consume(request: ProcessSquadReportRequest): Promise<void> {
    try {
      this.logger.info('Starting processing request', { request });
      await this.processSquadReportUseCase.execute(request);
    } catch (e) {
      this.logger.error('Error while processing request', { request });
      throw e;
    }
  }

  async execute(request: ConsumeSquadReportProcessMessagesRequest): Promise<void> {
    this.validate(request);

    const promises: Array<Promise<void>> = [];

    request.event.Records.forEach((snsEventRecord) => {
      const processSquadReportRequest: ProcessSquadReportRequest = JSON.parse(snsEventRecord.Sns.Message);
      const consumePromise = this.consume(processSquadReportRequest);
      promises.push(consumePromise);
    });

    await Promise.all(promises);
  }
}
