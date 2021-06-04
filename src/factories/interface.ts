import { FunctionEventObject } from 'aws-sdk/clients/cloudfront'
import {
    FunctionRequest,
    TestRequestEvent,
    RequestMethod,
    Headers,
    Cookies,
    QueryString,
    FunctionResposne,
} from '../interfaces'

export interface TestEventBuilder {
    getEvent(): TestRequestEvent
    getEventObject(): FunctionEventObject
}
export interface TestRequestEventBuilder extends TestEventBuilder {
    setViewerIP(ip: string): TestRequestEventBuilder
    setRequestMethod(method: RequestMethod) : TestRequestEventBuilder
    setRequestUri(uri: string):TestRequestEventBuilder
    setRequestQuerystring(querystring: QueryString):TestRequestEventBuilder
    setRequestHeaders(headers: Headers) :TestRequestEventBuilder
    setRequestCookies(cookies: Cookies):TestRequestEventBuilder
    setRequest(request: FunctionRequest):TestRequestEventBuilder
}

export interface TestResponseEventBuilder extends TestEventBuilder {
    setViewerIP(ip: string): TestResponseEventBuilder
    setRequestMethod(method: RequestMethod) : TestResponseEventBuilder
    setRequestUri(uri: string):TestResponseEventBuilder
    setRequestQuerystring(querystring: QueryString):TestResponseEventBuilder
    setRequestHeaders(headers: Headers) :TestResponseEventBuilder
    setRequestCookies(cookies: Cookies):TestResponseEventBuilder
    setRequest(request: FunctionRequest):TestResponseEventBuilder
    setResponseStatusDescription(description: string): TestResponseEventBuilder
    setResponseHeaders(headers: Headers):TestResponseEventBuilder
    setResponseCookies(cookies: Cookies):TestResponseEventBuilder
    setResponseStatusCode(code: number):TestResponseEventBuilder
    setResponse(response: FunctionResposne):TestResponseEventBuilder
}