import { Controller, Middleware, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { ISecureRequest } from '@overnightjs/jwt';
import { Logger } from '@overnightjs/logger';
import customJwtManager from './jwtController';
import { User, Task } from '../models/models';

@Controller('api/archive')
export class Archive {
  private serverError = (res: Response) =>
    res.status(500).json({ message: 'Internal Server Error' });

  @Get('')
  @Middleware(customJwtManager.middleware)
  private async getCompletedTasks(req: ISecureRequest, res: Response) {
    try {
      const userCompletedTasks = await Task.findAll({
        where: { UserId: req.payload.id, complete: true },
      });

      res.status(200).json(userCompletedTasks);
    } catch (error) {
      this.serverError(res);
    }
  }
}
