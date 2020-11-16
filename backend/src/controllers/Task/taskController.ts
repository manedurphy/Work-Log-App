import customJwtManager from '../jwtController';
import { Response } from 'express';
import { ISecureRequest } from '@overnightjs/jwt';
import { validationResult } from 'express-validator';
import { Logger } from '@overnightjs/logger';
import { TaskServices } from './taskServices';
import { TaskLogServices } from './taskLogServices';
import { TaskValidation } from './taskValidation';
import { TaskHttpResponses, UserHttpResponses } from './httpEnums';
import { CheckUserExistance } from './checkUserExistance';
import { HTTPResponses } from './httpResponses';
import {
  Controller,
  Middleware,
  Get,
  Put,
  Post,
  Delete,
} from '@overnightjs/core';

@Controller('api/task')
export class TaskController {
  @Get('')
  @Middleware(customJwtManager.middleware)
  private async getAllTasks(req: ISecureRequest, res: Response) {
    Logger.Info(req.body, true);
    try {
      const tasks = await TaskServices.getTasks(+req.payload.id, false);
      HTTPResponses.OK(res, tasks);
    } catch (error) {
      HTTPResponses.serverError(res);
    }
  }

  @Get(':id')
  @Middleware(customJwtManager.middleware)
  private async getSingleTask(req: ISecureRequest, res: Response) {
    Logger.Info(req.params.id);
    try {
      const task = await TaskServices.getTask(+req.params.id, +req.payload.id);
      if (!task)
        return HTTPResponses.notFound(res, TaskHttpResponses.TASK_NOT_FOUND);

      HTTPResponses.OK(res, task);
    } catch (error) {
      HTTPResponses.serverError(res);
    }
  }

  @Get('log/:projectNumber')
  @Middleware(customJwtManager.middleware)
  private async getTaskLog(req: ISecureRequest, res: Response) {
    try {
      const task = await TaskServices.getTask(
        +req.params.projectNumber,
        +req.payload.id
      );

      if (task) {
        const taskLog = await TaskLogServices.getTaskLog(
          +req.params.projectNumber,
          task.id
        );

        HTTPResponses.OK(res, taskLog);
      }
    } catch (error) {
      HTTPResponses.serverError(res);
    }
  }

  @Post('')
  @Middleware(customJwtManager.middleware)
  @Middleware(TaskValidation.saveTaskValidation)
  private async add(req: ISecureRequest, res: Response) {
    Logger.Info(req.body, true);
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty())
        return HTTPResponses.badRequest(res, errors.array()[0].msg);

      const user = await CheckUserExistance.findUser(req.payload.email);
      if (!user)
        return HTTPResponses.notFound(res, UserHttpResponses.USER_NOT_FOUND);

      const task = await TaskServices.getTask(req.body.projectNumber, user.id);
      if (task) {
        return HTTPResponses.badRequest(res, TaskHttpResponses.TASK_EXISTS);
      }

      const newTask = await TaskServices.saveNewTask(req, user.id);
      await TaskLogServices.createTaskLog(req, newTask.id as number);

      HTTPResponses.created(res, TaskHttpResponses.TASK_CREATED);
    } catch (error) {
      HTTPResponses.serverError(res);
    }
  }

  @Put(':id')
  @Middleware(customJwtManager.middleware)
  @Middleware(TaskValidation.saveTaskValidation)
  private async update(req: ISecureRequest, res: Response) {
    Logger.Info(req.body);
    try {
      const task = await TaskServices.getTask(+req.params.id, +req.payload.id);

      if (!task)
        return HTTPResponses.notFound(res, TaskHttpResponses.TASK_NOT_FOUND);

      if (req.body.complete) {
        await TaskServices.updateTask(req, task, true);
        return HTTPResponses.OK(res, {
          message: TaskHttpResponses.TASK_COMPLETED,
        });
      }

      await TaskServices.updateTask(req, task, false);
      await TaskLogServices.createTaskLog(req, task.id);

      HTTPResponses.OK(res, { message: TaskHttpResponses.TASK_UPDATED });
    } catch (error) {
      HTTPResponses.serverError(res);
    }
  }

  @Delete(':id')
  @Middleware(customJwtManager.middleware)
  private async deleteTask(req: ISecureRequest, res: Response) {
    try {
      const task = await TaskServices.getTask(+req.params.id, +req.payload.id);
      if (!task)
        return HTTPResponses.notFound(res, TaskHttpResponses.TASK_NOT_FOUND);

      await TaskServices.deleteTask(task);
      HTTPResponses.OK(res, { message: TaskHttpResponses.TASK_DELETED });
    } catch (error) {
      HTTPResponses.serverError(res);
    }
  }
}
