import { Response } from 'express';
import { ISecureRequest } from '@overnightjs/jwt';
import {
  Controller,
  Middleware,
  Get,
  Put,
  Post,
  Delete,
} from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import customJwtManager from './jwtController';
import Task from '../models/task';
import User from '../models/user';
import { ITaskModel } from 'src/interfaces/task';

@Controller('api/task')
export class TaskController {
  @Get('')
  @Middleware(customJwtManager.middleware)
  private async getAllTasks(req: ISecureRequest, res: Response) {
    try {
      Logger.Info(req.body, true);
      const tasks: ITaskModel[] = await Task.find({ userId: req.payload._id });

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
      const task = await Task.findOne({
        name: req.params.id,
        userId: req.payload._id,
      });
      if (!task)
        return res.status(404).json({ message: 'Task could not be found' });

      return res.status(200).json(task);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Post('')
  @Middleware(customJwtManager.middleware)
  private async add(req: ISecureRequest, res: Response) {
    Logger.Info(req.body, true);
    try {
      const {
        name,
        projectNumber,
        hoursAvailableToWork,
        hoursWorked,
        description,
        numberOfReviews,
        reviewHours,
        hoursRequiredByBim,
      } = req.body;

      const user = await User.findOne({ email: req.payload.email });
      if (!user)
        return res.status(404).json({ message: 'User could not be found' });

      const hoursRemaining =
        parseFloat(hoursAvailableToWork) - parseFloat(hoursWorked);

      const task: ITaskModel = new Task({
        name,
        projectNumber: parseFloat(projectNumber),
        hours: {
          hoursAvailableToWork: parseFloat(hoursAvailableToWork),
          hoursWorked: parseFloat(hoursWorked),
          hoursRemaining,
        },
        reviews: {
          numberOfReviews: parseFloat(numberOfReviews),
          reviewHours: parseFloat(reviewHours),
          hoursRequiredByBim: parseFloat(hoursRequiredByBim),
        },
        description,
        userId: user?._id,
      });

      user.tasks.push(task);

      await user.save();
      await task.save();
      res.status(201).json({ message: 'Task Created!' });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Put(':id')
  @Middleware(customJwtManager.middleware)
  private async update(req: ISecureRequest, res: Response) {
    Logger.Info(req.body);
    try {
      const {
        name,
        projectNumber,
        hoursAvailableToWork,
        hoursWorked,
        description,
        numberOfReviews,
        reviewHours,
        hoursRequiredByBim,
      } = req.body;

      const hoursRemaining =
        parseFloat(hoursAvailableToWork) - parseFloat(hoursWorked);

      const updatedTask = {
        name,
        projectNumber: parseFloat(projectNumber),
        hours: {
          hoursAvailableToWork: parseFloat(hoursAvailableToWork),
          hoursWorked: parseFloat(hoursWorked),
          hoursRemaining,
        },
        reviews: {
          numberOfReviews: parseFloat(numberOfReviews),
          reviewHours: parseFloat(reviewHours),
          hoursRequiredByBim: parseFloat(hoursRequiredByBim),
        },
        description,
      };

      await Task.findOneAndUpdate(
        { projectNumber: +req.params.id, userId: req.payload._id },
        updatedTask
      );
      res.status(200).json({ message: 'Task Updated!' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Delete(':id')
  @Middleware(customJwtManager.middleware)
  private async deleteTask(req: ISecureRequest, res: Response) {
    try {
      const task = await Task.findOne({
        projectNumber: +req.params.id,
        userId: req.payload._id,
      });
      if (!task)
        return res.status(404).json({ message: 'Task could not be found' });

      await task.remove();
      res.status(200).json({ message: 'Task Deleted!' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
