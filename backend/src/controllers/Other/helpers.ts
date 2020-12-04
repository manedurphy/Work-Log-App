import axios, { AxiosResponse } from 'axios';
import { WeatherDataType } from './types';

export class ServicesHelpers {
  public static getWeatherData = async (): Promise<WeatherDataType> => {
    const weatherData: AxiosResponse<WeatherDataType> = await axios.get(
      'http://api.openweathermap.org/data/2.5/weather?id=5326561&appid=7f9561a0febf2454599f4e6a4aa582ff'
    );

    return weatherData.data;
  };
}
