import { response } from 'express';

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
};

const sendResponse = <T>(res: response, data: TResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data.success,
    message: data?.message,
    statusCode: data?.statusCode,
    data: data?.data,
  });
};

export default sendResponse;
