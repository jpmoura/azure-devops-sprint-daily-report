import * as Eta from 'eta';
import { promises as fs } from 'fs';
import faker from 'faker';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import CreateHtmlRequest from '../../domain/use-case/request/create-html-request';
import CreateHtmlUseCase from '../../use-case/create-html-use-case';

function setupEtaMock(renderFileAsyncMock: jest.Mock<any, any>): MockedObjectDeep<typeof Eta> {
  const etaMock = mocked(Eta, true);

  etaMock.renderFileAsync = renderFileAsyncMock;

  return etaMock;
}

function setFsPromisesMock(writeFileMock: jest.Mock<any, any>): MockedObjectDeep<typeof fs> {
  const fsMock = mocked(fs, true);

  fsMock.writeFile = writeFileMock;

  return fsMock;
}

const sut = new CreateHtmlUseCase();

describe('request is invalid', () => {
  it.each([
    [undefined],
    [null],
    [[]],
  ])('backlog is %p then should throw error', async (backlog: unknown) => {
    expect.hasAssertions();

    const request = {
      backlog,
      burndown: faker.image.image(),
      iteration: {},
    } as CreateHtmlRequest;
    let error: unknown;
    const renderFileAsyncMock = jest.fn();
    const writeFileMock = jest.fn();
    setupEtaMock(renderFileAsyncMock);
    setFsPromisesMock(writeFileMock);

    try {
      await sut.execute(request);
    } catch (e) {
      error = e;
    }

    const knownError = error as Error;
    expect(knownError).toBeDefined();
    expect(knownError.message).toContain('backlog');
    expect(renderFileAsyncMock).not.toHaveBeenCalled();
    expect(writeFileMock).not.toHaveBeenCalled();
  });

  it.each([
    [undefined],
    [null],
    [''],
    [' '],
  ])('burndown is %p then should throw error', async (burndown: unknown) => {
    expect.hasAssertions();

    const request = {
      backlog: [{}],
      burndown,
      iteration: {},
    } as CreateHtmlRequest;
    let error: unknown;
    const renderFileAsyncMock = jest.fn();
    const writeFileMock = jest.fn();
    setupEtaMock(renderFileAsyncMock);
    setFsPromisesMock(writeFileMock);

    try {
      await sut.execute(request);
    } catch (e) {
      error = e;
    }

    const knownError = error as Error;
    expect(knownError).toBeDefined();
    expect(knownError.message).toContain('burndown');
    expect(renderFileAsyncMock).not.toHaveBeenCalled();
    expect(writeFileMock).not.toHaveBeenCalled();
  });

  it.each([
    [undefined],
    [null],
  ])('iteration is %p then should throw error', async (iteration: unknown) => {
    expect.hasAssertions();

    const request = {
      backlog: [{}],
      burndown: faker.image.image(),
      iteration,
    } as CreateHtmlRequest;
    let error: unknown;
    const renderFileAsyncMock = jest.fn();
    const writeFileMock = jest.fn();
    setupEtaMock(renderFileAsyncMock);
    setFsPromisesMock(writeFileMock);

    try {
      await sut.execute(request);
    } catch (e) {
      error = e;
    }

    const knownError = error as Error;
    expect(knownError).toBeDefined();
    expect(knownError.message).toContain('iteration');
    expect(renderFileAsyncMock).not.toHaveBeenCalled();
    expect(writeFileMock).not.toHaveBeenCalled();
  });
});

describe('request is valid', () => {
  it('eta could not render template then should throw error', async () => {
    expect.hasAssertions();

    const request = {
      backlog: [{}],
      burndown: faker.image.image(),
      iteration: {},
    } as CreateHtmlRequest;
    let error: unknown;
    const renderFileAsyncMock = jest.fn();
    const writeFileMock = jest.fn();
    setupEtaMock(renderFileAsyncMock);
    setFsPromisesMock(writeFileMock);

    try {
      await sut.execute(request);
    } catch (e) {
      error = e;
    }

    const knownError = error as Error;
    expect(knownError).toBeDefined();
    expect(knownError.message).toContain('Error while generating report!');
    expect(renderFileAsyncMock).toHaveBeenCalledTimes(1);
    expect(writeFileMock).not.toHaveBeenCalled();
  });

  it('template is rendered successfully then should return report', async () => {
    expect.hasAssertions();

    const request = {
      backlog: [{}],
      burndown: faker.image.image(),
      iteration: {},
    } as CreateHtmlRequest;
    const renderFileAsyncMock = jest.fn();
    const writeFileMock = jest.fn();
    setupEtaMock(renderFileAsyncMock);
    setFsPromisesMock(writeFileMock);
    renderFileAsyncMock.mockResolvedValue(faker.datatype.string());

    const response = await sut.execute(request);

    expect(response).toBeDefined();
    expect(response.html).toBeDefined();
    expect(renderFileAsyncMock).toHaveBeenCalledTimes(1);
    expect(writeFileMock).not.toHaveBeenCalled();
  });

  it('is debug mode then should write report in disk and return it', async () => {
    expect.hasAssertions();

    const request = {
      backlog: [{}],
      burndown: faker.image.image(),
      iteration: {},
    } as CreateHtmlRequest;
    const renderFileAsyncMock = jest.fn();
    const writeFileMock = jest.fn();
    setupEtaMock(renderFileAsyncMock);
    setFsPromisesMock(writeFileMock);
    renderFileAsyncMock.mockResolvedValue(faker.datatype.string());
    process.env.SLS_DEBUG = 'true';

    const response = await sut.execute(request);

    expect(response).toBeDefined();
    expect(response.html).toBeDefined();
    expect(renderFileAsyncMock).toHaveBeenCalledTimes(1);
    expect(writeFileMock).toHaveBeenCalledTimes(1);

    process.env.SLS_DEBUG = undefined;
  });
});
