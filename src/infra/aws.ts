import * as _AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk-core';

const IS_LOCAL = !!process.env.IS_OFFLINE || process.env.IS_LOCAL === 'true';
const AWS = IS_LOCAL ? _AWS : AWSXRay.captureAWS(_AWS);

export { IS_LOCAL, AWS };
