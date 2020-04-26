import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import App from './App';
import List from './components/List';
import Show from './components/Show';
import { registerLocale } from "react-datepicker";
import es from 'date-fns/locale/es';
registerLocale('es', es)

ReactDOM.render(
  <Router>
    <div>
      <Route render={() => <App />} path='/' />
      <Route render={() => <List />} path='/listaIndicadores' />
      <Route render={() => <Show />} path='/detalleElemento/:id' />
    </div>
  </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
