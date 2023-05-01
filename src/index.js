import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";

import { GoogleOAuthProvider } from "@react-oauth/google";

import { DataContextProvider } from "./context/dataContext";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="555163836458-ekq299o1li21bvqavnppmuqjt66vv95o.apps.googleusercontent.com">
    <React.StrictMode>
      <DataContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </DataContextProvider>
    </React.StrictMode>
  </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
