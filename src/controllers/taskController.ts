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
import { Types } from 'mongoose';

@Controller('api/task')
export class TaskController {
  private serverError = (res: Response) =>
    res.status(500).json({ message: 'Internal Server Error' });

  @Get('')
  @Middleware(customJwtManager.middleware)
  private async getAllTasks(req: ISecureRequest, res: Response) {
    try {
      Logger.Info(req.body, true);
      let tasks: ITaskModel[] = await Task.find({ userId: req.payload._id });
      tasks = tasks.filter((task) => !task.complete);

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
        projectNumber: +req.params.id,
        userId: req.payload._id,
      });
      if (!task)
        return res.status(404).json({ message: 'Task could not be found' });

      return res.status(200).json(task);
    } catch (error) {
      this.serverError(res);
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

      const hoursRemaining = +hoursAvailableToWork - +hoursWorked;

      const task: ITaskModel = new Task({
        name: name.trim(),
        projectNumber: +projectNumber,
        hours: {
          hoursAvailableToWork: +hoursAvailableToWork,
          hoursWorked: +hoursWorked,
          hoursRemaining,
        },
        reviews: {
          numberOfReviews: +numberOfReviews,
          reviewHours: +reviewHours,
          hoursRequiredByBim: +hoursRequiredByBim,
        },
        description: description.trim(),
        userId: user?._id,
      });

      user.tasks.currentTasks.push(task);

      await user.save();
      await task.save();
      res.status(201).json({ message: 'Task Created!' });
    } catch (error) {
      this.serverError(res);
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
        complete,
      } = req.body;

      let isComplete = !!complete;
      if (isComplete) {
        const task = await Task.findOneAndUpdate(
          {
            projectNumber: +req.params.id,
            userId: req.payload._id,
          },
          req.body
        );

        const user = await User.findById({ _id: req.payload._id });
        user?.tasks.completedTasks.push(task!);

        const filterTasks = user!.tasks.currentTasks.filter(
          (userTask) =>
            Types.ObjectId(userTask._id).toHexString() !==
            Types.ObjectId(task!._id).toHexString()
        );

        await user?.updateOne({
          tasks: {
            currentTasks: filterTasks,
            completedTasks: user.tasks.completedTasks,
          },
        });
        return res.status(200).json({ message: 'Task Complete!' });
      }

      const hoursRemaining = +hoursAvailableToWork - +hoursWorked;

      const updatedTask = {
        name,
        projectNumber: +projectNumber,
        hours: {
          hoursAvailableToWork: +hoursAvailableToWork,
          hoursWorked: +hoursWorked,
          hoursRemaining,
        },
        reviews: {
          numberOfReviews: +numberOfReviews,
          reviewHours: +reviewHours,
          hoursRequiredByBim: +hoursRequiredByBim,
        },
        description,
      };

      await Task.findOneAndUpdate(
        { projectNumber: +req.params.id, userId: req.payload._id },
        updatedTask
      );
      res.status(200).json({ message: 'Task Updated!' });
    } catch (error) {
      this.serverError(res);
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

      const user = await User.findById({ _id: req.payload._id });
      const completedUserTasks = user?.tasks.completedTasks;
      if (!task)
        return res.status(404).json({ message: 'Task could not be found' });

      const filterTasks = user!.tasks.currentTasks.filter(
        (userTask) =>
          Types.ObjectId(userTask._id).toHexString() !==
          Types.ObjectId(task._id).toHexString()
      );

      await user!.updateOne({
        tasks: {
          currentTasks: filterTasks,
          completedTasks: completedUserTasks,
        },
      });

      await task.remove();
      res.status(200).json({ message: 'Task Deleted!' });
    } catch (error) {
      this.serverError(res);
    }
  }
}
