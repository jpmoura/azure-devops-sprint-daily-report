import { Validator } from 'fluentvalidation-ts';
import CreateHtmlRequest from '../../../use-case/request/create-html-request';

export default class CreateHtmlRequestValidator extends Validator<CreateHtmlRequest> {
  constructor() {
    super();

    this.ruleFor('backlog')
      .notNull()
      .must({ predicate: (backlog) => backlog.length > 0, message: 'Backlog must have at least one item' });

    this.ruleFor('burndown')
      .notNull()
      .notEmpty();

    this.ruleFor('iteration')
      .notNull();
  }
}
