import { mocked, MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import SquadConfigurationDto from '../../src/domain/interface/squad-configuration-dto';
import SquadConfigurationRepository from '../../src/infra/repository/squad-configuration-repository';
import TopicRepository from '../../src/infra/repository/topic-repository';
import ProduceReportProcessMessagesUseCase from '../../src/use-case/produce-report-process-messages-use-case';

function setupTopicRepositoryMock(publishMock: jest.Mock<any, any>): MockedObjectDeep<typeof TopicRepository> {
  const topicRepositoryMock = mocked(TopicRepository, true);

  topicRepositoryMock.prototype.publish = publishMock;

  return topicRepositoryMock;
}

function setupSquadConfigurationRepositoryMock(listMock: jest.Mock<any, any>): MockedObjectDeep<typeof SquadConfigurationRepository> {
  const squadConfigurationRepositoryMock = mocked(SquadConfigurationRepository, true);

  squadConfigurationRepositoryMock.prototype.list = listMock;

  return squadConfigurationRepositoryMock;
}

const sut = new ProduceReportProcessMessagesUseCase();

describe('execute', () => {
  it('there are squad configurations to send then should publish message successfully and return void', async () => {
    expect.hasAssertions();

    const listMock = jest.fn();
    const publishMock = jest.fn();
    setupSquadConfigurationRepositoryMock(listMock);
    setupTopicRepositoryMock(publishMock);
    listMock.mockResolvedValue([{} as SquadConfigurationDto]);

    await sut.execute();

    expect(listMock).toHaveBeenCalledTimes(1);
    expect(publishMock).toHaveBeenCalledTimes(1);
  });

  it('there are no squad configurations to send then should not publish any message and return void', async () => {
    expect.hasAssertions();

    const listMock = jest.fn();
    const publishMock = jest.fn();
    setupSquadConfigurationRepositoryMock(listMock);
    setupTopicRepositoryMock(publishMock);
    listMock.mockResolvedValue([]);

    await sut.execute();

    expect(listMock).toHaveBeenCalledTimes(1);
    expect(publishMock).toHaveBeenCalledTimes(0);
  });
});
