import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

import Auth from './components/auth/auth.js';
import Home from './components/home/home';
import Search from './components/search/search';
import Messages from './components/messages/messages';
import Invitations from './components/invitations/invitations';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Auth></Auth>

          </Route>
          <Route exact path="/Home">
            <Home></Home>
          </Route>
          <Route exact path='/search'>
            <Search></Search>
          </Route>
          <Route exact path="/messages">
            <Messages></Messages>
          </Route>
          <Route exact path='/invitations'>
            <Invitations></Invitations>
          </Route>

          <Route exact path='*'>
            <div>
              <h1>Path is not defined</h1>
            </div>
          </Route>

        </Switch>

      </div>
    </Router>
  );
}

export default App;
