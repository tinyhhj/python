import React from 'react';
import PropType from 'prop-types';
import {ListGroupItemRow , v4 , Body ,Modal , Button , AjaxUtils,FieldGroup , toast as Toast , Select} from 'Components';


export default class Contents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            deleteList: {},
            mainContents: [],
            modalInput: {},
        };
        this.handleCloseDialog = this.handleCloseDialog.bind(this);
        this.handleCreateButton = this.handleCreateButton.bind(this);
        this.handleDeleteButton = this.handleDeleteButton.bind(this);
        this.handleOpenDialog= this.handleOpenDialog.bind(this);
        this.handleUpdateButton = this.handleUpdateButton.bind(this);
        this.inputKeySetting = this.inputKeySetting.bind(this);
        this.handleSearchBtn = this.handleSearchBtn.bind(this);
        this.makeSideBarContentList = this.makeSideBarContentList.bind(this);
        this.init = this.init.bind(this);
    }

    static defaultProps = {
        modalSize: 'large',
        modalBackDrop: true,
        tableName: '',
    }

    static propTypes =  {
        modalSize: PropType.string,
        modalBackDrop: PropType.bool,
        tableName: PropType.string.isRequired,
    }

    static defaultValue = {
        listHeader: {textAlign:"center"},
        notFoundMessage: (<h5 style={{textAlign : "center"}}>조회할 데이터가 없습니다</h5>),
        mainContentsStyle: {marginLeft: '15%' , overflow:'hidden'},
        sideBarContentsStyle: {width:'13%'},
    }

    componentDidMount() {
        this.init();
    }

    init() {
        return AjaxUtils.get(routes['get_table_contents'] , {tableName: this.props.tableName })
            .then(res=> {
                this.inputKeySetting(res.data[0]);
                this.setState({
                    show: false,
                    deleteList: {},
                    mainContents: res.data,
                    modalInput: {}
                })
            })


    }

    inputKeySetting(res) {
        this.tableModel = Object.keys(res ? res : this.tableModel)
            .reduce((a,b) =>{a[b] = v4(); return a;},{} )


    }

    handleCloseDialog() {
        this.init()
    }

    handleOpenDialog() {
        const {modalInput} = this.state;
        const modalButton = "추가";
        this.setState({
            show: true,
            modalInput: {...modalInput , modalButton},
        })
    }
    handleUpdateButton(id , elem) {
        const modalButton="수정";
        // this.inputKeySetting();
        this.setState({
            show: true,
            modalInput : {...elem , modalButton}
        })
    }

    handleCreateButton(modalContents) {
        const { modalInput : {modalButton} } = this.state;
        console.log(modalContents);
        if ( modalContents.filter(e => e.props.validationstate !== 'success').length ) {
            Toast.forEach(t=>t.show('warning' , '입력항목을 채워주세요.'));
            return;
        }
        AjaxUtils.post(routes['create_table_contents'] ,
            {...this.state.modalInput , tableName : this.props.tableName}
            ,{message : modalButton+' 되었습니다.'})
            .then(()=>this.init());
    }

    handleDeleteButton() {
        const {deleteList} = this.state;
        const deleteLists = Object.keys(deleteList).filter(k => deleteList[k] === true);
        if ( deleteLists.length ) {
          AjaxUtils.delete(routes['delete_table_contents'] , deleteLists
                                                                .reduce((a,b)=>{a._id = a._id || [];
                                                                                a._id.push(b);
                                                                                return a;} , {tableName: this.props.tableName})
                                                            , {message : '삭제 되었습니다.'})
              .then(res=> this.init())
        } else {
            // toast error
            Toast.forEach(t=>t.show('warning' , '삭제항목을 선택해주세요.'));
        }
    }

    makeSideBarContentList() {
        const options = this.tableModel ? Object.keys(this.tableModel).map(v=><option key={v4()} value={v}>{v}</option>) : [];

        return this.tableModel ? [  <Select key = {v4()} inputRef={r=>this.searchSelect = r} options={options}></Select> ,
                                    <input ref={r=>this.searchInput = r}key ={v4()} type="text"></input>,
                                    <Button key={v4()} onClick={this.handleSearchBtn}>검색</Button>,
                                    <Button key={v4()} onClick={this.handleOpenDialog}>추가</Button> ,
                                    <Button key={v4()} onClick={this.handleDeleteButton}>삭제</Button>,]: [];
    }

    makeContentList(contents){
        if( !contents || contents.length <= 1 ) return Contents.defaultValue.notFoundMessage;
        const items = [];
        const header = Object.keys(contents[0]);
        items.push(<ListGroupItemRow key = {v4()}
                                     num_col={header.length}
                                     col_contents={header}
                                     header={true}
                                     bsStyle="success"
                                     style={Contents.defaultValue.listHeader}/>);
        contents.slice(1).forEach(e => {
            const {_id} = e;
            const data = header.map(k => e[k])
            let checkRef;
            items.push(<ListGroupItemRow
                key = {v4()}
                num_col = {data.length}
                col_contents={data}
                checkRef={r=>checkRef = r}
                rowClick={e=>{
                    if(e.target.nodeName !== 'INPUT')
                        checkRef.checked = !(checkRef.checked);
                    e.stopPropagation();
                    console.log({...this.state.deleteList , [_id] : checkRef.checked })
                    this.setState({deleteList : {...this.state.deleteList , [_id] : checkRef.checked }})
                }}
                checked={this.state.deleteList[_id]}
                updateItem={()=>this.handleUpdateButton(_id , e)}
            />
            )});
        return items;
    }

    getFieldType(k) {
        // succ_len 추가
        if( /password/.exec(k)) return ['password' , 1 ] ;
        else if(/admin_id/.exec(k)) return ['text' , 1 ] ;
        else if(/_id/.exec(k)) return ['text' , 1];
        else if(/date/.exec(k)) return ['datetime' , 1];
        else if(/perc/.exec(k)) return ['text' , 1];
        else  return ['text' , 1];
    }

    makeModalContents() {
        const modalContents =  Object.keys(this.tableModel).filter(k=> k!=='modified_date' && (k !== 'use_yn' || this.state.modalInput.modalButton === '수정') && k !== '_id').map(k => {
            const _key = this.tableModel[k];
            const [type , succ_len] = this.getFieldType(k);
            const value = this.state.modalInput[k];
            const validationState =  (value && (typeof value === 'number' || value.length >= succ_len) ) ? "success" : (!value || !value.length) ? null : "error";
            // console.log(''+ typeof value + ' '+ value +' '+validationState + ' ' + type + ' ' +succ_len);
            return <FieldGroup key={_key}
                               id={_key}
                               label={k}
                               type={type}
                               onChange={e=>{e.stopPropagation();
                                            this.setState({modalInput : {...this.state.modalInput , [k]:e.target.value}})}}
                               value={this.state.modalInput[k]}
                               succ_len={succ_len}
                               validationstate = {validationState}/>
        })

        modalContents.push(<Button key={v4()} onClick={()=>this.handleCreateButton([...modalContents.slice(0,-1)])}>{this.state.modalInput.modalButton}</Button>);
        return modalContents;
    }

    handleSearchBtn() {

        this.init()
            .then(()=>{
                const {mainContents} = this.state;
                const filteredContents = mainContents.filter((e,i)=> (i === 0 || e[this.searchSelect.value].toString().includes(this.searchInput.value)))
                console.log(mainContents +' ' +  filteredContents);
                this.setState(
                {mainContents:filteredContents}
            )})
    }

    render() {
        const {
            modalSize,
            modalBackDrop,
        } = this.props;

        const {
            show,
            mainContents,
        } = this.state;

        const {
            mainContentsStyle
        } = Contents.defaultValue;


        console.log(this.state);



        return(

            <div>
                <Body sideBarContents={this.makeSideBarContentList()}
                      mainContentsStyle = {mainContentsStyle}>
                {this.makeContentList(mainContents)}
                </Body>
                <Modal show={show}
                       onHide={this.init}
                       bsSize={modalSize}
                       backdrop={modalBackDrop}>
                  <Modal.Header closeButton>
                      <Modal.Title>{this.props.tableName.toUpperCase().replace(/_/g,' ')}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      {show && this.makeModalContents()}
                  </Modal.Body>
              </Modal>
            </div>
        )
    }
}