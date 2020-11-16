import customJwtManager from '../jwtController';
import { Response } from 'express';
import { ISecureRequest } from '@overnightjs/jwt';
import { validationResult } from 'express-validator';
import { Logger } from '@overnightjs/logger';
import { Task } from '../../models/models';
import { TaskServices } from './taskServices';
import { TaskLogServices } from './taskLogServices';
import { TaskValidation } from './taskValidation';
import { CheckUserExistance } from './checkUserExistance';
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
  private serverError = (res: Response) =>
    res.status(500).json({ message: 'Internal Server Error' });

  @Get('')
  @Middleware(customJwtManager.middleware)
  private async getAllTasks(req: ISecureRequest, res: Response) {
    Logger.Info(req.body, true);
    try {
      const tasks = await TaskServices.getTasks(+req.payload.id, false);
      res.status(200).json(tasks);
    } catch (error) {
      res.json({ error });
    }
  }

  @Get(':id')
  @Middleware(customJwtManager.middleware)
  private async getSingleTask(req: ISecureRequest, res: Response) {
    Logger.Info(req.params.id);
    try {
      const task = await TaskServices.getTask(+req.params.id, +req.payload.id);
      if (!task)
        return res.status(404).json({ message: 'Task could not be found' });

      return res.status(200).json(task);
    } catch (error) {
      this.serverError(res);
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

        res.status(200).json(taskLog);
      }
    } catch (error) {
      this.serverError(res);
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
        return res.status(400).json({ message: errors.array()[0].msg });

      const user = await CheckUserExistance.findUser(req.payload.email);
      if (!user)
        return res.status(404).json({ message: 'User could not be found' });

      const task = await TaskServices.getTask(req.body.projectNumber, user.id);
      if (task) {
        return res
          .status(400)
          .json({ message: 'Task with that project number already exists' });
      }

      const newTask = await TaskServices.saveNewTask(req, user.id);
      await TaskLogServices.createTaskLog(req, newTask.id);

      res.status(201).json({ message: 'Task Created!' });
    } catch (error) {
      this.serverError(res);
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
        return res.status(404).json({ message: 'Task could not be found' });

      if (req.body.complete) {
        await TaskServices.updateTask(req, task, true);
        return res.status(200).json({ message: 'Task Complete!' });
      }

      await TaskServices.updateTask(req, task, false);
      await TaskLogServices.createTaskLog(req, task.id);

      res.status(200).json({ message: 'Task Updated!' });
    } catch (error) {
      this.serverError(res);
    }
  }

  @Delete(':id')
  @Middleware(customJwtManager.middleware)
  private async deleteTask(req: ISecureRequest, res: Response) {
    try {
      const task = await TaskServices.getTask(+req.params.id, +req.payload.id);

      if (!task)
        return res.status(404).json({ message: 'Task could not be found' });

      await task.destroy();
      res.status(200).json({ message: 'Task Deleted!' });
    } catch (error) {
      this.serverError(res);
    }
  }
}
