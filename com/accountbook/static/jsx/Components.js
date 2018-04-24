import React from 'react';
import {ListGroupItem ,Button , Checkbox , NavItem , Modal,FormGroup , FormControl} from 'react-bootstrap';
import AjaxUtils from 'AjaxUtils';
import FieldGroup from 'FieldGroup';
import Body from 'Body';
import Header from 'Header';
import CompanyInfo from 'CompanyInfo';
import MessagePattern from 'MessagePattern';
import Home from 'Home';
import Index from 'Index';
import {v4} from 'uuid';
import Spinner , {spinner} from 'Spinner';
import Contents from 'Contents';
import Toast , {toast}from 'Toast'

const SideBar = ({children , width}) => {
    return (
      <div className="w3-sidebar w3-bar-block" style={{width: width}}>
          {children}
      </div>
    );
}

const MainContents = ({children , style}) => {
    return(
        <div style={style}>
            {children}
        </div>
    );
}

const ListGroupItemRow = ({num_col , col_contents ,header, checkRef , checked, rowClick,updateItem, ...props}) => {
    const children = [];
    for(let i = 0 ; i < num_col ; i++) {
        children.push(<div key={`${i}`} style={{marginTop:"10px", float:"left", width:parseInt(60/num_col)+"%"}}>{col_contents[i]}</div>);
    }

    return (
        <ListGroupItem {...props } onClick={rowClick} style={{marginTop:"5px"}}>
            {header ? <div style={{float:"left" , width:"20px"}}></div> : <Checkbox inputRef={checkRef} defaultChecked={checked} style={{ float: "left"}} />}
            {children}
            {!header && <i className="material-icons" style={{marginTop:"10px", float:"right"}} onClick={e=>{e.stopPropagation();updateItem();}}>mode_edit</i>}
            <div style={{clear:"both"}}></div>
        </ListGroupItem>
    )
}

const ModalForCreateCardCompany = ({onChange ,inputCheck ,state , onClick , modalButtonDesc}) =>
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
                    onClick={onClick}>{modalButtonDesc}</Button>]

const Select = ({options , inputRef}) => {

    return <FormGroup controlId="formControlsSelect">
      <FormControl componentClass="select" placeholder="select" inputRef = {inputRef}>
          {options}
      </FormControl>
    </FormGroup>
}


export {SideBar ,
        MainContents ,
        ListGroupItemRow ,
        AjaxUtils ,
        ModalForCreateCardCompany,
        NavItem,
        Body,
        Header,
        CompanyInfo,
        MessagePattern,
        Index,
        v4,
        Home,
        Spinner,
        spinner,
        Contents,
        Modal,
        Button,
        FieldGroup,
        Toast,
        toast,
        Select,
};

