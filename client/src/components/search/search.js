import React, { Component, useState } from 'react';
import axios from 'axios';
import Navb from './../nav/nav';
import { Container, Button, Modal, Row, Col, Form } from 'react-bootstrap';
import jwtDecode from 'jwt-decode';


class SendMsg extends Component {
    constructor(props) {
        super(props);

        this.state = {
            receiver: this.props.username,
            message: '',
            setShow: false
        }

        this.onChange = this.onChange.bind(this);
        this.onSend = this.onSend.bind(this);
    }

    onChange(e) {
        e.preventDefault();

        this.setState({ [e.target.name]: e.target.value })

    }

    onSend(e) {
        e.preventDefault();
        const { message, receiver } = this.state;
        axios.post('http://localhost:3001/api/messages', { message, receiver, token: localStorage.getItem('token') })
            .then(res => console.log(res))
            .then(() => console.log(localStorage.getItem('token')))
            .catch(err => console.log(err))
    }

    render() {

        return (
            <>
                <Button variant="primary" onClick={() => this.setState({ setShow: true })}>
                    Send Message
                </Button>

                <Modal
                    show={this.state.setShow}
                    onHide={() => this.setState({ setShow: false, message: "" })}
                    dialogClassName="modal-90w"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="receiver username">
                            TO: {this.props.username}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="message">
                                <Form.Control type="text" onChange={this.onChange} name="message" placeholder="Message" />
                            </Form.Group>
                        </Form>
                        <Modal.Footer>
                            <Button onClick={this.onSend} type="submit">
                                Send
                            </Button>
                        </Modal.Footer>
                    </Modal.Body>
                </Modal>

            </>
        )
    }
}

export default class Search extends Component {
    constructor(props) {
        super(props);

        this.state = {
            result: []
        }

        this.onFriendRequest = this.onFriendRequest.bind(this);
    }

    componentDidMount() {
        axios.get(`http://localhost:3001/api/search/${sessionStorage.getItem('search')}`)
            .then(res => this.setState({ result: res.data }))
            .catch(err => console.log(err))
    }

    onFriendRequest(e) {
        e.preventDefault();
        const { username } = jwtDecode(localStorage.getItem('token'))
        const receiver = e.target.name;
        console.log(username)

        axios.post('/api/friendsRequests', { username, receiver })
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }

    render() {
        return (
            <div>
                <Container>
                    <Navb></Navb>
                    {this.state.result.map(user => {
                        return (
                            <div>
                                <Row>
                                    <Col>
                                        <h2>{user.username}</h2>
                                    </Col>

                                    <Col>
                                        <Form>
                                            <Button onClick={this.onFriendRequest} type="submit" name={user.username}>Add Friend</Button>
                                        </Form>
                                    </Col>
                                    <Col>
                                        <SendMsg username={user.username}></SendMsg>
                                    </Col>
                                </Row>
                                <hr></hr>
                            </div>
                        )
                    })}

                </Container>
            </div>
        )
    }
}