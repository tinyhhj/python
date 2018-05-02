import React from 'react';
import PropType from 'prop-types';
import {ListGroupItemRow , v4 , Body ,Modal , Button , AjaxUtils,FieldGroup , toast as Toast , Select , MdlListItem} from 'Components';


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
        this.mGetIn = this.mGetIn.bind(this);
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
        mainContentsStyle: {marginLeft: '15%',},
        sideBarContentsStyle: {width:'13%'},
        recruit_mapping : {
            naver : {
                openYn : 'use_yn',
                staYmd : 'start_date',
                endYmd : 'end_date',
                dDay : 'd_day',
                jobNm : 'recruit_title',
               /* jobText: 'recruit_data',*/
            }
        }
    }

    mGetIn(obj , path) {
        const [first , ...remain] = path;
        if( !obj ) return false;
        else if( !first ) return true;
        else return this.mGetIn(obj[first] , remain);
    }

    componentDidMount() {
        this.init()


        // if(this.props.tableName === 'recruit_link') {
        //     console.log('table ' + this.props.tableName);
        //     this.interval = setInterval(() => {
        //         AjaxUtils.post(routes['naver_recruit_link'] , { classNm: 'developer',
        //                                                         entTypeCd: '',
        //                                                         searchTxt: '',
        //                                                         startNum: 1,
        //                                                         endNum: 9999} , {formData : true } )
        //             .then(res => {  console.log(res);
        //                             const recruit_lists = res.data.filter(e => e.openYn === 'Y');
        //                             const recruit_mapping = Contents.defaultValue.recruit_mapping.naver;
        //                             const req = {company_name : 'naver'};
        //                             recruit_lists.map(e => {
        //                                 for ( k in recruit_mapping) {
        //                                     req[recruit_mapping[k]] = e[k];
        //                                 }
        //
        //                             })
        //                             clearInterval(this.interval);} );
        //     } , 10*1000)
        // }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    init() {
        let results;
        return AjaxUtils.get(routes['get_table_contents'] , {tableName: this.props.tableName })
            .then(res=> {
                results=res.data;
                console.log('reset..');
                this.inputKeySetting(res.data[0]);
                this.setState({
                    show: false,
                    deleteList: {},
                    mainContents: res.data,
                    modalInput: {}
                })
                return res.data;
            })
        .then(res=> {
                if(this.props.tableName !== 'recruit_link') throw 'no recruit_link';
                return AjaxUtils.post(routes['naver_recruit_link'] , { classNm: 'developer',
                                                                entTypeCd: '',
                                                                searchTxt: '',
                                                                startNum: 1,
                                                                endNum: 9999} , {formData : true } );
            })
            .then(res => {
                const {mainContents} = this.state;
                const recruit_lists = res.data.filter(e => e.openYn === 'Y' && !mainContents.slice(1).reduce((a,b)=>a | b['recruit_title'] === e.jobNm , false));
                console.log(mainContents.slice(1));
                console.log(recruit_lists);
                const recruit_mapping = Contents.defaultValue.recruit_mapping.naver;
                recruit_lists.map((e,i) => {
                    const req = {company_name : 'naver'};
                    for ( var k in recruit_mapping) {
                        if(k === 'dDay' && !e[k]) {
                            e[k] = "9999";
                        }
                        req[recruit_mapping[k]] = e[k];

                    }
                    console.log(req);
                    AjaxUtils.post(routes['create_table_contents'] ,
                        {...req , tableName : 'recruit_link'});

                })
                return results;
            })
            .catch(e=>{console.log(e); return results;});


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
        const options = this.tableModel ? Object.keys(this.tableModel).map((v,i)=><option key={i} value={v}>{v}</option>) : [];

        return this.tableModel ? [  <Select key = {0} inputRef={r=>this.searchSelect = r} options={options} ></Select> ,
                                    <input ref={r=>this.searchInput = r} key ={v4()} type="text"></input>,
                                    <Button key={v4()} onClick={this.handleSearchBtn}>검색</Button>,
                                    <Button key={v4()} onClick={this.handleOpenDialog}>추가</Button> ,
                                    <Button key={v4()} onClick={this.handleDeleteButton}>삭제</Button>,]: [];
    }

    makeContentList(contents){
        if( !contents || contents.length <= 1 ) return Contents.defaultValue.notFoundMessage;
        const items = [];
        const header = Object.keys(contents[0]);
        const sizePerc = contents.reduce((a,b)=> {
            for( var k in b ){
                b[k] = b[k] || '';
                a[k] = a[k] + b[k].toString().length || b[k].toString().length;
                a.sum += b[k].toString().length;
            }
            return a;
        } , {sum:0});
        console.log('sizePerc');
        console.log(sizePerc);
        const widthPerc = header.map(k=>Math.round(sizePerc[k]/sizePerc.sum*100));
        console.log(widthPerc);
        items.push(<MdlListItem      key = {v4()}
                                     num_col={header.length}
                                     col_contents={header}
                                     header={true}
                                     bsStyle="success"
                                     widthPerc = {widthPerc}
                                     style={Contents.defaultValue.listHeader}/>);
        contents.slice(1).forEach(e => {
            const {_id} = e;
            const data = header.map(k => e[k])
            let checkRef;
            items.push(<MdlListItem
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
                widthPerc={widthPerc}
            />
            )});
        return <ul className="mdl-list">{items}</ul>;
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
            // const _key = v4();
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
        const targetValue = this.searchSelect.value;
        const searchValue = this.searchInput.value;

        this.init()
            .then(res=>{
                console.log('filtering..');
                const filteredContents = res.filter((e,i)=> (i === 0 || e[targetValue].toString().includes(searchValue)))
                // console.log(mainContents +' ' +  filteredContents);
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