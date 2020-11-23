import React, { useContext, useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import clsx from 'clsx';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AssignmentIcon from '@material-ui/icons/Assignment';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import Chart from './Chart';
import Deposits from './CurrentWeek';
import TasksComponent from './Tasks';
import JobForm from './JobForm';
import Spinner from './Spinner';
import { Redirect } from 'react-router-dom';
import { getToken, GlobalContext } from '../context/GlobalState';
import { Users, Tasks, Logs } from '../enums';
import { ILog, VerifyType } from '../type';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { ITask } from '../type';
import {
  makeStyles,
  CssBaseline,
  Drawer,
  Box,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Badge,
  Container,
  Grid,
  Paper,
  Link,
} from '@material-ui/core';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Work Log
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24,
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

const Dashboard: React.FC = (): JSX.Element => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [open, setOpen] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const { state, dispatch } = useContext(GlobalContext);
  const { showCompleted } = state.tasks;

  useEffect(() => {
    const token = getToken();

    (async () => {
      try {
        const res: AxiosResponse<VerifyType> = await axios.get(
          '/api/auth/token',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        dispatch({ type: Users.setUser, payload: res.data.user });
      } catch (error) {
        setIsLoggedIn(false);
      }
    })();

    getTasks();
  }, [showCompleted]);

  const getTasks = async (): Promise<void> => {
    const token = getToken();
    const res: AxiosResponse<ITask[]> = await axios.get(
      showCompleted ? '/api/archive' : '/api/task',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    dispatch({ type: Logs.setShowLog, payload: false });
    dispatch({ type: Tasks.updateTasks, payload: res.data });
    setLoadingTasks(false);
  };

  const getLogs = async (projectNumber: number): Promise<void> => {
    const token = getToken();
    const res: AxiosResponse<ILog[]> = await axios.get(
      `/api/task/log/${projectNumber}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch({ type: Logs.setLog, payload: res.data });
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogOut = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return !isLoggedIn ? (
    <Redirect to="/login" />
  ) : (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            Dashboard
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={1} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={handleLogOut}>
            <Badge color="secondary">
              <ExitToAppIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem
            button
            onClick={() => {
              if (showCompleted) {
                setLoadingTasks(true);

                dispatch({ type: Tasks.setShowCompleted, payload: false });
              }
            }}
          >
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Current Tasks" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              if (!showCompleted) {
                setLoadingTasks(true);
                dispatch({ type: Tasks.setShowCompleted, payload: true });
              }
            }}
          >
            <ListItemIcon>
              <DataUsageIcon />
            </ListItemIcon>
            <ListItemText primary="Archive" />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        {loadingTasks ? (
          <Spinner />
        ) : (
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} lg={7}>
                <Paper className={fixedHeightPaper}>
                  <Chart />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={5}>
                <Paper className={fixedHeightPaper}>
                  <Deposits />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <TasksComponent
                    getTasks={getTasks}
                    getLogs={getLogs}
                    showCompleted={showCompleted}
                  />
                </Paper>
              </Grid>
            </Grid>
            {!showCompleted && (
              <Box pt={4}>
                <JobForm />
                <Copyright />
              </Box>
            )}
          </Container>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
