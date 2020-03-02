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
            setShow: false,
            users: {}
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
        axios.post('/api/messages', { message, receiver, token: localStorage.getItem('token') })
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
            results: []

        }

        this.onFriendRequest = this.onFriendRequest.bind(this);
        this.onDeleteRequest = this.onDeleteRequest.bind(this);
        this.onDeleteFriend = this.onDeleteFriend.bind(this);
    }

    componentDidMount() {
        axios.get(`/api/search/${localStorage.getItem('search')}/${localStorage.getItem('token')}`)
            .then(res => {

                const { username } = jwtDecode(localStorage.getItem('token'));
                // console.log(res.data)
                let result = [];
                if (res.data.users.length < 9) {
                    for (let i = 0; i < res.data.users.length; i++) {
                        const elem = res.data.users[i];
                        for (let i = 0; i < res.data.request.length; i++) {
                            const el = res.data.request[i];
                            if (el.sender === elem.username && el.sender !== username || el.accepter === elem.username && el.accepter !== username) {

                                elem.request = el.request;
                                elem.friends = el.friends;
                            }

                        }
                        result.push(elem);
                    }

                } else if (res.data.users.length >= 9) {
                    for (let i = 0; i < 9; i++) {
                        const elem = res.data.users[i];
                        for (let i = 0; i < res.data.request.length; i++) {
                            const el = res.data.request[i];

                            if (el.sender === elem.username && el.sender !== username || el.accepter === elem.username && el.accepter !== username) {

                                elem.request = el.request
                                elem.friends = el.friends
                            }

                        }
                        result.push(elem);
                    }
                }
                this.setState({ results: result })
                // console.log(this.state.results)

            })
            .catch(err => console.log(err))
    }

    onDeleteRequest(e) {
        e.preventDefault();
        const { username } = jwtDecode(localStorage.getItem('token'));
        const contact = e.target.name
        // console.log('delete')
        axios.put(`/api/deleteRequest/${username}/${contact}`)
            .then(res => {
                document.getElementById(contact).innerHTML = `<div></div>`
                console.log(res)
            })
            .catch(err => console.log(err))
    }

    onFriendRequest(e) {
        e.preventDefault();
        const { username } = jwtDecode(localStorage.getItem('token'));
        const receiver = e.target.name;

        axios.post('/api/friendsRequests', { username, receiver })
            .then(res => {
                console.log(receiver);
                // console.log(target);
                document.getElementById(receiver).innerHTML = `<div></div>`

            })
            .catch(err => console.log('nope', err))
    }

    onDeleteFriend(e) {
        e.preventDefault()
        console.log(e.target)
        const { name } = e.target;
        const { username } = jwtDecode(localStorage.getItem('token'));

        axios.put(`/api/deleteFriend/${name}/${username}`)
            .then(res => {
                console.log(res)
                document.getElementById(name).innerHTML = `<div></div>`
            })
            .catch(err => console.log(err))
    }

    render() {
        return (
            <div>
                <Container>
                    <Navb></Navb>
                    {this.state.results.map(user => {
                        // const {request, friends} = user

                        this.state[user.username] = { friends: user.friends, request: user.request }

                        return (
                            <div id={user.username}>
                                <hr></hr>
                                <Row>
                                    <Col>
                                        <h4>{user.username}</h4>
                                    </Col>

                                    <Col>
                                        <Form>

                                            <Button onClick={(e) => {
                                                return this.state[user.username].friends ? this.onDeleteFriend(e) : this.state[e.target.name].request ? this.onDeleteRequest(e) : this.onFriendRequest(e)
                                            }} type="submit" name={user.username}>{this.state[user.username].friends ? 'Delete Follow' : this.state[user.username].request ? 'Delete Request' : 'Add Follow'}</Button>
                                        </Form>
                                    </Col>
                                    <Col>
                                        <SendMsg username={user.username}></SendMsg>
                                    </Col>
                                </Row>
                            </div>
                        )
                    })
                    }


                </Container>
            </div>
        )
    }
}