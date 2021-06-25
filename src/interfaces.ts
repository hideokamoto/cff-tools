export type FunctionStage = 'DEVELOPMENT' | 'LIVE';
export type FunctionEventType = 'viewer-request' | 'viewer-response';
export type QueryString = {
  [key: string]: {
    value: string;
    multiValue?: Array<{
      value: string;
    }>;
  };
};
export type Headers = {
  [key: string]: {
    value: String;
    multiValue?: Array<{
      value: string;
    }>;
  };
};
export type Cookies = {
  [key: string]: {
    value: string;
    attributes?: string;
    multiValue?: Array<{
      value: string;
      attributes?: string;
    }>;
  };
};
export type RequestMethod = 'GET' | 'PUT' | 'DELETE' | 'POST' | 'OPTIONS';
export interface FunctionRequest {
  method: RequestMethod;
  uri: string;
  querystring: QueryString;
  headers: Headers;
  cookies: Cookies;
}

export interface FunctionResponse {
  statusDescription: string;
  headers: Headers;
  cookies: Cookies;
  statusCode: number;
}
export interface RequestContext {
  eventType: FunctionEventType;
  distributionId?: string;
}

export interface TestRequestEvent {
  version: string;
  context: RequestContext;
  viewer: {
    ip: string;
  };
  request: FunctionRequest;
}
export interface TestResponseEvent extends TestRequestEvent {
  response: FunctionResponse;
}
