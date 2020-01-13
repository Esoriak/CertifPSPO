import React, { Component } from 'react'
import axios from 'axios'

import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'

import './Register.css'


class Register extends Component {
  state = {
		formData: {
      Lastname: '',
      Firstname: '',
			Mail: '',
			Password: '',
      repeatPassword: '',
      Company: '',
      Position: '',
      Picture: '',
		},
		showPassword: false,
		success: false,
	}


			handleSubmit = (e) => {
				e.preventDefault()
					axios.post('http://localhost:4000/infos/candidat', {
						Lastame: e.target.Lastname.value,
						Firstame: e.target.Firstname.value,
						Mail: e.target.Mail.value,
						Password: e.target.Password.value,
						Company: e.target.Company.value,
						Position: e.target.Position.value,
						Picture: e.target.Picture.value,
					})
						.then(() => {
							console.log("il se passe un truc")
							this.setState({ success: true }, () => {
								setTimeout(() => this.setState({ success: false }), 1400)
								setTimeout(() => this.setState({ redirect: true }), 1400)				})
						})
				}
				
				

	handleChange = e => {
		const { formData } = this.state;
		formData[e.target.name] = e.target.value;
		this.setState({ formData })
	}

	
	componentDidMount() {
		// custom rule will have name 'isPasswordMatch'
		ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
			const { formData } = this.state;
			if (value !== formData.Password) {
				return false
			}
			return true
		})
	}


  render() {
    const { formData, success, redirect } = this.state


    return (
      <div className="screenRegister">
			{/* <MenuAdmin /> */}

			<div className="adminFormUp" >
{/* 
				<img className="iconUser" src={RC} alt="icone-user" /> */}

				<div className="FormTitleUp">
					{/* <p exact to="/signup" className="FormTitleUp__Link">Enregistrement</p> */}
				</div>

				<div>
					<ValidatorForm
						ref="form"
						onSubmit={this.handleSubmit}
					>

						<TextValidator
							fullWidth
							label="Nom"
							onChange={this.handleChange}
							name="Lastname"
							value={formData.Lastname}
						/>

						<TextValidator
							fullWidth
							label="Prénom"
							onChange={this.handleChange}
							name="Firstname"
							value={formData.Firstname}
						/>

						<TextValidator
							fullWidth
							label="Mail"
							onChange={this.handleChange}
							name="Mail"
							value={formData.Mail}
							validators={['required', 'isEmail']}
							errormessages={['this field is required', 'Email non valide.']}
						/>

						<FormControl fullWidth>
							<InputLabel htmlFor="adornment-password">Mot de Passe</InputLabel>
							<Input
								label="Mot de passe"
								name="Password"
								fullWidth
								type={this.state.showPassword ? 'text' : 'password'}
								value={formData.Password}
								onChange={this.handleChange}
								validators={['required']}
								errormessages={['this field is required']} />
						</FormControl>

						<TextValidator fullWidth
							label="Confirmer Mot de Passe"
							onChange={this.handleChange}
							name="repeatPassword"
							type="password"
							validators={['isPasswordMatch', 'required']}
							errormessages={['Les mots de passe ne correspondent pas.', 'this field is required']}
							value={formData.repeatPassword}
						/>

						<TextValidator
							fullWidth
							label="Company"
							onChange={this.handleChange}
							name="Company"
							value={formData.Company}
						/>

						<TextValidator
							fullWidth
							label="Position"
							onChange={this.handleChange}
							name="Position"
							value={formData.Position}
						/>

						<TextValidator
							fullWidth
							label="Photo de profil"
							onChange={this.handleChange}
							name="Picture"
							value={formData.Picture}
						/>


						<div className="btnSignUp"></div>

						<Button
							type="submit"
							value="Submit"
							color="primary"
							variant="contained"
							disabled={success}
							fullWidth
						>
							{
								(success && 'Compte créé.')
								|| (!success && 'Inscription')
							}
						</Button>

					</ValidatorForm>

					</div>
				</div>
			</div>
    )
  }
}

export default Register
