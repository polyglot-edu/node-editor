import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from '@fluentui/react';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './components/Card/Card.css';
import './index.css';

initializeIcons();

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Toaster
          position='bottom-center'
        />
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();