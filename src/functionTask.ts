import { DescribeFunctionResult } from 'aws-sdk/clients/cloudfront';
import { TestEventBuilder } from './factories/interface';
import { Function } from './functions';
import { FunctionStage } from './interfaces';

export class FunctionTask {
  private readonly function: Function;
  constructor(targetFunction: Function) {
    this.function = targetFunction;
  }

  public async publish() {
    await this.function.describeFunction('DEVELOPMENT');
    const result = await this.function.publishFunction();
    return result;
  }

  public async runTest(builder: TestEventBuilder, stage: FunctionStage) {
    const event = builder.getEventObject();
    await this.function.describeFunction(stage);
    const { TestResult: result } = await this.function.testFunction(
      event,
      stage
    );
    if (result && result.FunctionErrorMessage) {
      throw new Error(result.FunctionErrorMessage);
    }
    return result;
  }

  /**
   * If function already deployed, will update it.
   * Or not, will create a new function.
   */
  public async putFunction(options?: { withPublish?: boolean }): Promise<void> {
    try {
      await this.function.describeFunction('DEVELOPMENT');
      await this.function.updateFunction();
      if (options && options.withPublish) {
        await this.publish();
      }
    } catch (e) {
      if (e.code === 'NoSuchFunctionExists') {
        await this.function.createFunction();
        return;
      }
      throw e;
    }
  }

  public async putAndGetFunction(options?: {
    withPublish?: boolean;
  }): Promise<DescribeFunctionResult> {
    await this.putFunction(options);
    return this.function.describeFunction('DEVELOPMENT');
  }
}
