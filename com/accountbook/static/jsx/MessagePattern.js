import React from 'react';
import {ListGroup , Modal } from 'react-bootstrap';
import {ListGroupItemRow , Body , AjaxUtils} from "Components";



export default class PatternsPage extends React.Component {
    static moduleName="message_pattern";
    constructor(props){
        super(props);
        this.state = {
            patterns: [],
            show: false ,
            selectedId: undefined
        };
        this.handleShow = this.handleShow.bind(this);
        this.getAllPatterns = this.getAllPatterns.bind(this);
    }

    componentDidMount() {
        this.getAllPatterns();
    }

    getAllPatterns() {
        AjaxUtils.get(routes['get_message_patterns'])
            .then(res => this.setState({patterns : res.data,
                                        show : false,
                                        selectedId : undefined,}));
    }

    handleShow(_id) {
        this.setState({show:true,selectedId:_id});
    }

    render() {
        // this.state.patterns && this.state.patterns.map(item=>)
        const bodyProps ={};
        const bodyChildrenList = [];
        const selectedContents ={};

        const num_col = 4;
        // console.log(this.state.patterns.length , this.state.patterns);
        this.state.patterns instanceof Array
        && this.state.patterns.length
        && this.state.patterns.map((item,idx) => {
            let col_contents = [];
            const { _id, company_info_id , use_yn , ...sub_props} = item;
            if(idx === 0 ) {
                col_contents = Object.keys(sub_props);
                bodyChildrenList.push(<ListGroupItemRow header={true}
                                                        key={_id+".header"}
                                                        {...{num_col , col_contents, bsStyle:"success"}}/>)
                selectedContents.header = col_contents;
            }
            col_contents = Object.values(sub_props);
            selectedContents[_id] = col_contents;
            col_contents = col_contents.map(item=>item.length > 100 ? item.replace(/\s/g,'').substr(0,20).concat("..."):item);
            bodyChildrenList.push(<ListGroupItemRow key={_id}
                                                    onClick={()=>this.handleShow(_id)}
                                                    {...{num_col , col_contents ,_id }}/>);
        });
        const bodyChildren = (<ListGroup >{bodyChildrenList}</ListGroup>)


        return(
          <div>
              <Body {...bodyProps}>
              {bodyChildren}
              </Body>
              <Modal show={this.state.show}
                     onHide={this.getAllPatterns}
              bsSize="large">
                  <Modal.Header closeButton>
                      <Modal.Title>Pattern</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      {this.state.selectedId && [<ListGroupItemRow {...{num_col , col_contents: selectedContents.header}} bsStyle="success"/>,
                                                <ListGroupItemRow {...{num_col,col_contents: selectedContents[this.state.selectedId]}} />]}
                  </Modal.Body>
              </Modal>
          </div>
        );
    }
}