import { Logger } from 'tslog';
import * as Eta from 'eta';
import { promises as fs } from 'fs';
import { EtaConfig } from 'eta/dist/types/config';
import CreateHtmlUseCaseRequest from '../domain/use-case/request/create-html-use-case-request';
import CreateHtmlUseCaseResponse from '../domain/use-case/response/create-html-use-case-response';

export default class CreateHtmlUseCase {
  private readonly logger = new Logger({
    name: 'CreateHtmlUseCase',
  });

  private static getRenderConfig(): EtaConfig {
    return {
      ...Eta.defaultConfig,
      async: true,
      views: 'assets/templates',
    };
  }

  async execute(request: CreateHtmlUseCaseRequest): Promise<CreateHtmlUseCaseResponse> {
    if (request.backlog.length === 0) {
      this.logger.info('Backlog is empty so the report won\'t be generated');

      return {
        html: undefined,
      };
    }

    const report = await Eta.renderFileAsync('./daily-report.eta', request, CreateHtmlUseCase.getRenderConfig());

    if (!report) {
      throw new Error('Error while generating report!');
    }

    if (process.env.DEBUG === 'true') {
      await fs.writeFile('./report.html', report, 'utf8');
    }

    return {
      html: report,
    };
  }
}
