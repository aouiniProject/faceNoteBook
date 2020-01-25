import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignUp from './signup'
import SignIn from './signin'

export default class Auth extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Container>
                    <SignIn></SignIn>
                    <SignUp></SignUp>
                </Container>
            </div>
        )
    }

}