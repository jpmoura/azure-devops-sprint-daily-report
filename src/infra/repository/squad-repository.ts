import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import SquadConfiguration from '../../domain/model/squad-configuration';
import { DynamoDBDocumentClient } from '../aws-provider';

export default class SquadConfigurationRepository {
  private readonly client = DynamoDBDocumentClient();

  private readonly tableName = `${process.env.DYNAMO_TABLE_PREFIX}.SquadConfiguration`;

  async list(onlyActive?: boolean): Promise<Array<SquadConfiguration>> {
    const params: DocumentClient.ScanInput = {
      TableName: this.tableName,
    };

    if (onlyActive) {
      params.ExpressionAttributeNames = { '#isActive': 'isActive' };
      params.ExpressionAttributeValues = { ':isActive': onlyActive };
      params.FilterExpression = '#isActive = :isActive';
    }

    const response = await this.client.scan(params).promise();

    return response.Items as Array<SquadConfiguration>;
  }
}
