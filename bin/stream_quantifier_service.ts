#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { StreamQuantifierServiceStack } from '../lib/stream_quantifier_service-stack';

const app = new cdk.App();
new StreamQuantifierServiceStack(app, 'StreamQuantifierServiceStack', {
  
  // env: { account: '317551985763', region: 'us-east-1' },

});