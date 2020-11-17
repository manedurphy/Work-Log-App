import customJwtManager from '../JWT/jwtController';
import { Controller, Middleware, Get } from '@overnightjs/core';
import { Response } from 'express';
import { ISecureRequest } from '@overnightjs/jwt';
import { ArchiveServices } from './archiveServices';
import { HTTPResponse } from '../HTTP/httpResponses';

@Controller('api/archive')
export class Archive {
  @Get('')
  @Middleware(customJwtManager.middleware)
  private async getCompletedTasks(req: ISecureRequest, res: Response) {
    try {
      HTTPResponse.OK(
        res,
        await ArchiveServices.getCompletedTasks(+req.payload.id, true)
      );
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }
}
