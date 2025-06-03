import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import HeaderComponent from './components/HeaderComponent';
import FooterComponent from './components/FooterComponent';
import TaskList from './components/Tasks/TaskList';
import AddTask from './components/Tasks/AddTask';


function App() {
  return (
    <div>
        <Router>
              <HeaderComponent />
                <div className="container">
                    <Switch> 
                          <Route path = "/" exact component = {TaskList}></Route>
                          <Route path = "/tasks" exact component = {TaskList}></Route>
                          <Route path="/tasks/add-task" component={AddTask}></Route>
                          </Switch>
                </div>
              <FooterComponent />
        </Router>
    </div>
    
  );
}

export default App;
