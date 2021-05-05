import './App.css';

import JellyBeanHome from './pages/JellyBeanHome'
import SelectWorld from './pages/SelectWorld'
import ShowWorld from './pages/ShowWorld'

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom"; 


function App() {

  return (
    <Router >
      <div style={{backgroundColor:'#212459', height: '100vh'}} className="App">
      
        <Switch>
          <Route component={JellyBeanHome}exact path="/" />
          <Route component={SelectWorld}exact path="/selectWorld" />
          <Route component={ShowWorld}exact path="/showWorld" />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
