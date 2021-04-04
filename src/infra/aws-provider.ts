import { IS_LOCAL, AWS } from './aws';

export const DynamoDBDocumentClient = () => {
  if (IS_LOCAL) {
    return new AWS.DynamoDB.DocumentClient({
      region: `${process.env.AWS_REGION}`,
      endpoint: `${process.env.DYNAMO_PREFIX_ENDPOINT}`,
      credentials: {
        accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
        secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
      },
    });
  }

  return new AWS.DynamoDB.DocumentClient();
};

export const SNSClient = () => {
  if (IS_LOCAL) {
    return new AWS.SNS({
      region: `${process.env.AWS_REGION}`,
      endpoint: `${process.env.SNS_ENDPOINT}`,
    });
  }

  return new AWS.SNS();
};

export const TopicArn = (): string => {
  if (IS_LOCAL) {
    return `arn:aws:sns:us-east-1:123456789012:${process.env.SNS_SQS_PREFIX}`;
  }

  return `${process.env.TOPIC_ARN}`;
};
