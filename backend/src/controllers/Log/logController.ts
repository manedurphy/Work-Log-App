import customJwtManager from '../JWT/jwtController';
import { LogServices } from './logServices';
import { ISecureRequest } from '@overnightjs/jwt';
import { Response } from 'express';
import { TaskServices } from '../Task/taskServices';
import { HTTPResponse } from '../HTTP/httpResponses';
import { Get, Controller, Middleware, Delete, Put } from '@overnightjs/core';
import {
  AlertResponse,
  LogHttpResponseMessage,
  TaskHttpResponseMessages,
} from '../HTTP/httpEnums';

@Controller('api/log')
export class LogController {
  @Get('task/:projectNumber')
  @Middleware(customJwtManager.middleware)
  private async getLogOfSingleTask(req: ISecureRequest, res: Response) {
    try {
      const task = await TaskServices.getTask(
        +req.params.projectNumber,
        +req.payload.id
      );

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
      HTTPResponse.OKWithMessage(
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
    try {
      const taskLogItem = await LogServices.getTaskLogItem(+req.params.id);
      if (!taskLogItem)
        return HTTPResponse.notFound(
          res,
          TaskHttpResponseMessages.TASK_NOT_FOUND,
          AlertResponse.ERROR
        );

      const updatedTaskLogItem = TaskServices.createNewTask(req);
      await taskLogItem.update({
        ...updatedTaskLogItem,
        loggedAt: req.body.loggedAt,
        TaskId: +req.body.TaskId,
      });

      HTTPResponse.OKWithMessage(
        res,
        LogHttpResponseMessage.LOG_UPDATED,
        AlertResponse.UPDATE
      );
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }
}