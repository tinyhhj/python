// index.jsx
import React from "react";
import ReactDOM from "react-dom";
import InputForm from "./Index";
import Header from "./Header";
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import App from "./App";

const obj = {
  handleSelectItem(key){
    this.obj.selectedItem = key;
  },
  selectedItem: 0
}
ReactDOM.render(<App {...obj}/>, document.getElementById("content"));