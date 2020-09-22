import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Timeline from './pages/Timeline';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import AuthContextProvider from './context/AuthContext';
import PostContextProvider from './context/PostContext';
import Profile from './pages/Profile';

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <PostContextProvider>
            <Switch>
              <Route exact path="/">
                <Redirect to="/signin"/>
              </Route>
              <Route path="/timeline" component={ Timeline } />
              <Route path="/signup" component={ SignUp }/>
              <Route path="/signin" component={ SignIn }/>
              <Route path="/profile/:username" component={ Profile }/>
            </Switch>
        </PostContextProvider>
      </AuthContextProvider>
    </div>
  );
}

export default App;