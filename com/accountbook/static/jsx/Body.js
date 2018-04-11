import React from 'react';
import {SideBar ,MainContents} from 'Components';
export default class Body extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        const {sideBarContents} = this.props;
     return(
         <div className="w3-container">
             <SideBar width="25%">
                 {sideBarContents}
             </SideBar>
             <MainContents marginLeft="30%">
                 {this.props.children}
             </MainContents>
         </div>
      );
    }
}

