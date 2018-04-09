import React from 'react';
import {ListGroupItem ,Button , Checkbox} from 'react-bootstrap';
import AjaxUtils from '../../utils/AjaxUtils';
import FieldGroup from './fieldGroup';


const SideBar = ({children , width}) => {
    return (
      <div className="w3-sidebar w3-bar-block" style={{width: width}}>
          {children}
      </div>
    );
}

const MainContents = ({children , marginLeft}) => {
    return(
        <div style={{"marginLeft": marginLeft}}>
            {children}
        </div>
    );
}

const ListGroupItemRow = ({num_col , col_contents ,header, checkRef, rowClick, ...props}) => {
    const children = [];
    for(let i = 0 ; i < num_col ; i++) {
        children.push(<div key={`${i}`} style={{float:"left", width:parseInt(90/num_col)+"%"}}>{col_contents[i]}</div>);
    }

    return (
        <ListGroupItem {...props } onClick={rowClick}>
            {!header && <Checkbox inputRef={checkRef}style={{float: "left"}} inline/>}
            {children}
            <div style={{clear:"both"}}></div>
        </ListGroupItem>
    )
}

const ModalForCreateCardCompany = ({onChange ,inputCheck ,state , onClick}) =>
    [<FieldGroup
               key="cardCompanyName"
							 id="cardCompanyName_id"
							 type="text"
							 label="카드회사명"
							 placeholder="카드회사명"
               onChange={onChange}
               succ_len={0}
               inputCheck={inputCheck}
               value={state.cardCompanyName}
							/> , <FieldGroup
               key="cardCompanyNumber"
							 id="cardCompanyNumber_id"
							 type="text"
							 label="카드회사번호"
							 placeholder="카드회사번호"
               onChange={onChange}
               succ_len={0}
               inputCheck={inputCheck}
               value={state.cardCompanyNumber}
							/>,<Button key="createButton"
                    bsStyle="primary"
                    onClick={onClick}>생성</Button>]



export {SideBar , MainContents , ListGroupItemRow , AjaxUtils , ModalForCreateCardCompany};

