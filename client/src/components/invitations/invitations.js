import React, { Component } from 'react';
import { Container, Col, Row, Button } from 'react-bootstrap';
import axios from 'axios';

import Navb from './../nav/nav';
import JwtDecode from 'jwt-decode';

export default class Invitations extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contacts: []
        }

        this.onDeleteRequest = this.onDeleteRequest.bind(this);
        this.onAccept = this.onAccept.bind(this);
    }

    componentDidMount() {
        axios.get(`http://localhost:3001/api/invites/${localStorage.getItem('token')}`)
            .then(res => this.setState({ contacts: res.data }))
            .then(() => console.log(this.state))
            .catch(err => console.log(err))
    }

    onDeleteRequest(e) {
        const { name } = e.target
        const { username } = JwtDecode(localStorage.getItem('token'));
        axios.put(`http://localhost:3001/api/deleteRequest/${username}/${name}`)
            .then(res => {
                console.log(res)
                let div = document.getElementById(name)
                div.innerHTML = '<div></div>'
            })
            .catch(err => console.log(err))
    }

    onAccept(e) {
        const { name } = e.target
        const { username } = JwtDecode(localStorage.getItem('token'));
        axios.put(`http://localhost:3001/api/sendInvites/${username}/${name}`)
            .then(res => {
                console.log(res)
                let div = document.getElementById(name)
                div.innerHTML = '<div></div>';
            })
            .catch(err => console.log(err))
    }

    render() {
        return (
            <>
                <Container>
                    <Navb></Navb>
                    <div id="contacts">
                        {
                            this.state.contacts.map(contact => (
                                <div id={contact.sender}>
                                    <Row>
                                        <Col>
                                            <h3>{contact.sender}</h3>
                                        </Col>
                                        <Col>
                                            <Button onClick={this.onAccept} type="submit" name={contact.sender}>Accepte Request</Button>
                                        </Col>
                                        <Col>
                                            <Button onClick={this.onDeleteRequest} type="submit" name={contact.sender}>Delete Request</Button>
                                        </Col>
                                    </Row>
                                </div>
                            ))

                        }

                    </div>

                </Container>
            </>
        )
    }
}