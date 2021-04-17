import faker from 'faker';
import { mocked } from 'ts-jest/utils';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { TeamSettingsIteration } from 'azure-devops-node-api/interfaces/WorkInterfaces';
import BuildDailyReportRequest from '../../src/domain/use-case/request/build-daily-report-request';
import AzureDevOpsRepository from '../../src/infra/repository/azure-dev-ops-repository';
import BuildDailyReportUseCase from '../../src/use-case/build-daily-report-use-case';
import CreateHtmlUseCase from '../../src/use-case/create-html-use-case';
import CustomWorkItem from '../../src/domain/model/custom-work-item';
import CreateHtmlResponse from '../../src/domain/use-case/response/create-html-response';

function setupAzureDevOpvRepositoryMock(
  getCurrentSprintMock: jest.Mock<any, any> = jest.fn(),
  getIterationBacklogMock: jest.Mock<any, any> = jest.fn(),
  getIterationBurndownMock: jest.Mock<any, any> = jest.fn(),
): MockedObjectDeep<typeof AzureDevOpsRepository> {
  const azureDevOpsRepositoryMock = mocked(AzureDevOpsRepository, true);

  azureDevOpsRepositoryMock.prototype.getCurrentSprint = getCurrentSprintMock;
  azureDevOpsRepositoryMock.prototype.getIterationBacklog = getIterationBacklogMock;
  azureDevOpsRepositoryMock.prototype.getIterationBurndown = getIterationBurndownMock;

  return azureDevOpsRepositoryMock;
}

function setupCreateHtmlUseCase(executeMock: jest.Mock<any, any> = jest.fn()): MockedObjectDeep<typeof CreateHtmlUseCase> {
  const createHtmlUseCaseMock = mocked(CreateHtmlUseCase, true);

  createHtmlUseCaseMock.prototype.execute = executeMock;

  return createHtmlUseCaseMock;
}

const sut = new BuildDailyReportUseCase(faker.random.alphaNumeric(), faker.company.companyName(), faker.internet.userName(), faker.internet.password());

