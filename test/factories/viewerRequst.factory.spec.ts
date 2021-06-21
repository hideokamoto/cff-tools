import { TestRequestEventFactory } from '../../src/factories/viewerRequest.factory';

describe('factories/viewerRequest.factory.ts', () => {
  describe('TestRequestEventFactory', () => {
    it('should return default event json', () => {
      const builder = TestRequestEventFactory.create();
      expect(builder.getEventObject()).toEqual(
        JSON.stringify({
          version: '1.0',
          context: {
            eventType: 'viewer-request',
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
        })
      );
    });
    it('should match snapshot', () => {
      const builder = TestRequestEventFactory.create();
      builder
        .setRequestContext({
          distributionId: 'EXXX',
        })
        .setViewerIP('127.0.0.0')
        .setRequestMethod('POST')
        .setRequestUri('admin/index.html')
        .setRequestQuerystring({
          test1: {
            value: '123',
          },
          test2: {
            value: '222',
            multiValue: [
              {
                value: '222',
              },
              {
                value: '333',
              },
            ],
          },
        })
        .setRequestHeaders({
          host: {
            value: 'www.example.com',
          },
          accept: {
            value: 'text/html',
            multiValue: [
              {
                value: 'text/html',
              },
              {
                value: 'application/xhtml+xml',
              },
            ],
          },
        })
        .setRequestCookies({
          id: {
            value: 'CookieIdValue',
          },
          loggedIn: {
            value: 'false',
          },
        });
      expect(builder.getEvent()).toMatchSnapshot();
    });
  });
});
