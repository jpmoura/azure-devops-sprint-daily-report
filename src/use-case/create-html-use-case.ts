import * as Eta from 'eta';
import { promises as fs } from 'fs';
import { EtaConfig } from 'eta/dist/types/config';
import CreateHtmlRequest from '../domain/use-case/request/create-html-request';
import CreateHtmlResponse from '../domain/use-case/response/create-html-response';
import CreateHtmlRequestValidator from '../domain/validator/use-case/request/create-html-request-validator';

export default class CreateHtmlUseCase {
  private readonly validator = new CreateHtmlRequestValidator();

  private static getRenderConfig(): EtaConfig {
    return {
      ...Eta.defaultConfig,
      async: true,
      views: 'assets/templates',
    };
  }

  private validate(request: CreateHtmlRequest) {
    const validationErrors = this.validator.validate(request);

    if (Object.keys(validationErrors).length > 0) {
      throw new Error(`CreateHtmlRequest is not valid!\nValidation errors: ${JSON.stringify(validationErrors)}`);
    }
  }

  async execute(request: CreateHtmlRequest): Promise<CreateHtmlResponse> {
    this.validate(request);

    const report = await Eta.renderFileAsync('./daily-report.eta', request, CreateHtmlUseCase.getRenderConfig());

    if (!report) {
      throw new Error('Error while generating report!');
    }

    if (process.env.SLS_DEBUG) {
      await fs.writeFile('./report.html', report, 'utf8');
    }

    return {
      html: report,
    };
  }
}
