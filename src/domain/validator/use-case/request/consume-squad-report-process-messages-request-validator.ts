import { Validator } from 'fluentvalidation-ts';
import ConsumeSquadReportProcessMessagesRequest from '../../../use-case/request/consume-squad-process-messages-request';

export default class ConsumeSquadReportProcessMessagesRequestValidator extends Validator<ConsumeSquadReportProcessMessagesRequest> {
  constructor() {
    super();

    this.ruleFor('event').notNull();
  }
}
