import customJwtManager from './jwtController';
import { Response } from 'express';
import { ISecureRequest } from '@overnightjs/jwt';
import { body, validationResult } from 'express-validator';
import { Logger } from '@overnightjs/logger';
import { Log, Task, User } from '../models/models';
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
      const tasks = await Task.findAll({
        where: { UserId: req.payload.id, complete: false },
      });

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
        where: {
          projectNumber: +req.params.id,
          UserId: req.payload.id,
        },
      });

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
      const task = await Task.findOne({
        where: {
          projectNumber: req.params.projectNumber,
          UserId: req.payload.id,
        },
      });

      if (task) {
        const taskLog = await Log.findAll({
          where: { projectNumber: req.params.projectNumber, TaskId: task.id },
          order: [['id', 'DESC']],
        });

        res.status(200).json(taskLog);
      }
    } catch (error) {
      this.serverError(res);
    }
  }

  @Post('')
  @Middleware(customJwtManager.middleware)
  @Middleware([
    body('name').not().isEmpty().withMessage('Task name is missing'),
    body('projectNumber')
      .not()
      .isEmpty()
      .withMessage('Project number is missing'),
    body('hoursAvailableToWork')
      .not()
      .isEmpty()
      .withMessage('Please enter available hours'),
    body('numberOfReviews')
      .not()
      .isEmpty()
      .withMessage('Number of reviews is missing'),
    body('reviewHours').not().isEmpty().withMessage('Review hours is missing'),
    body('hoursRequiredByBim')
      .not()
      .isEmpty()
      .withMessage('Hours required by BIM is missing'),
  ])
  private async add(req: ISecureRequest, res: Response) {
    Logger.Info(req.body, true);
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty())
        return res.status(400).json({ message: errors.array()[0].msg });

      const {
        name,
        projectNumber,
        hoursAvailableToWork,
        hoursWorked,
        notes,
        numberOfReviews,
        reviewHours,
        hoursRequiredByBim,
      } = req.body;

      const user = await User.findOne({ where: { email: req.payload.email } });
      if (!user)
        return res.status(404).json({ message: 'User could not be found' });

      const task = await Task.findOne({
        where: { projectNumber, UserId: user.id },
      });
      if (task) {
        return res
          .status(400)
          .json({ message: 'Task with that project number already exists' });
      }

      const hoursRemaining =
        +hoursAvailableToWork -
        +hoursWorked -
        +reviewHours -
        +hoursRequiredByBim;

      const newTask = await Task.create({
        name,
        projectNumber: +projectNumber,
        hoursAvailableToWork: +hoursAvailableToWork,
        hoursWorked: +hoursWorked,
        notes,
        hoursRemaining,
        numberOfReviews: +numberOfReviews,
        reviewHours: +reviewHours,
        hoursRequiredByBim: +hoursRequiredByBim,
        complete: false,
        UserId: user.id,
      });

      await Log.create({
        name,
        projectNumber: +projectNumber,
        hoursAvailableToWork: +hoursAvailableToWork,
        hoursWorked: +hoursWorked,
        notes,
        hoursRemaining,
        numberOfReviews: +numberOfReviews,
        reviewHours: +reviewHours,
        hoursRequiredByBim: +hoursRequiredByBim,
        complete: false,
        TaskId: newTask.id,
      });

      res.status(201).json({ message: 'Task Created!' });
    } catch (error) {
      this.serverError(res);
    }
  }

  @Put(':id')
  @Middleware(customJwtManager.middleware)
  @Middleware([
    body('name').not().isEmpty().withMessage('Task name is missing'),
    body('projectNumber')
      .not()
      .isEmpty()
      .withMessage('Project number is missing'),
    body('hoursAvailableToWork')
      .not()
      .isEmpty()
      .withMessage('Please enter available hours'),
    body('numberOfReviews')
      .not()
      .isEmpty()
      .withMessage('Number of reviews is missing'),
    body('reviewHours').not().isEmpty().withMessage('Review hours is missing'),
    body('hoursRequiredByBim')
      .not()
      .isEmpty()
      .withMessage('Hours required by BIM is missing'),
  ])
  private async update(req: ISecureRequest, res: Response) {
    Logger.Info(req.body);
    try {
      const {
        name,
        projectNumber,
        hoursAvailableToWork,
        hoursWorked,
        notes,
        numberOfReviews,
        reviewHours,
        hoursRequiredByBim,
        complete,
      } = req.body;

      const task = await Task.findOne({
        where: {
          projectNumber: +req.params.id,
          UserId: req.payload.id,
        },
      });

      if (complete) {
        task?.update({ complete });
        return res.status(200).json({ message: 'Task Complete!' });
      }

      const hoursRemaining =
        +hoursAvailableToWork -
        +hoursWorked -
        +reviewHours -
        +hoursRequiredByBim;

      await task?.update({
        name,
        projectNumber: +projectNumber,
        hoursAvailableToWork: +hoursAvailableToWork,
        hoursWorked: +hoursWorked,
        notes,
        hoursRemaining,
        numberOfReviews: +numberOfReviews,
        reviewHours: +reviewHours,
        hoursRequiredByBim: +hoursRequiredByBim,
      });

      if (task) {
        await Log.create({
          name,
          projectNumber: +projectNumber,
          hoursAvailableToWork: +hoursAvailableToWork,
          hoursWorked: +hoursWorked,
          notes,
          hoursRemaining,
          numberOfReviews: +numberOfReviews,
          reviewHours: +reviewHours,
          hoursRequiredByBim: +hoursRequiredByBim,
          complete: false,
          TaskId: task.id,
        });
      }

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
        where: {
          projectNumber: +req.params.id,
          UserId: req.payload.id,
        },
      });

      if (!task)
        return res.status(404).json({ message: 'Task could not be found' });

      await task.destroy();
      res.status(200).json({ message: 'Task Deleted!' });
    } catch (error) {
      this.serverError(res);
    }
  }
}
