import React from "react";
import ReactDOM from "react-dom";
// import './index.css';
import App from './App.js'
import Host from './Host.js'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

// ReactDOM.render(
//     <Router>
//         <Switch>
//           <Route path='/' exact component={App} />
//           <Route path='/host' exact component={Host} />
//         </Switch>
//     </Router>,
//   document.getElementById('root')
// );

ReactDOM.render(<App/> , document.getElementById('root'))