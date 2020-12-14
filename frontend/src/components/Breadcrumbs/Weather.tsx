import React, { useState, useEffect, useContext } from 'react';
import { Grid, makeStyles, Paper } from '@material-ui/core';
import { WeatherDataType } from '../../global/types/type';
import { Alerts, Errors } from '../../enums';
import { getWeatherData } from '../../global/functions/axios';
import { GlobalContext } from '../../context/GlobalState';

const useStyles = makeStyles((theme) => ({
  image: {
    height: '50px',
    width: '50px',
    position: 'absolute',
    right: 10,
    top: 0,
  },
}));

const initialWeatherData: WeatherDataType = {
  coord: {
    lon: -1,
    lat: -1,
  },
  weather: [
    {
      id: -1,
      main: 'unavailable',
      description: 'unavailable',
      icon: 'unavailable',
    },
  ],
  base: 'unavailable',
  main: {
    temp: -1,
    feels_like: -1,
    temp_min: -1,
    temp_max: -1,
    pressure: -1,
    humidity: -1,
  },
  visibility: -1,
  wind: {
    speed: -1,
    deg: -1,
  },
  clouds: {
    all: -1,
  },
  dt: -1,
  sys: {
    type: -1,
    id: -1,
    country: 'unavailable',
    sunrise: -1,
    sunset: -1,
  },
  timezone: -1,
  id: -1,
  name: 'unavailable',
  cod: -1,
};

const Weather: React.FC<{
  paper: string;
}> = (props): JSX.Element => {
  const classes = useStyles();
  const { dispatch } = useContext(GlobalContext);
  const [weather, setWeather] = useState<WeatherDataType>(initialWeatherData);

  useEffect(() => {
    (async () => {
      try {
        const weatherData = await getWeatherData();
        setWeather(weatherData);
      } catch (err) {
        dispatch({ type: Alerts.setAlerts, payload: err.response.data });
      }
    })();
  }, []);

  return (
    <Grid item xs={12} md={6} lg={3}>
      <Paper className={props.paper}>
        <h4 style={{ marginBottom: '3px' }}>Bay Point, CA</h4>
        {weather.weather[0].main !== 'unavailable' ? (
          <React.Fragment>
            <p>
              Current temperature:{' '}
              {Math.floor(weather.main.temp - 273) + '\u00B0'}C
            </p>

            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
              alt="weather"
              className={classes.image}
            />
          </React.Fragment>
        ) : (
          <p>{Errors.WEATHER}</p>
        )}
      </Paper>
    </Grid>
  );
};

export default Weather;
