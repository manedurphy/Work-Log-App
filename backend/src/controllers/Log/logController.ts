import customJwtManager from '../JWT/jwtController';
import { LogServices } from './logServices';
import {
  Get,
  Post,
  Controller,
  Middleware,
  Delete,
  Put,
} from '@overnightjs/core';
import { ISecureRequest } from '@overnightjs/jwt';
import { Response } from 'express';
import { TaskServices } from '../Task/taskServices';
import { HTTPResponse } from '../HTTP/httpResponses';
import { TaskHttpResponseMessages } from '../HTTP/httpEnums';

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
          TaskHttpResponseMessages.TASK_NOT_FOUND
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
          TaskHttpResponseMessages.TASK_NOT_FOUND
        );

      await LogServices.deleteTaskLogItem(taskLogItem);
      HTTPResponse.OK(res, {
        message: TaskHttpResponseMessages.TASK_LOG_ITEM_DELETED,
      });
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
          TaskHttpResponseMessages.TASK_NOT_FOUND
        );

      const updatedTaskLogItem = TaskServices.createNewTask(req);
      await taskLogItem.update({
        ...updatedTaskLogItem,
        loggedAt: req.body.loggedAt,
        TaskId: +req.body.TaskId,
      });

      HTTPResponse.OK(res, updatedTaskLogItem);
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }
}
