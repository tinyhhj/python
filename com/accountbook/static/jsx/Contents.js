import React from 'react';
import PropType from 'prop-types';
import {ListGroupItemRow , v4 , Body ,Modal , Button , AjaxUtils,FieldGroup , toast as Toast} from 'Components';


export default class Contents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            deleteList: {},
            mainContents: [],
            sideBarContents: [],
            modalContents: [],
        };
        this.handleCloseDialog = this.handleCloseDialog.bind(this);
        this.handleCreateButton = this.handleCreateButton.bind(this);
        this.handleDeleteButton = this.handleDeleteButton.bind(this);
        this.handleOpenDialog= this.handleOpenDialog.bind(this);
        this.handleUpdateButton = this.handleUpdateButton.bind(this);
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
        notFoundMessage: (<h5>데이터가 없습니다</h5>),
        mainContentsStyle: {marginLeft: '15%' , overflow:'hidden'},
        sideBarContentsStyle: {width:'13%'},
    }

    componentDidMount() {
        this.init();
    }

    init() {
        AjaxUtils.get(routes['get_table_contents'] , {tableName: this.props.tableName})
            .then(res=> {
                this.tableModel = Object.keys(res.data[0])
                    .reduce((a,b) =>{a[b] = v4(); return a;},{} )
                this.setState({
                    show: false,
                    deleteList: {},
                    mainContents: res.data,
                    modalInput: {}
                })
            })


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
        this.setState({
            show: true,
            modalInput : {...elem , modalButton}
        })
    }

    handleCreateButton() {
        const { modalInput : {modalButton} } = this.state;
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
        return this.tableModel ? [ <Button key={v4()} onClick={this.handleOpenDialog}>추가</Button> , <Button key={v4()} onClick={this.handleDeleteButton}>삭제</Button>] : [];
    }

    makeContentList(contents){
        if( !contents || !contents.length ) return Contents.defaultValue.notFoundMessage;
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
        if( /password/.exec(k)) return 'password';
        else if(/admin_id/.exec(k)) return 'text';
        else if(/_id/.exec(k)) return 'number';
        else if(/date/.exec(k)) return 'datetime';
        else if(/perc/.exec(k)) return 'number';
        else  return 'text';
    }

    makeModalContents() {
        const modalContents =  Object.keys(this.tableModel).filter(k=> k!=='modified_date' && (k !== 'use_yn' || this.state.modalInput.modalButton === '수정') && k !== '_id').map(k => {
            const _key = this.tableModel[k];
            return <FieldGroup key={_key}
                               id={_key}
                               label={k}
                               type={this.getFieldType(k)}
                               onChange={e=>{e.stopPropagation();
                                            this.setState({modalInput : {...this.state.modalInput , [k]:e.target.value}})}}
                               value={this.state.modalInput[k]}/>
        })
        modalContents.push(<Button key={v4()} onClick={this.handleCreateButton}>{this.state.modalInput.modalButton}</Button>);
        return modalContents;
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
                       onHide={this.handleCloseDialog}
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