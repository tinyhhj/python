import React from 'react';
import
{
    Button
    , FormGroup
    , FormControl
    , ControlLabel
    , HelpBlock
} from 'react-bootstrap'

export default class FieldGroup extends React.Component {

    constructor(props){
        super(props);
    }



    render() {
        const {id , label,value , help ,inputCheck,succ_len,error_len, ...sub_props} = this.props;
        // const sub_props = {};
        // console.log(this.arrayToObj(['3' , 'label' , 'help' , 'inputcheck']));
        // for( let key in this.props ) {
        // if( !(key in this.arrayToObj(['id' , 'label' , 'help']))) {
        //         sub_props[key] = this.props[key];
        //     }
        // }
    // console.log(props);
    // console.log(sub_props)
        return(
        <FormGroup
          controlId={id}
          validationState={inputCheck(value,succ_len,error_len)}
        >
          <ControlLabel>{label}</ControlLabel>
          <FormControl {...sub_props}
          />
          <FormControl.Feedback />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
        )
    }
}