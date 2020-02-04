import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Redirect } from 'react-router-dom'
import SignUp from './signup'
import SignIn from './signin'

export default class Auth extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (localStorage.getItem('token')) {
            return (<Redirect to="/Home"></Redirect>)
        }
        return (
            <div>
                <Container >
                    <SignIn></SignIn>
                    <SignUp></SignUp>
                </Container>
            </div>
        )
    }

}