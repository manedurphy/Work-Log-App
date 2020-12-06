import React, { useContext, useEffect, useState } from 'react';
import { Box, Grid, makeStyles, Paper } from '@material-ui/core';
import {
  FormatListBulleted as FormatListBulletedIcon,
  Work as WorkIcon,
  ArrowUpward as ArrowUpwardIcon,
} from '@material-ui/icons';
import { WeatherDataType } from '../global/types/type';
import { getWeatherData } from '../global/functions/axios';
import { GlobalContext } from '../context/GlobalState';
import { Errors } from '../enums';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    zIndex: theme.zIndex.drawer + 10,
    position: 'relative',
    marginBottom: theme.spacing(3),
    height: '80px',
    alignItems: 'center',
  },
  image: {
    height: '50px',
    width: '50px',
    position: 'absolute',
    right: 10,
    top: 0,
  },
  due: {
    backgroundColor: 'purple',
    color: 'white',
    padding: '5px',
    borderRadius: '100%',
    width: '35px',
    position: 'absolute',
    right: 10,
    top: 10,
  },
  productivity: {
    backgroundColor: 'orange',
    color: 'white',
    padding: '5px',
    borderRadius: '100%',
    width: '35px',
    position: 'absolute',
    right: 10,
    top: 10,
  },
  alignText: {
    textAlign: 'center',
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
  const { state } = useContext(GlobalContext);
  const [weather, setWeather] = useState<WeatherDataType>(initialWeatherData);

  useEffect(() => {
    (async () => {
      const weatherData = await getWeatherData();
      setWeather(weatherData);
    })();
  }, []);

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
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
              <p>{Errors.WEATHER}</p>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper className={classes.paper}>
            <h4 className={classes.alignText}>Tasks Due</h4>
            <p>You have {state.date.tasksDue.length} tasks due today</p>
            <Box className={classes.due}>
              <FormatListBulletedIcon />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper className={classes.paper}>
            <h4 className={classes.alignText}>Productivity</h4>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
            >
              <ArrowUpwardIcon style={{ color: 'green' }} />
              <p style={{ color: 'green', marginRight: '5px' }}>12%</p>
              <p>Since last week</p>
            </Box>
            <Box className={classes.productivity}>
              <WorkIcon />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper className={classes.paper}>Here is a component</Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Breadcrumbs;
