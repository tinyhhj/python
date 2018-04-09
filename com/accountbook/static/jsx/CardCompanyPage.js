import React from 'react';
import * as Components from './Components';
import {NavItem , Button , Modal,Alert} from 'react-bootstrap';
import Header from './Header';
import Body from './Body';
import AjaxUtils from "../../utils/AjaxUtils";

export default class CardCompanyPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cardCompanies : [],
            show: false,
            cardCompanyName:'',
            cardCompanyNumber:'',
            showAlert:false,
            showAlertMessage:'',
        }
        this.deleteList= {};
        this.handleClose = this.handleClose.bind(this);
        this.listAll = this.listAll.bind(this);
        this.handleCreateComapnyInfo = this.handleCreateComapnyInfo.bind(this);
        this.handleModalShow = this.handleModalShow.bind(this);
        this.handleInputChange= this.handleInputChange.bind(this);
        this.handleInputCheck = this.handleInputCheck.bind(this);
        this.handleDeleteItem = this.handleDeleteItem.bind(this);
    }

    componentDidMount() {
        this.listAll();
    }
    handleModalShow() {
        this.setState({show:true});
    }
    handleCreateComapnyInfo(info) {
        if( this.handleInputCheck(this.state.cardCompanyName , 0) === 'success'
            && this.handleInputCheck(this.state.cardCompanyNumber, 0 ) === 'success') {
            Components.AjaxUtils.post('/cardcompany/create', {
                cardCompanyName: this.state.cardCompanyName,
                cardCompanyNumber: this.state.cardCompanyNumber
            })
                .then(()=>{this.listAll(); this.setState({showAlert:false , showAlertMessage:'' , show:false , cardCompanyNumber:'',cardCompanyName:''})});
        }
        else{
            this.setState({showAlertMessage:'값을 입력해주세요' ,showAlert:true});
        }
    }

    handleClose() {
        this.setState({show:false , cardCompanyName : '' , cardCompanyNumber: ''});
    }

    listAll() {
        Components.AjaxUtils.get('/cardcompany/search')
            .then(res => this.setState({cardCompanies : res.data }));
    }

    handleInputChange(e) {
        console.log(e.target);
        if( e.target.placeholder === "카드회사명" ) {
            this.setState({cardCompanyName:e.target.value});
        }else if( e.target.placeholder === "카드회사번호") {
            this.setState({cardCompanyNumber:e.target.value});
        }
        return e.target.value;
    }

    handleInputCheck(target, succ_len , error_len ) {
        if(succ_len === undefined) succ_len=5;
        if(error_len === undefined ) error_len=0;

        const len = target.length;
        if(len > succ_len) return 'success';
        else if(len > error_len) return 'error';
        return null;
	  }

	  makeSideBarMenu() {
        const menu = [];
        menu.push(<Button key="createButton"
                          onClick={this.handleModalShow}>추가</Button>);
        menu.push(<Button key="deleteButton"
                          onClick={this.handleDeleteItem}>삭제</Button>);
        return menu;
    }

    handleDeleteItem() {
        const {deleteList} = this;
        const reqData = {_id:[]};
        Object.keys(deleteList).filter(k=> deleteList[k].checked).map(k=>reqData._id.push(k));
        AjaxUtils.delete("/cardcompany/delete" , reqData )
            .then(() => this.listAll())
            .catch(err => err);
    }
    render() {
        const headerProps = {navItem:<NavItem eventKey={3} href="#">PropsItem</NavItem>}
        const headerChildren = [];
        const bodyProps ={};
        const bodyChildren =[];
        const modalBody =[];


        bodyProps.sideBarContents =this.makeSideBarMenu();

        modalBody.push(<Components.ModalForCreateCardCompany key ="createModalBody"
                                                             onChange={this.handleInputChange}
                                                             inputCheck = {this.handleInputCheck}
                                                             state={this.state}
                                                             onClick={this.handleCreateComapnyInfo}/>);



        this.state.cardCompanies.length
        && bodyChildren.push(<Components.ListGroupItemRow   num_col={2}
                                                            col_contents={Object.keys(this.state.cardCompanies[0]).filter(item => item !== '_id')}
                                                            key={0}
                                                            header={true}
                                                            bsStyle="success"
                                                            style={{"textAlign":"center"}}/>)
        && this.state.cardCompanies.map((item,idx )=> {
            const {_id , ...remain} = item;
            bodyChildren.push(<Components.ListGroupItemRow key={_id}
                                                           num_col={2}
                                                           col_contents={Object.values(remain)}
                                                           itemkey={_id}
                                                           style={{"textAlign":"center"}}
                                                           checkRef={r => this.deleteList[_id] = r}
                                                           rowClick = {(e)=>{
                                                               if( e.target.nodeName === 'INPUT' ) return;
                                                               this.deleteList[_id].checked  = (this.deleteList[_id].checked ? false : true)
                                                           }}/>);
        });
        return(
            <div>
                <Header {...headerProps}>
                    {headerChildren}
                </Header>
                <Body {...bodyProps}>
                    {bodyChildren}
                </Body>
                <Modal show={this.state.show}
                       onHide={this.handleClose}
                       bsSize="large">
                  <Modal.Header closeButton>
                      <Modal.Title>Pattern</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      {modalBody}
                      {this.state.showAlert && <Alert bsStyle="danger">
                          <h4>{this.state.showAlertMessage}</h4>
							          </Alert>}
                  </Modal.Body>
              </Modal>
            </div>
        );
    }
}