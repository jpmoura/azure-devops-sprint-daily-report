import SquadConfigurationDto from '../domain/interface/squad-configuration-dto';
import SquadConfigurationRepository from '../infra/repository/squad-repository';
import TopicRepository from '../infra/repository/topic-repository';

export default class ProduceReportProcessMessagesUseCase {
  private readonly topicRepository = new TopicRepository();

  private readonly squadConfigurationRepository = new SquadConfigurationRepository();

  async execute() {
    const promises: Array<Promise<void>> = [];
    const reportsToBuildAndSend = await this.squadConfigurationRepository.list(true);

    reportsToBuildAndSend.forEach((squadConfiguration) => {
      const publishPromise = this.topicRepository.publish(squadConfiguration as SquadConfigurationDto);
      promises.push(publishPromise);
    });

    await Promise.all(promises);
  }
}
