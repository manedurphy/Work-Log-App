import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Title from './Title';
import { Grid, makeStyles, Paper } from '@material-ui/core';
import { getToken } from '../global/functions/helpers';
import { WeatherDataType } from '../global/types/type';
import { getWeatherData } from '../global/functions/axios';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    zIndex: theme.zIndex.drawer + 10,
    position: 'relative',
    marginBottom: theme.spacing(3),
    height: '80px',
  },
  image: {
    height: '50px',
    width: '50px',
    position: 'absolute',
    right: '5px',
    bottom: '15px',
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

const Breadcrumbs = (): JSX.Element => {
  const classes = useStyles();
  const [weather, setWeather] = useState<WeatherDataType>(initialWeatherData);

  useEffect(() => {
    (async () => {
      try {
        const weatherData = await getWeatherData();
        setWeather(weatherData);
      } catch (err) {
        //NEED TO HANDLE THIS
        throw err;
      }
    })();
  }, []);

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <Paper className={classes.paper}>
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
              <p>Data unavailable</p>
            )}
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper className={classes.paper}>Here is a component</Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper className={classes.paper}>Here is a component</Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper className={classes.paper}>Here is a component</Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Breadcrumbs;
