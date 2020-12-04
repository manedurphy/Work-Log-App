import React, { useContext, useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import AppBarComponent from './AppBar';
import MainComponent from './Main';
import DrawerComponent from './Drawer';
import Spinner from './UI/Spinner';
import { Redirect } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';
import { getTasks, verifyUser } from '../global/functions/axios';
import { Users, Tasks, Logs, Alerts } from '../enums';
import { VerifyType } from '../global/types/type';
import { Box, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    overflow: 'auto',
  },
  spinner: {
    marginTop: '200px',
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
        const res: AxiosResponse<VerifyType> = await verifyUser();
        dispatch({ type: Users.setUser, payload: res.data.user });
        dispatch({ type: Logs.setShowLog, payload: false });
        dispatch({ type: Alerts.removeAlerts, payload: [] });
        dispatch({
          type: Tasks.updateTasks,
          payload: await getTasks(showCompleted),
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
      <AppBarComponent setOpen={setOpen} open={open} />
      <DrawerComponent
        setLoadingTasks={setLoadingTasks}
        showCompleted={showCompleted}
        open={open}
        setOpen={setOpen}
      />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        {loadingTasks ? (
          <Box className={classes.spinner}>
            <Spinner />
          </Box>
        ) : (
          <MainComponent />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
