// index.jsx
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {AjaxUtils} from 'Components';
AjaxUtils.get('/api/accountbook/routes').then( res=> {
  ReactDOM.render(<App routes={res.data}/>, document.getElementById("content"));
});
