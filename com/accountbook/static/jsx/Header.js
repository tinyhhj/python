import React from 'react';
import {PageHeader
    ,  Navbar
    , Nav
    , NavItem}
from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router';

export default class Header extends React.Component {

    constructor(props){
        super(props);
        this.handleHomeClick = this.handleHomeClick.bind(this);
    }

    handleHomeClick() {
        axios({
            method:'get',
            url :'http://localhost:1338/'
        }).then(() => {console.log('success');
                window.location.href = "/"})
            .catch(err => console.log(err));
    }

    render() {
     return(
        <div>
            <PageHeader>Page Title</PageHeader>
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href={routes['home']}>AccountBook</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav bsStyle="pills"
                         activeKey={this.props.selectedItem}
                         onSelect={this.props.handleSelectItem}>
                        {this.props.navItem}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>);
    }
}

