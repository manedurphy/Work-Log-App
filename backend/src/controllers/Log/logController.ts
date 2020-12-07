import customJwtManager from '../JWT/jwtController';
import { LogServices } from './logServices';
import { ISecureRequest } from '@overnightjs/jwt';
import { Response } from 'express';
import { HTTPResponse } from '../HTTP/httpResponses';
import { Logger } from '@overnightjs/logger';
import { Get, Controller, Middleware, Delete, Put } from '@overnightjs/core';
import {
  AlertResponse,
  LogHttpResponseMessage,
  TaskHttpResponseMessages,
} from '../HTTP/httpEnums';
import { ProductivityServices } from '../Productivity/ProductivityServices';
import { RevisedTaskServices } from '../Task/revisedTaskServices';

@Controller('api/log')
export class LogController {
  @Get('task/:projectNumber')
  @Middleware(customJwtManager.middleware)
  private async getLogOfSingleTask(req: ISecureRequest, res: Response) {
    try {
      const taskService = new RevisedTaskServices(
        +req.payload.id,
        +req.params.projectNumber
      );

      const task = await taskService.getTask();

      if (task) {
        const taskLog = await LogServices.getLog(
          +req.params.projectNumber,
          task.id
        );

        HTTPResponse.OK(res, taskLog);
      }
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }

  @Get(':id')
  @Middleware(customJwtManager.middleware)
  private async getSingleLogItem(req: ISecureRequest, res: Response) {
    try {
      const taskLogItem = await LogServices.getTaskLogItem(+req.params.id);

      if (!taskLogItem)
        return HTTPResponse.notFound(
          res,
          TaskHttpResponseMessages.TASK_NOT_FOUND,
          AlertResponse.ERROR
        );

      HTTPResponse.OK(res, taskLogItem);
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }

  @Delete(':id')
  @Middleware(customJwtManager.middleware)
  private async deleteTaskLogItem(req: ISecureRequest, res: Response) {
    try {
      const taskLogItem = await LogServices.getTaskLogItem(+req.params.id);
      if (!taskLogItem)
        return HTTPResponse.notFound(
          res,
          TaskHttpResponseMessages.TASK_NOT_FOUND,
          AlertResponse.ERROR
        );

      await LogServices.deleteTaskLogItem(taskLogItem);
      HTTPResponse.okWithMessage(
        res,
        LogHttpResponseMessage.LOG_DELETED,
        AlertResponse.WARNING
      );
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }

  @Put(':id')
  @Middleware(customJwtManager.middleware)
  private async updateTaskLogItem(req: ISecureRequest, res: Response) {
    Logger.Info(req.body, true);
    try {
      const taskLogItem = await LogServices.getTaskLogItem(+req.params.id);
      if (!taskLogItem)
        return HTTPResponse.notFound(
          res,
          TaskHttpResponseMessages.TASK_NOT_FOUND,
          AlertResponse.ERROR
        );

      await LogServices.updateTaskLog(req, taskLogItem);

      const logs = await LogServices.getLatestLogs(taskLogItem.TaskId);

      const productivity = new ProductivityServices(
        logs[1].hoursRemaining - logs[0].hoursRemaining,
        logs[0].id,
        logs[0].loggedAt
      );

      await productivity.update();

      HTTPResponse.okWithMessage(
        res,
        LogHttpResponseMessage.LOG_UPDATED,
        AlertResponse.UPDATE
      );
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }
}
