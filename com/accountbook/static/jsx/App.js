import {BrowserRouter as Router , Route , Switch} from 'react-router-dom';

import React from 'react';
import * as Components from 'Components';
const {AjaxUtils , Header , NavItem , v4} = Components;

export default class App extends React.Component
{
    constructor(props){
        super(props);
        this.state = {
            menus: [],
            routeList: [],
        }
        this.init = this.init.bind(this);
    }

    componentDidMount() {
       this.init();
    }

    init() {
         AjaxUtils.get(routes['get_home_menus'])
            .then(res => this.setState({
                menus: res.data,
                routeList: Object.keys(routes)
                    .filter(k=> k && routes[k] !== routes.web && routes[k] !== routes.was && routes[k].startsWith(routes.web))
                    .sort((a,b) => routes[a].length - routes[b].length)
                })
            )
    }
    render() {
        const {menus ,routeList } = this.state;
        const navItems = menus.map(e => <NavItem href={routes[e.Tables_in_accountbook]} eventKey={v4()}>{e.Tables_in_accountbook.toUpperCase().replace('_', ' ')}</NavItem>)
        const rl = routeList.map(k=>{console.log(k.replace(k[0],k[0].toUpperCase()).replace(/_(\w)/g,c=>{return c.replace('_','').toUpperCase()})); return <Route key={v4()} path={routes[k]} component={Components[k.replace(k[0],k[0].toUpperCase()).replace(/_(\w)/g,c=>{return c.replace('_','').toUpperCase()})]}/>})
        console.log(rl);
        return (
            <div className="react-content">
            <Header navItem={navItems}>
            </Header>
                <Router>
                    <Switch>
                        {rl}
                    </Switch>
                </Router>
            </div>
        )
    }
}


