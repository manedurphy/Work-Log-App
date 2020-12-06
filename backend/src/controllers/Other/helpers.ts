import axios, { AxiosResponse } from 'axios';
import { WeatherDataType } from './types';

export class ServicesHelpers {
  public static getWeatherData = async (): Promise<WeatherDataType> => {
    const weatherData: AxiosResponse<WeatherDataType> = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?id=5326561&appid=${process.env.WEATHER_API_KEY}`
    );

    return weatherData.data;
  };
}
