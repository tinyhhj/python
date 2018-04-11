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
        const {id , label , help ,inputCheck,succ_len,error_len, ...sub_props} = this.props;
        // console.log('sub_props : '+ Object.keys(sub_props).map(e=>""+e+" : "+sub_props[e]).join("\n"));
        return(
        <FormGroup
          controlId={id}
          validationState={inputCheck(sub_props.value,succ_len,error_len)}
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