import React from 'react';
import Dashboard from './components/Dashboard';
import GlobalState from './context/GlobalState';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import { Route } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <GlobalState>
      <Route exact path={'/'} component={Dashboard} />
      <Route exact path={'/register'} component={Register} />
      <Route exact path="/login" component={Login} />
    </GlobalState>
  );
};

export default App;
