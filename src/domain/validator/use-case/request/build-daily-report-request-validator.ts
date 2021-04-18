import { Validator } from 'fluentvalidation-ts';
import BuildDailyReportRequest from '../../../use-case/request/build-daily-report-request';

export default class BuildDailyReportRequestValidator extends Validator<BuildDailyReportRequest> {
  constructor() {
    super();

    this.ruleFor('hasCustomBurndown').notNull();
    this.ruleFor('projectName').notNull().notEmpty();
    this.ruleFor('teamName').notNull().notEmpty();
  }
}
