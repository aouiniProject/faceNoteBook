import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navb from './../nav/nav';
import Posts from './posts'

export default class Home extends Component {
    constructor(props) {
        super(props)

    }

    render() {
        if (!localStorage.getItem('token')) {
            return (<Redirect to="/"></Redirect>)
        }

        return (
            <div>
                <Container>
                    <Navb></Navb>
                </Container>
                <Posts></Posts>

            </div>
        )
    }
}