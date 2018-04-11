import React, {Component} from 'react'
import FieldGroup from './FieldGroup'
import {Button
		,ButtonToolbar
		,Panel
		,Alert
} from 'react-bootstrap'
import axios from 'axios';
import { Link } from 'react-router'



export default class InputForm extends React.Component {
	constructor(props) {
		super(props);
		this.state= {
				titleColor: "blue",
				titleSize: undefined,
				adminId: '',
				adminPassword: '',
				showAlert: false,
				alertMessage: ''
		}
		this.submitCheck = this.submitCheck.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.inputCheck = this.inputCheck.bind(this);
	}

	 inputCheck(target, succ_len , error_len ) {
        if(succ_len === undefined) succ_len=5;
        if(error_len === undefined) error_len=0;

        const len = target.length;
        if(len > succ_len) return 'success';
        else if(len > error_len) return 'error';
        return null;
	  }


	submitCheck(e){
		if(this.inputCheck(this.state.adminId) === 'success' && this.inputCheck(this.state.adminPassword) === 'success') {
			const id = e.target.id;
			console.log('inputcheck sucess'+id);
			if(id === "loginButton") {
				axios({
								method: 'post',
								url: '/login',
								data: {
									adminId: this.state.adminId,
										adminPassword: this.state.adminPassword
								}
							})
						.then( response => window.location.href="/home")
						.catch(response => this.setState({
								showAlert: true ,
								alertMessage: '잘못된 아이디 / 비번 입니다.'
						}))
			} else {
				axios({
								method: 'post',
								url: '/signUp',
								data: {
									adminId: this.state.adminId,
										adminPassword: this.state.adminPassword
								}
							})
						.catch(response => this.setState({
								showAlert: true ,
								alertMessage: '존재하는 아이디 입니다.'
						}))

			}
			this.setState({showAlert : false });
		}
		else{
			console.log(typeof e);
			e && e.preventDefault();
			this.setState({showAlert : true,
										 alertMessage: '6글자 이상 입력값을 확인해주세요.(필수)'});
		}
	}

	handleInputChange(e) {
		const obj = {};
		const key = e.target.type === 'text' ? 'adminId' : 'adminPassword';
		obj[key] = e.target.value;
		this.setState(obj);
	}

	render(){
		const titleColor = this.state.titleColor;
		return (
			<div >
				<Panel bsStyle="primary" className="w3-content">
					<Panel.Heading>
						<Panel.Title componentClass="h2">Login</Panel.Title>
					</Panel.Heading>
					<form className="w3-container" action="/signUp" method="POST" onSubmit={this.submitCheck}>
						<FieldGroup
							 name="adminId"
							 type="text"
							 label="Id"
							 placeholder="Enter Id"
							 onChange={this.handleInputChange}
								value= {this.state.adminId}
							 inputCheck={this.inputCheck}
							/>
						<FieldGroup
							name="adminPassword"
							type="password"
							label="password"
							onChange={this.handleInputChange}
							value={this.state.adminPassword}
							inputCheck={this.inputCheck}
							/>
							{this.state.showAlert && <Alert bsStyle="danger">
								<h4>{this.state.alertMessage}</h4>
							</Alert>}
						<div>
							<Button id="loginButton" bsStyle="success" block onClick={this.submitCheck}>login</Button>
							<Button id="signUpButton" bsStyle="primary" block onClick={this.submitCheck} >sign up</Button>
						</div>
					</form>
				</Panel>
			</div>

		);
	}
}
