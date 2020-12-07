import customJwtManager from '../JWT/jwtController';
import { Response } from 'express';
import { ISecureRequest } from '@overnightjs/jwt';
import { Logger } from '@overnightjs/logger';
import { TaskValidation } from './taskValidation';
import { CheckUserExistance } from '../JWT/checkUserExistance';
import { HTTPResponse } from '../HTTP/httpResponses';
import { LogServices } from '../Log/logServices';
import { ProductivityService } from '../Productivity/ProductivityService';
import { TaskService } from './TaskService';
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

@Controller('api/task')
export class TaskController {
  @Get('')
  @Middleware(customJwtManager.middleware)
  private async getAllTasks(req: ISecureRequest, res: Response) {
    Logger.Info(req.body, true);
    try {
      const taskService = new TaskService(+req.payload.id);
      const tasks = await taskService.getTasks(false);

      if (!tasks)
        return HTTPResponse.badRequest(
          res,
          TaskHttpResponseMessages.TASK_BAD_REQUEST,
          AlertResponse.ERROR
        );

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
      const taskService = new TaskService(+req.payload.id, +req.params.id);
      const task = await taskService.getTask();

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

      const taskService = new TaskService(user.id, +req.body.projectNumber);
      const task = await taskService.getTask();

      if (task) {
        return HTTPResponse.badRequest(
          res,
          TaskHttpResponseMessages.TASK_EXISTS,
          AlertResponse.ERROR
        );
      }

      const newTask = await taskService.save(req);
      const newLog = await LogServices.createTaskLog(
        req,
        newTask.id as number,
        false
      );

      const productivity = new ProductivityService(
        newTask.hoursAvailableToWork - newTask.hoursRemaining,
        newLog.id
      );

      await productivity.create();

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

      const taskService = new TaskService(+req.payload.id, +req.params.id);
      const task = await taskService.getTask();

      if (!task)
        return HTTPResponse.notFound(
          res,
          TaskHttpResponseMessages.TASK_NOT_FOUND,
          AlertResponse.ERROR
        );

      taskService.update(req, task, false);
      await LogServices.createTaskLog(req, task.id, false);

      const logs = await LogServices.getLatestLogs(task.id);

      const productivity = new ProductivityService(
        logs[1].hoursRemaining - logs[0].hoursRemaining,
        logs[0].id,
        logs[0].loggedAt
      );

      await productivity.create();

      HTTPResponse.OK(res, {
        message: TaskHttpResponseMessages.TASK_UPDATED,
        type: AlertResponse.UPDATE,
      });
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }

  @Put('complete/:id')
  @Middleware(customJwtManager.middleware)
  @Middleware(TaskValidation.saveTaskValidation)
  private async completeTaskWithForm(req: ISecureRequest, res: Response) {
    try {
      const taskValidator = new TaskValidation();

      if (!taskValidator.validateInput(req))
        return HTTPResponse.badRequest(
          res,
          taskValidator.errorMessage,
          AlertResponse.ERROR
        );

      const taskService = new TaskService(+req.payload.id, +req.params.id);
      const task = await taskService.getTask();

      if (!task)
        return HTTPResponse.notFound(
          res,
          TaskHttpResponseMessages.TASK_NOT_FOUND,
          AlertResponse.ERROR
        );

      taskService.update(req, task, true);

      const taskLogItem = await LogServices.createTaskLog(req, task.id, true);
      const taskLogItems = await LogServices.getLatestLogs(taskLogItem.TaskId);

      const productivity = new ProductivityService(
        taskLogItems[1].hoursRemaining - taskLogItems[0].hoursRemaining,
        taskLogItems[0].id,
        taskLogItems[0].loggedAt
      );

      productivity.create();
      return HTTPResponse.OK(res, {
        message: TaskHttpResponseMessages.TASK_COMPLETED,
      });
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }

  @Put('complete/no-form/:id')
  @Middleware(customJwtManager.middleware)
  private async completeTaskNoForm(req: ISecureRequest, res: Response) {
    try {
      const taskService = new TaskService(+req.payload.id, +req.params.id);
      const task = await taskService.getTask();

      if (!task)
        return HTTPResponse.notFound(
          res,
          TaskHttpResponseMessages.TASK_NOT_FOUND,
          AlertResponse.ERROR
        );

      const log = await LogServices.getLog(+req.params.id, task.id);
      await taskService.completeTask(task);

      await LogServices.updateCompleteStatus(log[0]);

      HTTPResponse.okWithMessage(
        res,
        TaskHttpResponseMessages.TASK_COMPLETED,
        AlertResponse.SUCCESS
      );
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }

  @Delete(':id')
  @Middleware(customJwtManager.middleware)
  private async deleteTask(req: ISecureRequest, res: Response) {
    try {
      const taskService = new TaskService(+req.payload.id, +req.params.id);
      const task = await taskService.getTask();

      if (!task)
        return HTTPResponse.notFound(
          res,
          TaskHttpResponseMessages.TASK_NOT_FOUND,
          AlertResponse.ERROR
        );

      await taskService.delete(task);
      HTTPResponse.OK(res, {
        message: TaskHttpResponseMessages.TASK_DELETED,
        type: AlertResponse.WARNING,
      });
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }
}
