import React, { Component } from 'react';
import { Container, Button, Input, Form, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

export default class SignUp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: "",
            email: "",
            password: "",
            gender: null,
            errAlert: false,
            successSignUp: false
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmite = this.onSubmite.bind(this);
    }

    onSubmite(e) {
        e.preventDefault()
        axios.post('/api/signUp ', this.state)
            .then(res => {
                console.log(res)
                this.setState({ errAlert: false })
                this.setState({ successSignUp: true })

            })
            .catch(err => {
                console.log(err)

                this.setState({ errAlert: true })

            })

    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value

        });

    }

    render() {
        const style = {
            marginTop: '100px'
        }
        return (
            <div style={style}>
                <h1>Create a New Account</h1>
                <p>It’s quick and easy.</p>
                {/* onClose={() => this.setState({ errAlert: false })}  */}
                {

                    this.state.errAlert ? <Alert variant="danger" dismissible>
                        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                        <p>
                            You have a problem with your credentials.
                        </p>
                    </Alert> : <div></div>

                }
                {

                    this.state.successSignUp ? <Alert variant="success" dismissible>
                        <Alert.Heading>You've successfuly created an Account</Alert.Heading>
                        <p>
                            Congratulations for creating your account.
                        </p>
                    </Alert> : <div></div>

                }
                <Form>
                    <Form.Group controlId="nameUP">
                        <Form.Control required size="lg" type="text" value={this.state.value} onChange={this.onChange} name="userName" placeholder="User Name" />

                    </Form.Group>
                    <Form.Group controlId="mailUP">

                        <Form.Control required size="lg" type="email" value={this.state.value} onChange={this.onChange} name="email" placeholder="Email" />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="passwordUP">
                        <Form.Control required size="lg" type="password" value={this.state.value} onChange={this.onChange} name="password" placeholder="New Password" />

                    </Form.Group>
                    <Form.Group controlId="genderUP">
                        <Form.Check
                            inline
                            required
                            type="radio"
                            label="Male"
                            name="gender"
                            value="male"
                            id="male"
                            onChange={this.onChange}
                        />
                        <Form.Check
                            inline
                            required
                            type="radio"
                            label="Female"
                            name="gender"
                            value="female"
                            id="female"
                            onChange={this.onChange}
                        />

                    </Form.Group>
                    <Button onClick={this.onSubmite} type="submit">Sign up</Button>
                </Form>

            </div>
        )
    }
}

