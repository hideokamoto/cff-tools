import { CloudFront } from 'aws-sdk';
import {
  CreateFunctionRequest,
  DeleteFunctionRequest,
  DescribeFunctionRequest,
  FunctionBlob,
  FunctionEventObject,
  PublishFunctionRequest,
  TestFunctionRequest,
  UpdateFunctionRequest,
} from 'aws-sdk/clients/cloudfront';
import { readFileSync } from 'fs';
import { FunctionStage } from './interfaces';

export type CloudFrontFunctionRuntime = 'cloudfront-js-1.0';
export interface FunctionProps {
  name: string;
  runtime: CloudFrontFunctionRuntime;
}
export interface FunctionOptions {
  comment?: string;
  etag?: string;
  functionFilePath?: string;
}

export class Function {
  private readonly client: CloudFront = new CloudFront();
  public readonly name: string;
  public readonly runtime: CloudFrontFunctionRuntime;
  private options: Required<FunctionOptions> = {
    comment: '',
    etag: '',
    functionFilePath: '',
  };

  private inlineCode: FunctionBlob = '';

  constructor(
    props: FunctionProps,
    options?: FunctionOptions & {
      client?: CloudFront;
    }
  ) {
    this.name = props.name;
    this.runtime = props.runtime;
    if (options) {
      if (options.comment) this.options.comment = options.comment;
      if (options.functionFilePath)
        this.options.functionFilePath = options.functionFilePath;
      if (options.client) this.client = options.client;
    }
  }

  private _getFunctionCode(): FunctionBlob {
    if (this.options.functionFilePath) {
      return readFileSync(this.options.functionFilePath);
    }
    return this.inlineCode;
  }

  public setEtag(etag: string) {
    this.options.etag = etag;
    return this;
  }

  public putCodeFilePath(path: string) {
    this.options.functionFilePath = path;
    return this;
  }

  public putInlineCode(code: FunctionBlob) {
    this.inlineCode = code;
    return this;
  }

  public async deleteFunction(etag?: string) {
    const request: DeleteFunctionRequest = {
      Name: this.name,
      IfMatch: etag || this.options.etag,
    };
    const result = await this.client.deleteFunction(request).promise();
    this.setEtag('');
    return result;
  }

  public async describeFunction(stage: FunctionStage = 'DEVELOPMENT') {
    const request: DescribeFunctionRequest = {
      Name: this.name,
      Stage: stage,
    };
    const result = await this.client.describeFunction(request).promise();
    if (result.ETag) this.setEtag(result.ETag);
    return result;
  }

  public updateFunction(etag?: string) {
    const request: UpdateFunctionRequest = {
      Name: this.name,
      FunctionConfig: {
        Runtime: this.runtime,
        Comment: this.options.comment,
      },
      FunctionCode: this._getFunctionCode(),
      IfMatch: etag || this.options.etag,
    };
    return this.client.updateFunction(request).promise();
  }

  public async createFunction() {
    const request: CreateFunctionRequest = {
      Name: this.name,
      FunctionConfig: {
        Runtime: this.runtime,
        Comment: this.options.comment,
      },
      FunctionCode: this._getFunctionCode(),
    };
    const result = await this.client.createFunction(request).promise();
    if (result.ETag) this.setEtag(result.ETag);
    return result;
  }

  public async testFunction(
    event: FunctionEventObject,
    stage: FunctionStage = 'DEVELOPMENT'
  ) {
    const request: TestFunctionRequest = {
      Name: this.name,
      IfMatch: this.options.etag,
      Stage: stage,
      EventObject: event,
    };
    const result = await this.client.testFunction(request).promise();
    return result;
  }

  public async publishFunction(etag?: string) {
    const request: PublishFunctionRequest = {
      Name: this.name,
      IfMatch: etag || this.options.etag,
    };
    const result = await this.client.publishFunction(request).promise();
    return result;
  }
}
