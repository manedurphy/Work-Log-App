import React, { useContext, useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import AppBarComponent from './AppBar';
import MainComponent from './Main';
import DrawerComponent from './Drawer';
import Spinner from './UI/Spinner';
import { Redirect } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';
import { getTasks } from '../global/functions/axios';
import { getToken } from '../global/functions/helpers';
import { Users, Tasks, Logs, Alerts } from '../enums';
import { VerifyType } from '../global/types/type';
import { makeStyles, CssBaseline } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
}));

const Dashboard: React.FC = (): JSX.Element => {
  const classes = useStyles();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [open, setOpen] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const { state, dispatch } = useContext(GlobalContext);
  const { showCompleted } = state.tasks;

  useEffect((): void => {
    (async (): Promise<void> => {
      try {
        const tasks = await getTasks(showCompleted);
        const res: AxiosResponse<VerifyType> = await axios.get(
          '/api/auth/token',
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
        dispatch({ type: Users.setUser, payload: res.data.user });
        dispatch({ type: Logs.setShowLog, payload: false });
        dispatch({ type: Alerts.removeAlerts, payload: [] });
        dispatch({
          type: Tasks.updateTasks,
          payload: tasks,
        });
        dispatch({
          type: Tasks.setDisplayTasks,
          payload: tasks,
        });
        setLoadingTasks(false);
      } catch (error) {
        setIsLoggedIn(false);
      }
    })();
  }, [showCompleted]);

  return !isLoggedIn ? (
    <Redirect to="/login" />
  ) : (
    <div className={classes.root}>
      <CssBaseline />
      <AppBarComponent setOpen={setOpen} open={open} />
      <DrawerComponent
        setLoadingTasks={setLoadingTasks}
        showCompleted={showCompleted}
        open={open}
        setOpen={setOpen}
      />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        {loadingTasks ? <Spinner /> : <MainComponent />}
      </main>
    </div>
  );
};

export default Dashboard;
