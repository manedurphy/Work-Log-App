import React, { ChangeEvent, FormEvent, useState, useContext } from 'react';
import axios, { AxiosResponse } from 'axios';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  makeStyles,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Redirect } from 'react-router-dom';
import { Tasks, Users } from '../../enums';
import { GlobalContext } from '../../context/GlobalState';
import { getToken } from '../../globalFunctions';
import { LoginType, ITask } from '../../type';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const { dispatch } = useContext(GlobalContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let res: AxiosResponse<LoginType> = await axios.post(
        'api/auth/login',
        formData
      );
      localStorage.setItem('token', res.data.jwt);
      dispatch({ type: Users.setUser, payload: res.data.user });

      const token = getToken();
      const tasks: AxiosResponse<ITask[]> = await axios.get('/api/task', {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch({ type: Tasks.updateTasks, payload: tasks.data });

      setIsLoggedIn(true);
    } catch (err) {
      setAlert(err.response.data.message);
      setTimeout(() => {
        setAlert(null);
      }, 3000);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          {alert && (
            <div className="alert alert-danger" role="alert">
              {alert}
            </div>
          )}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
      {isLoggedIn && <Redirect to="/" />}
    </Container>
  );
}
