import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { Response } from 'express';

const makeHost = (res: Partial<Response>): ArgumentsHost => {
  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    ...res,
  } as unknown as Response;

  return {
    switchToHttp: jest.fn().mockReturnValue({
      getResponse: jest.fn().mockReturnValue(mockResponse),
    }),
  } as unknown as ArgumentsHost;
};

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
  });

  it('serializes a 404 NotFoundException to { error, message, status }', () => {
    const exception = new HttpException('Book not found', HttpStatus.NOT_FOUND);
    const jsonSpy = jest.fn();
    const statusSpy = jest.fn().mockReturnValue({ json: jsonSpy });
    const host = makeHost({ status: statusSpy, json: jsonSpy });

    filter.catch(exception, host);

    expect(statusSpy).toHaveBeenCalledWith(404);
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 404,
        error: 'Not Found',
        message: 'Book not found',
      }),
    );
  });

  it('serializes a 400 BadRequestException to { error, message, status }', () => {
    const exception = new HttpException(
      { message: ['title must not be empty', 'isbn must not be empty'], error: 'Bad Request', statusCode: 400 },
      HttpStatus.BAD_REQUEST,
    );
    const jsonSpy = jest.fn();
    const statusSpy = jest.fn().mockReturnValue({ json: jsonSpy });
    const host = makeHost({ status: statusSpy, json: jsonSpy });

    filter.catch(exception, host);

    const body = jsonSpy.mock.calls[0][0];
    expect(body.status).toBe(400);
    expect(body.error).toBe('Bad Request');
    expect(body.message).toContain('title must not be empty');
  });

  it('serializes a 409 ConflictException to { error, message, status }', () => {
    const exception = new HttpException('ISBN conflict', HttpStatus.CONFLICT);
    const jsonSpy = jest.fn();
    const statusSpy = jest.fn().mockReturnValue({ json: jsonSpy });
    const host = makeHost({ status: statusSpy, json: jsonSpy });

    filter.catch(exception, host);

    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 409, error: 'Conflict', message: 'ISBN conflict' }),
    );
  });

  it('serializes unexpected errors to 500 Internal Server Error', () => {
    const error = new Error('Something went wrong');
    const jsonSpy = jest.fn();
    const statusSpy = jest.fn().mockReturnValue({ json: jsonSpy });
    const host = makeHost({ status: statusSpy, json: jsonSpy });

    filter.catch(error, host);

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 500, error: 'Internal Server Error' }),
    );
  });

  it('joins array messages into a single string', () => {
    const exception = new HttpException(
      { message: ['field1 error', 'field2 error'] },
      HttpStatus.BAD_REQUEST,
    );
    const jsonSpy = jest.fn();
    const statusSpy = jest.fn().mockReturnValue({ json: jsonSpy });
    const host = makeHost({ status: statusSpy, json: jsonSpy });

    filter.catch(exception, host);

    const body = jsonSpy.mock.calls[0][0];
    expect(body.message).toBe('field1 error, field2 error');
  });
});
