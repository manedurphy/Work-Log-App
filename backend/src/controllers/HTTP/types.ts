import { Response } from 'express';

export type ResponseOnlyType = (res: Response) => Response;
export type ResponseOkType = (res: Response, data: object) => Response;
export type ResponseWithMessageType = (
  res: Response,
  message: string,
  type: string
) => Response;
