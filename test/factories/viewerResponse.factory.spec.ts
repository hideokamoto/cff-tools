import {
    TestResponseEventFactory,
} from '../../src/factories/viewerResponse.factory'

describe('factories/viewerResponse.factory.ts', () => {
    describe('TestResponseEventFactory', () => {
        it('should return default event json', () => {
            const builder = TestResponseEventFactory.create()
            expect(builder.getEventObject()).toEqual(JSON.stringify({
                version: '1.0',
                context: {
                    eventType: 'viewer-response'
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
                },
                response: {
                    statusCode: 200,
                    statusDescription: 'OK',
                    headers: {},
                    cookies: {}
                }
            }))
        })
        it('should match snapshot', () => {
            const builder = TestResponseEventFactory.create()
            builder.setViewerIP('127.0.0.0')
                .setRequestMethod('POST')
                .setRequestUri('admin/index.html')
                .setRequestQuerystring({
                    test1: {
                        value: '123'
                    },
                    test2: {
                        value: '222',
                        multiValue: [{
                            value: '222'
                        }, {
                            value: '333'
                        }]
                    }
                })
                .setRequestHeaders({
                    host: {
                        value: "www.example.com"
                    },
                    accept: {
                        value: "text/html",
                        multiValue: [
                            {
                                value: "text/html"
                            },
                            {
                                value: "application/xhtml+xml"
                            }
                        ]
                    }
                })
                .setRequestCookies({
                    id: {
                        value: "CookieIdValue"
                    },
                    loggedIn: {
                        value: "false"
                    }
                })
                .setResponseCookies({
                    "id": {
                        "value": "a3fWa",
                        "attributes": "Expires=Wed, 05 Jan 2024 07:28:00 GMT",
                        "multiValue": [
                            {
                                "value": "a3fWa",
                                "attributes": "Expires=Wed, 05 Jan 2024 07:28:00 GMT"
                            },
                            {
                                "value": "a3fWb"
                            }
                        ]
                    },
                    "loggedIn": {
                        "value": "true",
                        "attributes": "Secure; Path=/; Domain=Example.com; Expires=Wed, 05 Jan 2024 07:28:00 GMT"
                    }
                })
                .setResponseHeaders({
                    "server": {
                        "value": "CustomOriginServer"
                    },
                    "content-type": {
                        "value": "text/html; charset=UTF-8"
                    },
                    "content-length": {
                        "value": "9593"
                    }
                })
                .setResponseStatusCode(404)
                .setResponseStatusDescription('Not Found')
                
                
            expect(builder.getEvent()).toMatchSnapshot()
        })
    })
})