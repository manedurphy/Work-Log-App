import React from 'react';
import clsx from 'clsx';
import SearchBar from './SearchBar';
import {
  AppBar,
  Badge,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  ExitToApp as ExitToAppIcon,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 5,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: 'black',
    height: '250px',
  },
  appBarShift: {
    marginLeft: 240,
    width: `calc(100% - ${240}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  toolbar: {
    paddingRight: 24,
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
}));

const AppBarComponent: React.FC<{
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
}> = (props): JSX.Element => {
  const classes = useStyles();

  const handleDrawerOpen = () => {
    props.setOpen(true);
  };

  const handleLogOut = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };
  return (
    <AppBar
      position="absolute"
      elevation={0}
      className={clsx(classes.appBar, props.open && classes.appBarShift)}
    >
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          className={clsx(
            classes.menuButton,
            props.open && classes.menuButtonHidden
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
        <SearchBar />
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
  );
};

export default AppBarComponent;
