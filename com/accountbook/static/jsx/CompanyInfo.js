import React from 'react';
import {NavItem , Button , Modal,Alert} from 'react-bootstrap';
import {AjaxUtils, Body , Header ,ModalForCreateCardCompany ,ListGroupItemRow}from 'Components';

export default class CardCompanyPage extends React.Component {
    static moduleName="company_info";

    constructor(props) {
        super(props);
        this.state = {
            cardCompanies : [],
            show: false,
            cardCompanyName:'',
            cardCompanyNumber:'',
            showAlert:false,
            showAlertMessage:'',
            deleteList:{},
            selectedItem: undefined,
        }
        this.handleClose = this.handleClose.bind(this);
        this.listAll = this.listAll.bind(this);
        this.handleCreateComapnyInfo = this.handleCreateComapnyInfo.bind(this);
        this.handleModalShow = this.handleModalShow.bind(this);
        this.handleInputChange= this.handleInputChange.bind(this);
        this.handleInputCheck = this.handleInputCheck.bind(this);
        this.handleDeleteItem = this.handleDeleteItem.bind(this);
        this.handleUpdateItem = this.handleUpdateItem.bind(this);
        this.handleSelectedItem = this.handleSelectedItem.bind(this);
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
            AjaxUtils.post(routes['create_company_info'], {
                cardCompanyName: this.state.cardCompanyName,
                cardCompanyNumber: this.state.cardCompanyNumber
            })
                .then(()=>this.listAll());
        }
        else{
            this.setState({showAlertMessage:'값을 입력해주세요' ,showAlert:true});
        }
    }

    handleClose() {
        // this.setState({show:false , cardCompanyName : '' , cardCompanyNumber: ''});
        this.listAll();
    }

    listAll() {
        AjaxUtils.get(routes['get_company_infos'])
            .then(res => this.setState({cardCompanies : res.data,
                                        showAlert:false ,
                                        showAlertMessage:'' ,
                                        show:false ,
                                        cardCompanyNumber:'',
                                        cardCompanyName:'',
                                        deleteList: res.data.reduce((a,b)=>{a[b._id] = false; return a;},{}),
                                        selectedItem: undefined, }));
    }

    handleInputChange(e) {
        console.log(e.target.value);
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

        const len = target ? target.length : 0;
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
        const {deleteList} = this.state;
        const reqData = {_id:[]};
        Object.keys(deleteList).filter(k=>deleteList[k]).map(k=>reqData._id.push(k));
        if(reqData._id.length) {
            AjaxUtils.delete(routes['delete_company_infos'], reqData)
                .then(() => this.listAll())
                .catch(err => err);
        }
    }

    handleUpdateItem() {
        const {cardCompanyName , cardCompanyNumber , selectedItem} = this.state;
        if( this.handleInputCheck(cardCompanyName , 0) === 'success'
            && this.handleInputCheck(cardCompanyNumber , 0) === 'success') {
            AjaxUtils.put(routes['update_company_info'], {  _id: selectedItem ,
                                                    cardCompanyName:cardCompanyName,
                                                    cardCompanyNumber:cardCompanyNumber})
                .then(()=>this.listAll());
        }
    }

    handleSelectedItem(_id) {
        const {cardCompanies} = this.state;
        const item = cardCompanies.find(e=>e._id === _id);
        this.setState({ selectedItem : _id , show: true ,
                        cardCompanyName: item.card_company_name,
                        cardCompanyNumber: item.card_company_number,});
    }
    render() {
        const {cardCompanyName, cardCompanyNumber , selectedItem , deleteList} = this.state;
        const bodyProps ={};
        const bodyChildren =[];
        const modalBody =[];
        let inputValue ;
        let handleModalClick;
        let modalButtonDesc;

        bodyProps.sideBarContents =this.makeSideBarMenu();

        if(selectedItem) {
            inputValue = {  cardCompanyName: cardCompanyName,
                            cardCompanyNumber: cardCompanyNumber };
            handleModalClick = this.handleUpdateItem;
            modalButtonDesc = "수정";
        }
        else {
            inputValue = this.state;
            handleModalClick=this.handleCreateComapnyInfo;
            modalButtonDesc = "생성";
        }

        modalBody.push(<ModalForCreateCardCompany key ="createModalBody"
                                                             onChange={this.handleInputChange}
                                                             inputCheck = {this.handleInputCheck}
                                                             state={inputValue}
                                                             onClick={handleModalClick}
                                                             modalButtonDesc={modalButtonDesc}/>);



        this.state.cardCompanies.length
        && bodyChildren.push(<ListGroupItemRow   num_col={3}
                                                            col_contents={Object.keys(this.state.cardCompanies[0]).filter(item => item !== '_id')}
                                                            key={0}
                                                            header={true}
                                                            bsStyle="success"
                                                            style={{"textAlign":"center"}}
                                                            />)
        && this.state.cardCompanies.map((item,idx )=> {
            const {_id , ...remain} = item;
            let checkBoxRef;
            bodyChildren.push(<ListGroupItemRow key={_id}
                                                           num_col={3}
                                                           col_contents={Object.values(remain)}
                                                           itemkey={_id}
                                                           style={{"textAlign":"center"}}
                                                           checkRef={r=>checkBoxRef = r}
                                                           checked={deleteList[_id]}
                                                           rowClick = {(e)=>{
                                                                   if(e.target.nodeName !== 'INPUT')
                                                                       checkBoxRef.checked =  !deleteList[_id];
                                                                   this.setState({deleteList:{...deleteList , [_id]:!deleteList[_id]}});
                                                                   console.log({...deleteList , [_id]:!deleteList[_id]});
                                                           }}
                                                           handleSelectedItem = {this.handleSelectedItem}/>);
        });
        return(
            <div>
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