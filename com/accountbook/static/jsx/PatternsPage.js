import React from 'react';
import Header from './Header';
import Body from './Body';
import axios from 'axios';
import {ListGroup , ListGroupItem , Modal , Alert} from 'react-bootstrap';
import {ListGroupItemRow} from "./Components";


export default class PatternsPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            patterns: [],
            show: false ,
            selectedId: undefined
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        axios({
            method: 'get',
            url: '/patterns/search'
        }).then( response => {this.setState({patterns : response.data});})
            .catch( error => this.setState({patterns: []}));
    }

    handleShow(_id) {
        this.setState({show:true,selectedId:_id});
    }
    handleClose() {
        this.setState({show:false,selectedId:undefined});
    }

    render() {
        // this.state.patterns && this.state.patterns.map(item=>)
        const headerProps = {};
        const headerChildren= [];
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
                      {this.state.selectedId && [<ListGroupItemRow {...{num_col , col_contents: selectedContents.header}} bsStyle="success"/>,
                                                <ListGroupItemRow {...{num_col,col_contents: selectedContents[this.state.selectedId]}} />]}
                  </Modal.Body>
              </Modal>
          </div>
        );
    }
}