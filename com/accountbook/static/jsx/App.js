import {BrowserRouter as Router , Route , Switch} from 'react-router-dom';
import Loadable from 'react-loadable';
import InputForm from './InputForm';
import MainPortal from './MainPortal'
import React from 'react';
import PatternsPage from './PatternsPage';
import CardCompanyPage from './CardCompanyPage';

export default class App extends React.Component
{
render() {
    return (
            <Router>
                <Switch>
                    <Route exact path="/" component={InputForm}/>
                    <Route  path="/home" component={MainPortal}/>
                    <Route  path="/patterns" component={PatternsPage}/>
                    <Route  path="/cardcompany" component={CardCompanyPage}/>
                </Switch>
            </Router>
        )
    }
}


