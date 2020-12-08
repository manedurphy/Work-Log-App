import { Controller, Get, Middleware } from '@overnightjs/core';
import { ISecureRequest } from '@overnightjs/jwt';
import { Request, Response } from 'express';
import { HTTPResponse } from '../../constants/HTTP/httpResponses';
import customJwtManager from '../JWT/jwtController';
import { ServicesHelpers } from './helpers';

@Controller('api/services')
export class MiscServices {
  @Get('test')
  private test(req: Request, res: Response) {
    try {
      HTTPResponse.OK(res, { success: true });
    } catch (error) {
      throw error;
    }
  }

  @Get('weather')
  @Middleware(customJwtManager.middleware)
  private async getWeather(req: ISecureRequest, res: Response) {
    try {
      const weatherData = await ServicesHelpers.getWeatherData();

      HTTPResponse.OK(res, weatherData);
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }
}
