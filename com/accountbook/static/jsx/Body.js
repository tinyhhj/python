import React from 'react';
import {SideBar ,MainContents} from 'Components';
export default class Body extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        const {children , sideBarContents , mainContentsStyle} = this.props;
        console.log(sideBarContents)
     return(
         <div className="w3-container">
             <SideBar width="10%">
                 {sideBarContents}
             </SideBar>
             <MainContents style={mainContentsStyle}>
                 {children}
             </MainContents>
         </div>
      );
    }
}

