import faker from 'faker';
import { mocked } from 'ts-jest/utils';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import BuildDailyReportRequest from '../../src/domain/use-case/request/build-daily-report-request';
import AzureDevOpsRepository from '../../src/infra/repository/azure-dev-ops-repository';
import BuildDailyReportUseCase from '../../src/use-case/build-daily-report-use-case';

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

    try {
      await sut.execute(request);
    } catch (e) {
      error = e;
    }

    const knowError = error as Error;

    expect(knowError).toBeDefined();
    expect(knowError.message).toContain('hasCustomBurndown');
    expect(getCurrentSprintMock).not.toHaveBeenCalled();
    expect(getIterationBacklogMock).not.toHaveBeenCalled();
    expect(getIterationBurndownMock).not.toHaveBeenCalled();
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

    try {
      await sut.execute(request);
    } catch (e) {
      error = e;
    }

    const knowError = error as Error;

    expect(knowError).toBeDefined();
    expect(knowError.message).toContain('projectName');
    expect(getCurrentSprintMock).not.toHaveBeenCalled();
    expect(getIterationBacklogMock).not.toHaveBeenCalled();
    expect(getIterationBurndownMock).not.toHaveBeenCalled();
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

    try {
      await sut.execute(request);
    } catch (e) {
      error = e;
    }

    const knowError = error as Error;

    expect(knowError).toBeDefined();
    expect(knowError.message).toContain('teamName');
    expect(getCurrentSprintMock).not.toHaveBeenCalled();
    expect(getIterationBacklogMock).not.toHaveBeenCalled();
    expect(getIterationBurndownMock).not.toHaveBeenCalled();
  });
});
