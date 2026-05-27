import { Logger } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';
import { Observable, of, throwError } from 'rxjs';

const mockResponse = { statusCode: 200 };

const mockExecutionContext = {
  switchToHttp: jest.fn().mockReturnValue({
    getRequest: jest.fn().mockReturnValue({ method: 'GET', url: '/test' }),
    getResponse: jest.fn().mockReturnValue(mockResponse),
  }),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createCallHandler = (observable: Observable<any>) => ({
  handle: jest.fn().mockReturnValue(observable),
});

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    interceptor = new LoggingInterceptor();
    mockExecutionContext.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({ method: 'GET', url: '/test' }),
      getResponse: jest.fn().mockReturnValue({ statusCode: 200 }),
    });
  });

  it('retorna o observable do next.handle()', (done) => {
    const callHandler = createCallHandler(of({ data: 'ok' }));
    const result = interceptor.intercept(mockExecutionContext as any, callHandler as any);

    result.subscribe({
      next: (value) => {
        expect(value).toEqual({ data: 'ok' });
        done();
      },
    });
  });

  it('loga request com status 200 (2xx — log normal)', (done) => {
    mockExecutionContext.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({ method: 'GET', url: '/producers' }),
      getResponse: jest.fn().mockReturnValue({ statusCode: 200 }),
    });
    const callHandler = createCallHandler(of({}));
    const result = interceptor.intercept(mockExecutionContext as any, callHandler as any);
    result.subscribe({ next: () => done() });
  });

  it('loga request com status 404 (4xx — warn)', (done) => {
    mockExecutionContext.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({ method: 'GET', url: '/nonexistent' }),
      getResponse: jest.fn().mockReturnValue({ statusCode: 404 }),
    });
    const callHandler = createCallHandler(of({}));
    const result = interceptor.intercept(mockExecutionContext as any, callHandler as any);
    result.subscribe({ next: () => done() });
  });

  it('loga request com status 500 (5xx — error)', (done) => {
    mockExecutionContext.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({ method: 'POST', url: '/farms' }),
      getResponse: jest.fn().mockReturnValue({ statusCode: 500 }),
    });
    const callHandler = createCallHandler(of({}));
    const result = interceptor.intercept(mockExecutionContext as any, callHandler as any);
    result.subscribe({ next: () => done() });
  });

  it('loga erro quando o observable falha', (done) => {
    const callHandler = createCallHandler(throwError(() => new Error('Unexpected')));
    const result = interceptor.intercept(mockExecutionContext as any, callHandler as any);
    result.subscribe({
      error: () => done(),
    });
  });
});
