import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/index.scss';
import 'semantic-ui-css/semantic.min.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { Provider } from 'react-redux';
import store from './store/store';

ReactDOM.render(<React.StrictMode><Provider store={store}><App /></Provider></React.StrictMode>,document.getElementById('root'));

serviceWorkerRegistration.unregister();