describe('request is invalid', () => {
  it.each([
    [undefined],
    [null],
  ])('hasCustomBurndown is %p then should throw error', async (hasCustomBurndown: unknown) => {
    expect.hasAssertions();

    const request = {
      hasCustomBurndown,
      projectName: faker.datatype.string(),
      teamName: faker.datatype.string(),
    } as BuildDailyReportRequest;
    let error: unknown;
    const getCurrentSprintMock = jest.fn();
    const getIterationBacklogMock = jest.fn();
    const getIterationBurndownMock = jest.fn();
    setupAzureDevOpvRepositoryMock(getCurrentSprintMock, getIterationBacklogMock, getIterationBurndownMock);
    const createHtmlUseCaseExecuteMock = jest.fn();
    setupCreateHtmlUseCase(createHtmlUseCaseExecuteMock);

    try {
      await sut.execute(request);
    } catch (e) {
      error = e;
    }

    const knownError = error as Error;

    expect(knownError).toBeDefined();
    expect(knownError.message).toContain('hasCustomBurndown');
    expect(getCurrentSprintMock).not.toHaveBeenCalled();
    expect(getIterationBacklogMock).not.toHaveBeenCalled();
    expect(getIterationBurndownMock).not.toHaveBeenCalled();
    expect(createHtmlUseCaseExecuteMock).not.toHaveBeenCalled();
  });

  it.each([
    [undefined],
    [null],
    [''],
    [' '],
  ])('projectName is %p then should throw error', async (projectName: unknown) => {
    expect.hasAssertions();

    const request = {
      hasCustomBurndown: faker.datatype.boolean(),
      projectName,
      teamName: faker.datatype.string(),
    } as BuildDailyReportRequest;
    let error: unknown;
    const getCurrentSprintMock = jest.fn();
    const getIterationBacklogMock = jest.fn();
    const getIterationBurndownMock = jest.fn();
    setupAzureDevOpvRepositoryMock(getCurrentSprintMock, getIterationBacklogMock, getIterationBurndownMock);
    const createHtmlUseCaseExecuteMock = jest.fn();
    setupCreateHtmlUseCase(createHtmlUseCaseExecuteMock);

    getCurrentSprintMock.mockResolvedValue(undefined);

    try {
      await sut.execute(request);
    } catch (e) {
      error = e;
    }

    const knownError = error as Error;

    expect(knownError).toBeDefined();
    expect(knownError.message).toContain('projectName');
    expect(getCurrentSprintMock).not.toHaveBeenCalled();
    expect(getIterationBacklogMock).not.toHaveBeenCalled();
    expect(getIterationBurndownMock).not.toHaveBeenCalled();
    expect(createHtmlUseCaseExecuteMock).not.toHaveBeenCalled();
  });

  it.each([
    [undefined],
    [null],
    [''],
    [' '],
  ])('teamName is %p then should throw error', async (teamName: unknown) => {
    expect.hasAssertions();

    const request = {
      hasCustomBurndown: faker.datatype.boolean(),
      projectName: faker.datatype.string(),
      teamName,
    } as BuildDailyReportRequest;
    let error: unknown;
    const getCurrentSprintMock = jest.fn();
    const getIterationBacklogMock = jest.fn();
    const getIterationBurndownMock = jest.fn();
    setupAzureDevOpvRepositoryMock(getCurrentSprintMock, getIterationBacklogMock, getIterationBurndownMock);
    const createHtmlUseCaseExecuteMock = jest.fn();
    setupCreateHtmlUseCase(createHtmlUseCaseExecuteMock);

    try {
      await sut.execute(request);
    } catch (e) {
      error = e;
    }

    const knownError = error as Error;

    expect(knownError).toBeDefined();
    expect(knownError.message).toContain('teamName');
    expect(getCurrentSprintMock).not.toHaveBeenCalled();
    expect(getIterationBacklogMock).not.toHaveBeenCalled();
    expect(getIterationBurndownMock).not.toHaveBeenCalled();
    expect(createHtmlUseCaseExecuteMock).not.toHaveBeenCalled();
  });
});

