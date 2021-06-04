import { FunctionEventObject } from 'aws-sdk/clients/cloudfront'
import {
    FunctionRequest,
    TestRequestEvent,
    RequestMethod,
    Headers,
    Cookies,
    QueryString,
} from '../interfaces'
import {
    TestRequestEventBuilder
} from './interface'

/**
 * Create viewer-request test event factory
 */
export class TestRequestEventFactory {
    public static create(): TestRequestEventBuilder {
        const event: TestRequestEvent = {
            version: '1.0',
            context: {
                eventType: 'viewer-request'
            },
            viewer: {
                ip: ''
            },
            request: {
                method: 'GET',
                uri: '/index.html',
                querystring: {},
                headers: {},
                cookies: {}
            }
        }
        return {
            setViewerIP(ip: string) {
                event.viewer.ip = ip
                return this
            },
            setRequestMethod(method: RequestMethod) {
                event.request.method = method
                return this
            },
            setRequestUri(uri: string) {
                event.request.uri = uri
                return this
            },
            setRequestQuerystring(querystring: QueryString) {
                event.request.querystring = querystring
                return this
            },
            setRequestHeaders(headers: Headers) {
                event.request.headers = headers
                return this
            },
            setRequestCookies(cookies: Cookies) {
                event.request.cookies = cookies
                return this
            },
            setRequest(request: FunctionRequest) {
                event.request = request
                return this
            },
            getEvent(): TestRequestEvent {
                return event
            },
            getEventObject(): FunctionEventObject {
                return JSON.stringify(event)
            }
        }
    }
}