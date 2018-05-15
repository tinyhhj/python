import React from 'react';
import {SideBar ,MainContents} from 'Components';
export default class Body extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        const {children , sideBarContents , mainContentsStyle , sideBarContentsStyle} = this.props;
        console.log(sideBarContents)
     return(
         <div className="mdl-layout mdl-js-layout mdl-layout--fixed-drawer has-drawer is-upgraded">
             <SideBar style={sideBarContentsStyle}>
                 {sideBarContents}
             </SideBar>
             <MainContents style={mainContentsStyle}>
                 {children}
             </MainContents>
         </div>
      );
    }
}