describe('request is valid', () => {
  it('current iteration not found then should throw error', async () => {
    expect.hasAssertions();
    const request: BuildDailyReportRequest = {
      hasCustomBurndown: faker.datatype.boolean(),
      projectName: faker.datatype.string(),
      teamName: faker.datatype.string(),
    };
    let error: unknown;
    const getCurrentSprintMock = jest.fn();
    const getIterationBacklogMock = jest.fn();
    const getIterationBurndownMock = jest.fn();
    setupAzureDevOpvRepositoryMock(getCurrentSprintMock, getIterationBacklogMock, getIterationBurndownMock);
    const createHtmlUseCaseExecuteMock = jest.fn();
    setupCreateHtmlUseCase(createHtmlUseCaseExecuteMock);

    try {
      await sut.execute(request);
    } catch (e) {
      error = e;
    }

    const knownError = error as Error;

    expect(knownError).toBeDefined();
    expect(knownError.message).toContain('No active iteration found');
    expect(getCurrentSprintMock).toHaveBeenCalledTimes(1);
    expect(getIterationBacklogMock).not.toHaveBeenCalled();
    expect(getIterationBurndownMock).not.toHaveBeenCalled();
    expect(createHtmlUseCaseExecuteMock).not.toHaveBeenCalled();
  });

  it('backlog is empty then should throw error', async () => {
    expect.hasAssertions();
    const request: BuildDailyReportRequest = {
      hasCustomBurndown: faker.datatype.boolean(),
      projectName: faker.datatype.string(),
      teamName: faker.datatype.string(),
    };
    let error: unknown;
    const getCurrentSprintMock = jest.fn();
    const getIterationBacklogMock = jest.fn();
    const getIterationBurndownMock = jest.fn();
    setupAzureDevOpvRepositoryMock(getCurrentSprintMock, getIterationBacklogMock, getIterationBurndownMock);
    const createHtmlUseCaseExecuteMock = jest.fn();
    setupCreateHtmlUseCase(createHtmlUseCaseExecuteMock);

    getCurrentSprintMock.mockResolvedValue({} as TeamSettingsIteration);
    getIterationBacklogMock.mockResolvedValue([]);

    try {
      await sut.execute(request);
    } catch (e) {
      error = e;
    }

    const knownError = error as Error;

    expect(knownError).toBeDefined();
    expect(knownError.message).toContain('Backlog size is equals to zero, therefore there\'s nothing to report.');
    expect(getCurrentSprintMock).toHaveBeenCalledTimes(1);
    expect(getIterationBacklogMock).toHaveBeenCalledTimes(1);
    expect(getIterationBurndownMock).not.toHaveBeenCalled();
    expect(createHtmlUseCaseExecuteMock).not.toHaveBeenCalled();
  });

  it('unable to fetch burndown image then should throw error', async () => {
    expect.hasAssertions();
    const request: BuildDailyReportRequest = {
      hasCustomBurndown: faker.datatype.boolean(),
      projectName: faker.datatype.string(),
      teamName: faker.datatype.string(),
    };
    let error: unknown;
    const getCurrentSprintMock = jest.fn();
    const getIterationBacklogMock = jest.fn();
    const getIterationBurndownMock = jest.fn();
    setupAzureDevOpvRepositoryMock(getCurrentSprintMock, getIterationBacklogMock, getIterationBurndownMock);
    const createHtmlUseCaseExecuteMock = jest.fn();
    setupCreateHtmlUseCase(createHtmlUseCaseExecuteMock);

    getCurrentSprintMock.mockResolvedValue({} as TeamSettingsIteration);
    getIterationBacklogMock.mockResolvedValue([{} as CustomWorkItem] as Array<CustomWorkItem>);

    try {
      await sut.execute(request);
    } catch (e) {
      error = e;
    }

    const knownError = error as Error;

    expect(knownError).toBeDefined();
    expect(knownError.message).toContain('Not able to fetch burndown image.');
    expect(getCurrentSprintMock).toHaveBeenCalledTimes(1);
    expect(getIterationBacklogMock).toHaveBeenCalledTimes(1);
    expect(getIterationBurndownMock).toHaveBeenCalledTimes(1);
    expect(createHtmlUseCaseExecuteMock).not.toHaveBeenCalled();
  });

  it('gathers all info then should generate report successfully', async () => {
    expect.hasAssertions();
    const request: BuildDailyReportRequest = {
      hasCustomBurndown: faker.datatype.boolean(),
      projectName: faker.datatype.string(),
      teamName: faker.datatype.string(),
    };
    const getCurrentSprintMock = jest.fn();
    const getIterationBacklogMock = jest.fn();
    const getIterationBurndownMock = jest.fn();
    setupAzureDevOpvRepositoryMock(getCurrentSprintMock, getIterationBacklogMock, getIterationBurndownMock);
    const createHtmlUseCaseExecuteMock = jest.fn();
    setupCreateHtmlUseCase(createHtmlUseCaseExecuteMock);

    getCurrentSprintMock.mockResolvedValue({ name: faker.datatype.string() } as TeamSettingsIteration);
    getIterationBacklogMock.mockResolvedValue([{} as CustomWorkItem] as Array<CustomWorkItem>);
    getIterationBurndownMock.mockResolvedValue(faker.image.image());
    createHtmlUseCaseExecuteMock.mockResolvedValue({ html: faker.datatype.string() } as CreateHtmlResponse);

    await sut.execute(request);

    expect(getCurrentSprintMock).toHaveBeenCalledTimes(1);
    expect(getIterationBacklogMock).toHaveBeenCalledTimes(1);
    expect(getIterationBurndownMock).toHaveBeenCalledTimes(1);
    expect(createHtmlUseCaseExecuteMock).toHaveBeenCalledTimes(1);
  });
});
