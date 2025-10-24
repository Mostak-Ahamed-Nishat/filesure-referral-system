import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message = 'Success',
    statusCode: number = StatusCodes.OK
  ): Response {
    const response: IApiResponse<T> = { success: true, message, data };
    return res.status(statusCode).json(response);
  }

  static created<T>(
    res: Response,
    data: T,
    message = 'Resource created'
  ): Response {
    return this.success(res, data, message, StatusCodes.CREATED);
  }

  static noContent(res: Response): Response {
    return res.status(StatusCodes.NO_CONTENT).send();
  }

  static error(
    res: Response,
    message = 'Something went wrong',
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
    errors?: any[]
  ): Response {
    const response: IApiResponse = { success: false, message, errors };
    return res.status(statusCode).json(response);
  }
}
