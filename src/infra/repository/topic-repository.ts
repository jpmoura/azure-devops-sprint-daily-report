import { SNSClient, TopicArn } from '../aws-provider';

export default class TopicRepository {
  private readonly client = SNSClient();

  private readonly topicArn = TopicArn();

  async publish(payload: Object): Promise<void> {
    await this.client.publish({
      Message: JSON.stringify(payload),
      TopicArn: this.topicArn,
    }).promise();
  }
}
