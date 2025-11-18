# CloudFront Function management Tools (cff-tools)

> ⚠️ **This package is deprecated and no longer maintained.**
> 
> This package has been deprecated because AWS CDK L2 Constructs for CloudFront Functions have been available since 2021 and provide all the functionality that cff-tools offered, plus additional features like Distribution integration and Infrastructure as Code management. The official AWS CDK support ensures you always have access to the latest CloudFront features.
> 
> **Please migrate to AWS CDK L2 Constructs for CloudFront Functions.**
> 
> - [AWS CDK CloudFront Functions Documentation](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudfront.Function.html)
> - [AWS CDK CloudFront Module](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudfront-readme.html)

---

## Install

```bash
$ yarn add cff-tools

or

$ npm install --save cff-tools
```

## Define Function


### Inline code

```typesctipt
import { Function } from "cff-tools";


export const ViewerResponseFunction = new Function({
    name: 'ViewerResponseFunctionFromAPI',
    runtime: 'cloudfront-js-1.0'
  }
).putInlineCode(`
function handler(event) {
    var response = event.response;
    var headers = response.headers;

    // Set HTTP security headers
    // Since JavaScript doesn't allow for hyphens in variable names, we use the dict["key"] notation 
    headers['strict-transport-security'] = { value: 'max-age=63072000; includeSubdomains; preload'}; 
    headers['content-security-policy'] = { value: "default-src 'none'; img-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'"}; 
    headers['x-content-type-options'] = { value: 'nosniff'}; 
    headers['x-frame-options'] = {value: 'DENY'}; 
    headers['x-xss-protection'] = {value: '1; mode=block'}; 

    return response;
}
`)
```

### Import JavaScript file from path

```typescript
import { join } from 'path'
import { Function } from "cff-tools";

export const ViewerRequestFunction = new Function({
    name: 'ViewerRequestFunctionFromAPI',
    runtime: 'cloudfront-js-1.0'
  }, {
    functionFilePath: join(__dirname, '../functions/viewer_request.js')
  }
)
```

## Create/Update function

The `putFunction` method will create or update your CloudFront function.
When the defined function name exists, it will update.
If not, will create a new one.

```typescript
import { FunctionTask } from 'cff-tools'
import { ViewerResponseFunction } from './test'

(async () => {
  const cfFunction = new FunctionTask(ViewerResponseFunction)
  await cfFunction.putFunction()
})()
```

If you given `withPublish` attributes, the function will publish automatically.

```typescript
import { FunctionTask } from 'cff-tools'
import { ViewerResponseFunction } from './test'

(async () => {
  const cfFunction = new FunctionTask(ViewerResponseFunction)
  await cfFunction.putFunction({
    withPublish: true
  })
})()
```


## Publish function

If you already deployed the function, you can publish it by these script

```typescript
import { FunctionTask } from 'cff-tools'
import { ViewerResponseFunction } from './function'

(async () => {
  const cfFunction = new FunctionTask(ViewerResponseFunction)
  await cfFunction.publish()
})()
```

## E2E testing

We can test the funcion by using Jest and it.


```typescript

import { TestResponseEventFactory, FunctionTask } from 'cff-tools';
import { ViewerResponseFunction } from './function'

describe('e2e', () => {
  it('should put security headers', async () => {
    const task = new FunctionTask(ViewerResponseFunction);
    const event = TestResponseEventFactory.create();
    const result = await task.runTestToGetFunctionOutput(event, 'DEVELOPMENT');
    expect(result).toEqual({
      response: {
        headers: {
          'content-security-policy': {
            value:
              "default-src 'none'; img-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'",
          },
          'x-xss-protection': {
            value: '1; mode=block',
          },
          'x-content-type-options': {
            value: 'nosniff',
          },
          'x-frame-options': {
            value: 'DENY',
          },
          'strict-transport-security': {
            value: 'max-age=63072000; includeSubdomains; preload',
          },
        },
        statusDescription: 'OK',
        cookies: {},
        statusCode: 200,
      },
    });
  });
});

```


Or, we can get the native TestFunction API response by using `runTest` method instead.

```typescript

import { TestResponseEventFactory, FunctionTask } from 'cff-tools';
import { ViewerResponseFunction } from './function'

describe('e2e', () => {
  it('should put security headers', async () => {
    const task = new FunctionTask(ViewerResponseFunction);
    const event = TestResponseEventFactory.create();
    const result = await task.runTest(event, 'DEVELOPMENT');
    if (!result || !result.FunctionOutput) return;
    expect(JSON.parse(result.FunctionOutput)).toEqual({
      response: {
        headers: {
          'content-security-policy': {
            value:
              "default-src 'none'; img-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'",
          },
          'x-xss-protection': {
            value: '1; mode=block',
          },
          'x-content-type-options': {
            value: 'nosniff',
          },
          'x-frame-options': {
            value: 'DENY',
          },
          'strict-transport-security': {
            value: 'max-age=63072000; includeSubdomains; preload',
          },
        },
        statusDescription: 'OK',
        cookies: {},
        statusCode: 200,
      },
    });
  });
});

```
