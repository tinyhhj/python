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
        console.log('FieldGroup con');
        super(props);
    }



    render() {
        const {id , label , help ,validationstate, value,...sub_props} = this.props;
        // console.log('sub_props : '+ Object.keys(sub_props).map(e=>""+e+" : "+sub_props[e]).join("\n"));
        return(
        <FormGroup
          controlId={id}
          validationState={validationstate}
        >
          <ControlLabel>{label}</ControlLabel>
          <FormControl {...{...sub_props , value}}
          />
          <FormControl.Feedback />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
        )
    }
}