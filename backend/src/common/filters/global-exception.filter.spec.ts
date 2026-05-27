import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter';

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const mockArgumentsHost = {
  switchToHttp: jest.fn().mockReturnValue({
    getResponse: jest.fn().mockReturnValue(mockResponse),
  }),
};

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
    jest.clearAllMocks();
    mockArgumentsHost.switchToHttp.mockReturnValue({
      getResponse: jest.fn().mockReturnValue(mockResponse),
    });
  });

  it('trata HttpException com mensagem string', () => {
    const exception = new HttpException('Custom error message', HttpStatus.BAD_REQUEST);
    filter.catch(exception, mockArgumentsHost as any);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'Custom error message',
      }),
    );
  });

  it('trata NotFoundException (404) corretamente', () => {
    const exception = new NotFoundException('Recurso não encontrado');
    filter.catch(exception, mockArgumentsHost as any);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));
  });

  it('trata ConflictException (409) corretamente', () => {
    const exception = new ConflictException('Conflito de dados');
    filter.catch(exception, mockArgumentsHost as any);

    expect(mockResponse.status).toHaveBeenCalledWith(409);
  });

  it('trata UnprocessableEntityException (422) corretamente', () => {
    const exception = new UnprocessableEntityException('Área inválida');
    filter.catch(exception, mockArgumentsHost as any);

    expect(mockResponse.status).toHaveBeenCalledWith(422);
  });

  it('trata BadRequestException com objeto de response', () => {
    const exception = new BadRequestException({
      message: ['field is required'],
      error: 'Bad Request',
    });
    filter.catch(exception, mockArgumentsHost as any);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
  });

  it('trata erro genérico (não HttpException) com 500', () => {
    const exception = new Error('Unexpected DB failure');
    filter.catch(exception, mockArgumentsHost as any);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error',
      }),
    );
  });

  it('trata erro null/undefined sem lançar exceção', () => {
    filter.catch(null, mockArgumentsHost as any);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
  });
});
