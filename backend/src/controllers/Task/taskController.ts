import customJwtManager from '../JWT/jwtController';
import { Response } from 'express';
import { ISecureRequest } from '@overnightjs/jwt';
import { Logger } from '@overnightjs/logger';
import { TaskServices } from './taskServices';
import { TaskValidation } from './taskValidation';
import { CheckUserExistance } from '../JWT/checkUserExistance';
import { HTTPResponse } from '../HTTP/httpResponses';
import {
  AlertResponse,
  TaskHttpResponseMessages,
  UserHttpResponseMessages,
} from '../HTTP/httpEnums';
import {
  Controller,
  Middleware,
  Get,
  Put,
  Post,
  Delete,
} from '@overnightjs/core';
import { LogServices } from '../Log/logServices';

@Controller('api/task')
export class TaskController {
  @Get('')
  @Middleware(customJwtManager.middleware)
  private async getAllTasks(req: ISecureRequest, res: Response) {
    Logger.Info(req.body, true);
    try {
      const tasks = await TaskServices.getTasks(+req.payload.id, false);
      HTTPResponse.OK(res, tasks);
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }

  @Get(':id')
  @Middleware(customJwtManager.middleware)
  private async getSingleTask(req: ISecureRequest, res: Response) {
    Logger.Info(req.params.id);
    try {
      const task = await TaskServices.getTask(+req.params.id, +req.payload.id);
      if (!task)
        return HTTPResponse.notFound(
          res,
          TaskHttpResponseMessages.TASK_NOT_FOUND,
          AlertResponse.ERROR
        );

      HTTPResponse.OK(res, task);
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }

  @Post('')
  @Middleware(customJwtManager.middleware)
  @Middleware(TaskValidation.saveTaskValidation)
  private async add(req: ISecureRequest, res: Response) {
    Logger.Info(req.body, true);
    try {
      const taskValidator = new TaskValidation();

      if (!taskValidator.validateInput(req))
        return HTTPResponse.badRequest(
          res,
          taskValidator.errorMessage,
          AlertResponse.ERROR
        );

      const user = await CheckUserExistance.findUser(req.payload.email);
      if (!user)
        return HTTPResponse.notFound(
          res,
          UserHttpResponseMessages.USER_NOT_FOUND,
          AlertResponse.ERROR
        );

      const task = await TaskServices.getTask(req.body.projectNumber, user.id);
      if (task) {
        return HTTPResponse.badRequest(
          res,
          TaskHttpResponseMessages.TASK_EXISTS,
          AlertResponse.ERROR
        );
      }

      const newTask = await TaskServices.saveNewTask(req, user.id);
      await LogServices.createTaskLog(req, newTask.id as number);

      HTTPResponse.created(
        res,
        TaskHttpResponseMessages.TASK_CREATED,
        AlertResponse.SUCCESS
      );
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }

  @Put(':id')
  @Middleware(customJwtManager.middleware)
  @Middleware(TaskValidation.saveTaskValidation)
  private async update(req: ISecureRequest, res: Response) {
    Logger.Info(req.body, true);
    try {
      const taskValidator = new TaskValidation();

      if (!taskValidator.validateInput(req))
        return HTTPResponse.badRequest(
          res,
          taskValidator.errorMessage,
          AlertResponse.ERROR
        );

      const task = await TaskServices.getTask(+req.params.id, +req.payload.id);

      if (!task)
        return HTTPResponse.notFound(
          res,
          TaskHttpResponseMessages.TASK_NOT_FOUND,
          AlertResponse.ERROR
        );

      if (req.body.complete) {
        await TaskServices.updateTask(req, task, true);
        return HTTPResponse.OK(res, {
          message: TaskHttpResponseMessages.TASK_COMPLETED,
        });
      }

      await TaskServices.updateTask(req, task, false);
      await LogServices.createTaskLog(req, task.id);

      HTTPResponse.OK(res, {
        message: TaskHttpResponseMessages.TASK_UPDATED,
        type: AlertResponse.UPDATE,
      });
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }

  @Delete(':id')
  @Middleware(customJwtManager.middleware)
  private async deleteTask(req: ISecureRequest, res: Response) {
    try {
      const task = await TaskServices.getTask(+req.params.id, +req.payload.id);
      if (!task)
        return HTTPResponse.notFound(
          res,
          TaskHttpResponseMessages.TASK_NOT_FOUND,
          AlertResponse.ERROR
        );

      await TaskServices.deleteTask(task);
      HTTPResponse.OK(res, { message: TaskHttpResponseMessages.TASK_DELETED });
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }
}
