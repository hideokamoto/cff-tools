import { FunctionEventObject } from 'aws-sdk/clients/cloudfront';
import {
  FunctionRequest,
  TestResponseEvent,
  RequestMethod,
  Headers,
  Cookies,
  QueryString,
  RequestContext,
  FunctionResposne,
} from '../interfaces';
import { TestResponseEventBuilder } from './interface';

/**
 * Create viewer-request test event factory
 */
export class TestResponseEventFactory {
  public static create(): TestResponseEventBuilder {
    const event: TestResponseEvent = {
      version: '1.0',
      context: {
        eventType: 'viewer-response',
      },
      viewer: {
        ip: '',
      },
      request: {
        method: 'GET',
        uri: '/index.html',
        querystring: {},
        headers: {},
        cookies: {},
      },
      response: {
        statusCode: 200,
        statusDescription: 'OK',
        headers: {},
        cookies: {},
      },
    };
    return {
      setRequestContext(context: RequestContext) {
        event.context = {
          ...event.context,
          ...context,
        };
        return this;
      },
      setViewerIP(ip: string) {
        event.viewer.ip = ip;
        return this;
      },
      setRequestMethod(method: RequestMethod) {
        event.request.method = method;
        return this;
      },
      setRequestUri(uri: string) {
        event.request.uri = uri;
        return this;
      },
      setRequestQuerystring(querystring: QueryString) {
        event.request.querystring = querystring;
        return this;
      },
      setRequestHeaders(headers: Headers) {
        event.request.headers = headers;
        return this;
      },
      setRequestCookies(cookies: Cookies) {
        event.request.cookies = cookies;
        return this;
      },
      setRequest(request: FunctionRequest) {
        event.request = request;
        return this;
      },
      setResponseStatusDescription(description: string) {
        event.response.statusDescription = description;
        return this;
      },
      setResponseHeaders(headers: Headers) {
        event.response.headers = headers;
        return this;
      },
      setResponseCookies(cookies: Cookies) {
        event.response.cookies = cookies;
        return this;
      },
      setResponseStatusCode(code: number) {
        event.response.statusCode = code;
        return this;
      },
      setResponse(response: FunctionResposne) {
        event.response = response;
        return this;
      },
      getEvent(): TestResponseEvent {
        return event;
      },
      getEventObject(): FunctionEventObject {
        return JSON.stringify(event);
      },
    };
  }
}
