import React, { useContext } from 'react';
import clsx from 'clsx';
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import {
  ChevronLeft as ChevronLeftIcon,
  Assignment as AssignmentIcon,
  DataUsage as DataUsageIcon,
} from '@material-ui/icons';
import { Tasks } from '../enums';
import { GlobalContext } from '../context/GlobalState';

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: 240,
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
}));

const DrawerComponent: React.FC<{
  setLoadingTasks: (value: React.SetStateAction<boolean>) => void;
  showCompleted: boolean;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = (props): JSX.Element => {
  const classes = useStyles();
  const { dispatch } = useContext(GlobalContext);

  const handleDrawerClose = () => {
    props.setOpen(false);
  };
  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: clsx(
          classes.drawerPaper,
          !props.open && classes.drawerPaperClose
        ),
      }}
      open={props.open}
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
            if (props.showCompleted) {
              props.setLoadingTasks(true);

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
            if (!props.showCompleted) {
              props.setLoadingTasks(true);
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
  );
};

export default DrawerComponent;
