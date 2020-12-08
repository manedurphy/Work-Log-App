import customJwtManager from '../JWT/jwtController';
import { Controller, Middleware, Get } from '@overnightjs/core';
import { Response } from 'express';
import { ISecureRequest } from '@overnightjs/jwt';
import { ArchiveService } from '../../services/Archive/archiveService';
import { HTTPResponse } from '../../constants/HTTP/httpResponses';

@Controller('api/archive')
export class Archive {
  @Get('')
  @Middleware(customJwtManager.middleware)
  private async getCompletedTasks(req: ISecureRequest, res: Response) {
    try {
      const archiveService = new ArchiveService(+req.payload.id, true);
      HTTPResponse.OK(res, await archiveService.getCompletedTasks());
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }
}
