import {BrowserRouter as Router , Route , Switch} from 'react-router-dom';

import React from 'react';
import * as Components from 'Components';
const {AjaxUtils , Header , NavItem , v4 , Spinner} = Components;

export default class App extends React.Component
{
    constructor(props){
        super(props);
        this.state = {
            menus: [],
            routeList: [],
            routes : props.routes,
        }
        this.init = this.init.bind(this);
        this.initContents = {};
    }

    componentDidMount() {
       this.init();
    }

    init() {
        const {routes} = this.state;
        if( routes ) {
            AjaxUtils.get(routes['get_home_menus'])
                .then(res => {
                    const requests = res.data.map(e => AjaxUtils.post(routes['get_table_contents'] , {tableName: e.Tables_in_accountbook})
                                                                .then(res => this.initContents[e.Tables_in_accountbook] = res.data));
                    AjaxUtils.all(...requests)
                        .then(() => console.log(this.initContents));
                }


                    // this.setState({
                    //     menus: res.data,
                    //     routeList: Object.keys(routes)
                    //         .filter(k => k && k !== 'web' && routes[k] !== routes.was && routes[k].startsWith(routes.web))
                    //         .sort((a, b) => routes[b].length - routes[a].length),
                    // })
                )
        }
    }
    render() {
        const {menus ,routeList , routes } = this.state;
        const navItems = menus.map(e => <NavItem key={v4()} href={routes[e.Tables_in_accountbook]} eventKey={v4()}>{e.Tables_in_accountbook.toUpperCase().replace('_', ' ')}</NavItem>)
        const rl = routeList.map(k=>{return <Route key={v4()}
                                                   path={routes[k]}
                                                   // component={Components[k.replace(k[0],k[0].toUpperCase()).replace(/_(\w)/g,c=>{return c.replace('_','').toUpperCase()})]}

                                                     />})
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
            <Spinner />
            </div>
        )
    }
}


