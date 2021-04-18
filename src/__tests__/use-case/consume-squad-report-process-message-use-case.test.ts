import { SNSEvent, SNSEventRecord } from 'aws-lambda';
import { mocked, MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { Logger } from 'tslog';
import ConsumeSquadReportProcessMessagesRequest from '../../domain/use-case/request/consume-squad-process-messages-request';
import ConsumeSquadReportProcessMessagesUseCase from '../../use-case/consume-squad-report-process-messages-use-case';
import ProcessSquadReportUseCase from '../../use-case/process-squad-report-use-case';

function setupProcessProcessSquadReportUseCaseMock(executeMock: jest.Mock<any, any>): MockedObjectDeep<typeof ProcessSquadReportUseCase> {
  const processSquadReportUseCaseMock = mocked(ProcessSquadReportUseCase, true);

  processSquadReportUseCaseMock.prototype.execute = executeMock;

  return processSquadReportUseCaseMock;
}

function buildSnsEvent(): SNSEvent {
  return {
    Records: [
      {
        Sns: {
          Message: '{"email":{},"azureDevOps":{}}',
        },
      } as SNSEventRecord],
  } as SNSEvent;
}

const sut = new ConsumeSquadReportProcessMessagesUseCase();

const logger = mocked(Logger, true);
jest.spyOn(logger.prototype, 'error').mockImplementation();
jest.spyOn(logger.prototype, 'info').mockImplementation();

describe('request is invalid', () => {
  it.each([
    [undefined],
    [null],
  ])('event is %p then should throw error', async (event: unknown) => {
    expect.hasAssertions();

    const request = {
      event,
    } as ConsumeSquadReportProcessMessagesRequest;
    let error: unknown;
    const executeMock = jest.fn();
    setupProcessProcessSquadReportUseCaseMock(executeMock);

    try {
      await sut.execute(request);
    } catch (e) {
      error = e;
    }

    const knownError = error as Error;

    expect(knownError).toBeDefined();
    expect(knownError.message).toContain('event');
    expect(executeMock).not.toHaveBeenCalled();
  });
});

describe('request is valid', () => {
  it('error on ProcessSquadReportUseCase then should throw error', async () => {
    expect.hasAssertions();

    const event = buildSnsEvent();
    const request = {
      event,
    } as ConsumeSquadReportProcessMessagesRequest;
    let error: unknown;
    const executeMock = jest.fn();
    setupProcessProcessSquadReportUseCaseMock(executeMock);
    executeMock.mockRejectedValue(new Error());

    try {
      await sut.execute(request);
    } catch (e) {
      error = e as Error;
    }

    expect(error).toBeDefined();
    expect(executeMock).toHaveBeenCalledTimes(1);
  });

  it('processSquadReportUseCase execute with success then should return void', async () => {
    expect.hasAssertions();

    const event = buildSnsEvent();
    const request = {
      event,
    } as ConsumeSquadReportProcessMessagesRequest;
    const executeMock = jest.fn();
    setupProcessProcessSquadReportUseCaseMock(executeMock);

    await sut.execute(request);

    expect(executeMock).toHaveBeenCalledTimes(1);
  });
});
