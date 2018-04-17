import React from 'react';
import {SideBar ,MainContents} from 'Components';
export default class Body extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        const {children , sideBarContents} = this.props;
        console.log(sideBarContents)
     return(
         <div className="w3-container">
             <SideBar width="25%">
                 {sideBarContents}
             </SideBar>
             <MainContents marginLeft="30%">
                 {children}
             </MainContents>
         </div>
      );
    }
}

