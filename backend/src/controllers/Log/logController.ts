import customJwtManager from '../JWT/jwtController';
import { ISecureRequest } from '@overnightjs/jwt';
import { Response } from 'express';
import { HTTPResponse } from '../../constants/HTTP/httpResponses';
import { Logger } from '@overnightjs/logger';
import { Get, Controller, Middleware, Delete, Put } from '@overnightjs/core';
import {
  AlertResponse,
  LogHttpResponseMessage,
  TaskHttpResponseMessages,
} from '../../constants/HTTP/httpEnums';
import { ProductivityService } from '../../services/Productivity/ProductivityService';
import { TaskService } from '../../services/Task/TaskService';
import { LogService } from '../../services/Log/logService';

@Controller('api/log')
export class LogController {
  @Get('task/:projectNumber')
  @Middleware(customJwtManager.middleware)
  private async getLogOfSingleTask(req: ISecureRequest, res: Response) {
    try {
      const taskService = new TaskService(
        +req.payload.id,
        +req.params.projectNumber
      );

      const task = await taskService.getTask();

      if (task) {
        const logService = new LogService(task.id, +req.params.projectNumber);
        const taskLog = await logService.getLog();

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
      const logService = new LogService(+req.params.id);
      const taskLogItem = await logService.getLogItem();

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
      const logService = new LogService(+req.params.id);
      const taskLogItem = await logService.getLogItem();

      if (!taskLogItem)
        return HTTPResponse.notFound(
          res,
          TaskHttpResponseMessages.TASK_NOT_FOUND,
          AlertResponse.ERROR
        );

      await taskLogItem.destroy();
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
      const logService = new LogService(+req.params.id);
      const taskLogItem = await logService.getLogItem();
      if (!taskLogItem)
        return HTTPResponse.notFound(
          res,
          TaskHttpResponseMessages.TASK_NOT_FOUND,
          AlertResponse.ERROR
        );

      await logService.updateLogItem(req, taskLogItem);

      const logs = await logService.getLatestLogs(taskLogItem.TaskId);

      const productivity = new ProductivityService(
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
