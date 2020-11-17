import { Response } from 'express';

export type ResponseOnlyType = (res: Response) => Response;
export type ResponseOkType = (res: Response, data: object) => Response;
export type ResponseWithMessagetype = (
  res: Response,
  message: string
) => Response;
