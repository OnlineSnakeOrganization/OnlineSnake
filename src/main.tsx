import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App'
import './css/index.css' //The default css file which is over everything

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <BrowserRouter basename="/OnlineSnake">
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );