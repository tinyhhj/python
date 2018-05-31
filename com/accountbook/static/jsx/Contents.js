import React from 'react';
import PropType from 'prop-types';
import {ListGroupItemRow , v4 , Body ,Modal , Button , AjaxUtils,FieldGroup , toast as Toast , Select , MdlListItem , TableHeader , DataTable} from 'Components';


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
        this.getKakaoRecruitPages = this.getKakaoRecruitPages.bind(this);
        this.getKakaoRecruitInfos = this.getKakaoRecruitInfos.bind(this);
        this.getNaverRecruitInfos = this.getNaverRecruitInfos.bind(this);
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
        mainContentsStyle: {marginLeft: '15%' , width : '100%' , height: '715px' , overflow: 'scroll'},
        sideBarContentsStyle: {width:'14.5%'},
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
        console.log('didmount');
        window.update = true;
        this.interval = setInterval(()=>window.update =true , 5*1000*60);
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
        var p = AjaxUtils.get(routes['get_table_contents'] , {tableName: this.props.tableName })
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
            });

        if (this.props.tableName === 'recruit_link' && window.update) {
            p.then(mainContents=>{
                // console.log(mainContents);
                return AjaxUtils.all(
                this.getKakaoRecruitInfos(mainContents),
                this.getNaverRecruitInfos(mainContents))
            }).then(()=>{
                window.update = false;
                this.init();
            })

        }

        return p;

    }
    getNaverRecruitInfos(mainContents) {
        return AjaxUtils.all(AjaxUtils.post(routes['naver_recruit_link'], {
                    classNm: 'developer',
                    entTypeCd: '',
                    searchTxt: '',
                    startNum: 1,
                    endNum: 9999
                }, {formData: true}),
                AjaxUtils.post(routes['mobile_naver_recruit_link'], {
                    classNm: 'developer',
                    entTypeCd: '',
                    searchTxt: '',
                    startNum: 1,
                    endNum: 9999
                }, {formData: true}),
            )
                .then(res => {
                    var recruit_host = 'http://recruit.navercorp.com/naver/job/detail/developer';
                    // mobile or pc 둘중 하나 선택
                    res = res[0].data.length >= res[1].data.length ? res[0] : res[1];
                    const recruit_lists = res.data;
                    const recruit_mapping = Contents.defaultValue.recruit_mapping.naver;
                    recruit_lists.map((e, i) => {
                        const req = {company_name: 'naver',
                            recruit_data: e.classId && e.jobId ?
                                recruit_host + AjaxUtils.qs({annoId: e.annoId , classId: e.classId, jobId:e.jobId})
                                : recruit_host+AjaxUtils.qs({annoId: e.annoId})};
                        const naver = mainContents.filter(v=>v['company_name']==='naver')
                        for (var i = 0; i < naver.length; i++) {
                            var ee = naver[i];
                            if (e.jobNm === ee['recruit_title'] ) {
                                req['_id'] = ee['_id'];
                                break;
                            }
                        }
                        for (var k in recruit_mapping) {
                            req[recruit_mapping[k]] = e[k];
                        }
                        if(req.hasOwnProperty('_id') && (req['use_yn'] === 'N'|| req['d_day'] < 0)) {
                            AjaxUtils.delete(routes['get_table_contents'],
                                {_id: [req['_id']] , tableName:'recruit_link'});
                        }else if (req['use_yn']=== 'N' || req['d_day'] < 0) {
                            //nothing
                        } else {
                            AjaxUtils.post(routes['get_table_contents'],
                                {...req, tableName: 'recruit_link'});
                        }

                    })
                    return mainContents;
                })
                .catch(e => {
                    console.log(e);
                    return mainContents;
                });
    }
    getKakaoRecruitInfos(mainContents) {
        return this.getKakaoRecruitPages().then(res => {
                res.map(e => {
                    var el = document.createElement('html');
                    el.innerHTML = e.data;

                    var titleArr = Array.prototype.slice.call(el.querySelectorAll('.txt_tit')).map(e => e.innerHTML);
                    var linkArr = Array.prototype.slice.call(el.querySelectorAll('.link_notice')).map(e => e.href);
                    var recruitArr = Array.prototype.slice.call(el.querySelectorAll('.link_notice'))
                        .map(e => {
                            var ee = e.parentElement.querySelector('span.txt_period');
                            return ee ? Array.prototype.slice.call(ee.querySelectorAll('span:not(.txt_bar)')).map(e => e.innerHTML).join(', ') : '';
                        });
                    // console.log(linkArr);

                    return [titleArr,
                        linkArr,
                        recruitArr
                    ];
                }).reduce((a, b) => {
                    return [a[0].concat(b[0]), a[1].concat(b[1]), a[2].concat(b[2])];
                }).reduce((a, b, i) => {
                    var k;
                    switch (i) {
                        case 0:
                            k = 'recruit_title';
                            b.forEach(v => a.push({[k]: v, use_yn: 'Y', company_name: 'kakao'}));
                            break;
                        case 1:
                            k = 'recruit_data';
                            b.forEach((v, idx) => a[idx][k] = routes['kakao_host'] + v.slice(v.indexOf('/jobs')));
                            break;
                        case 2:
                            k = 'remark'
                            b.forEach((v, idx) => a[idx][k] = v);
                        // b.forEach((v,idx)=>a[parseInt(idx/2)][k] = )
                        default:
                            break;
                    }
                    return a;
                }, [])
                    .forEach(e => {
                        // console.log(e);
                        var kakao = mainContents.filter(ee=>ee['company_name']==='kakao');
                        // console.log(kakao);
                        for(var i = 0 ; i < kakao.length; i++) {
                            if ( kakao[i]['recruit_title'] === e['recruit_title']) {
                                e['_id'] = kakao[i]['_id'];
                                break;
                            }
                        }

                        if(e.hasOwnProperty('_id') && e['use_yn'] === 'N') {
                            AjaxUtils.post(routes['get_table_contents'],
                            {_id:[e['_id']], tableName: 'recruit_link'})
                        }else {
                            AjaxUtils.post(routes['get_table_contents'],
                            {...e, tableName: 'recruit_link'})
                        }

                    })
            })
    }
    findLastPage() {
        var lp = 1;
        return AjaxUtils.get(routes['kakao_lastpage'],{page:1})
            .then(res => {
                var el = document.createElement('html');
                el.innerHTML = res.data;
                var recruitPage = el;
                if( /.*?page=(\d+)/.test(recruitPage.querySelector('.change_page.btn_lst').href) ) {
                    lp = /.*?page=(\d+)/.exec(recruitPage.querySelector('.change_page.btn_lst').href)[1];
                }
                return lp;
            })
    }

    getKakaoRecruitPages() {
        return this.findLastPage().then(res =>{
           var pages = [];
           for( var i = 0 ; i < res ; i++) {
               pages.push(AjaxUtils.get(routes['kakao_lastpage'] , { page: i+1}))
           }
           return AjaxUtils.all(...pages);
        });

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
        // console.log(modalContents);
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


        const tableHeader = header.filter(e=>!(['start_date','use_yn','end_date'].includes(e))).map(e=> <TableHeader style={{}} key={v4()} name={e}>{e}</TableHeader>);
        const tableData = contents.slice(1).map(e=> {
            const {_id} = e;
            return {
                ...e, mdlRowProps: {
                    onClick: E => {
                        console.log(E.target.children);
                        E.stopPropagation();
                        if( (E.target.nodeName == 'TD' && !E.target.children.length)
                            || (!/mdl-checkbox/.test(E.target.className) && !E.target.nodeName == 'A')
                            )
                            this.handleUpdateButton(_id, e);
                    },
                }, recruit_data : <a target="_blank" href={e['recruit_data']}>{e['recruit_data']}</a>
            }
        });



        return <DataTable
                    sortable
                    selectable
                    shadow={0}
                    rowKeyColumn="_id"
                    rows={tableData}
                    onSelectionChanged={e=>{
                        for (var k in this.state.deleteList) {
                            this.state.deleteList[k] = false;
                        }
                        e.forEach(k=>this.state.deleteList[k]= true)
                    }}
                    style={{width:"100%" , overflow:"scroll"}}
                    >
                {tableHeader}
                </DataTable>;


        // items.push(<MdlListItem
        //                 key = {v4()}
        //                 num_col={header.length}
        //                 col_contents={header}
        //                 header={true}
        //                 // widthPerc = {widthPerc}
        //                 style={Contents.defaultValue.listHeader}
        //                 checkRef={r=>checkAll = r}
        //                 checked={this.state.deleteList.checkAll}
        //                 rowClick={e=>{
        //                     e.stopPropagation();
        //                     if( e.target.nodeName === 'INPUT') {
        //                         console.log('checked : '+checkAll.checked);
        //                         var obj ={checkAll: checkAll.checked};
        //                         contents.slice(1).reduce((a,b)=>{a[b._id] = checkAll.checked; return a;} , obj)
        //                         this.setState({deleteList : obj})
        //                     }
        //                 }
        //                 }/>);
        // contents.slice(1).forEach(e => {
        //     const {_id} = e;
        //     const data = header.map(k => e[k])
        //     let checkRef;
        //     items.push(<MdlListItem
        //         key = {v4()}
        //         num_col = {data.length}
        //         col_contents={data}
        //         checkRef={r=>checkRef = r}
        //         rowClick={e=>{
        //             if(e.target.nodeName !== 'INPUT')
        //                 checkRef.checked = !(checkRef.checked);
        //             .stopPropagation();
        //             console.log({...this.state.deleteList , [_id] : checkRef.checked })
        //             this.setState({deleteList : {...this.state.deleteList , [_id] : checkRef.checked }})
        //         }}
        //         checked={this.state.deleteList[_id]}
        //         updateItem={()=>this.handleUpdateButton(_id , e)}
        //         // widthPerc={widthPerc}
        //     />
        //     )});
        // return <table className="mdl-data-table mdl-js-data-table mdl-data-table--selectable" style={{paddingTop: "0px" , width: "100%" , height: "715px" , overflow: "scroll"}}>{items}</table>;
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
            mainContentsStyle,
            sideBarContentsStyle
        } = Contents.defaultValue;


        console.log(this.state);



        return(

            <div>
                <Body sideBarContents={this.makeSideBarContentList()}
                      mainContentsStyle = {mainContentsStyle}
                        sideBarContentsStyle = {sideBarContentsStyle}>
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