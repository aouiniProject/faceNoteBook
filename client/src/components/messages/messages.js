import React, { Component } from 'react';
import Navb from './../nav/nav';
import { Container, Row, Col, ButtonGroup, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import jwtDecode from 'jwt-decode';


export default class Messages extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: "",
            receiver: "",
            messages: [],
            contacts: []
        }

        this.getMessages = this.getMessages.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSend = this.onSend.bind(this);
    }

    onSend(e) {
        e.preventDefault();
        const { message, receiver } = this.state;
        axios.post('http://localhost:3001/api/messages', { message, receiver, token: localStorage.getItem('token') })
            .then(() => console.log(localStorage.getItem('token')))
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }

    onChange(e) {
        e.preventDefault()

        this.setState({ [e.target.name]: e.target.value });
        console.log(this.state)
    }

    componentDidMount() {
        const { username } = jwtDecode(localStorage.getItem('token'))
        console.log(username)

        axios.get(`http://localhost:3001/api/getContacts/${localStorage.getItem('token')}`)
            .then(res => {
                let contacts = {};

                for (let i = 0; i < res.data.results.length; i++) {
                    const el = res.data.results[i];

                    if (contacts[el['poster']] !== el.poster || contacts[el['poster']] !== el.receiver) {
                        if (el['poster'] !== username) {
                            contacts[el['poster']] = 1
                        }
                        if (el['receiver'] !== username) {
                            contacts[el['receiver']] = 1

                        }
                    }
                }

                this.setState({ contacts: Object.keys(contacts) });

            })
            .then(() => {

                const { username } = jwtDecode(localStorage.getItem('token'));
                const friend = this.state.contacts[this.state.contacts.length - 1];
                this.setState({ receiver: friend })

                axios.get(`http://localhost:3001/api/retrieve/${username}/${friend}`)
                    .then(res => {
                        console.log(res.data)
                        let arr = [];
                        if (res.data.length >= 7) {

                            for (let i = res.data.length - 1; i >= res.data.length - 7; i--) {
                                const el = res.data[i];
                                arr.push(el)
                            }
                        } else if (res.data.length < 7) {
                            for (let i = res.data.length - 1; i >= 0; i--) {
                                const el = res.data[i];
                                arr.push(el)
                            }
                        }
                        this.setState({ messages: arr })
                        console.log(this.state.messages)

                    })
                    .catch(err => console.log(err))

            })
    }

    getMessages(e) {
        e.preventDefault();
        this.setState({ receiver: e.target.name })
        const { username } = jwtDecode(localStorage.getItem('token'))

        axios.get(`http://localhost:3001/api/retrieve/${username}/${e.target.name}`)
            .then(res => {
                console.log(res.data)
                let arr = [];
                if (res.data.length >= 7) {

                    for (let i = res.data.length - 1; i >= res.data.length - 7; i--) {
                        const el = res.data[i];
                        arr.push(el)
                    }
                } else if (res.data.length < 7) {
                    for (let i = res.data.length - 1; i >= 0; i--) {
                        const el = res.data[i];
                        arr.push(el)
                    }
                }
                this.setState({ messages: arr })

            })
            .catch(err => console.log(err))
    }

    render() {
        return (
            <div>
                <Container>
                    <Navb></Navb>
                </Container>
                <Row>
                    <Col xs={1}>
                        <ButtonGroup vertical>
                            {

                                this.state.contacts.map(friend => {
                                    return (

                                        <Button size="lg" name={friend} onClick={this.getMessages} type="button">{friend}</Button>

                                    )
                                })
                            }
                        </ButtonGroup>
                    </Col>
                    <Col xs={11}>

                        {
                            this.state.contacts[0] ?
                                <Form>

                                    <Row>
                                        <Col xs={11}>
                                            <Form.Group controlId="sendMessage">
                                                <Form.Control size="lg" onChange={this.onChange} name="message" type="text" placeholder="Send Message" />

                                            </Form.Group>
                                        </Col>
                                        <Col xs={1}>
                                            <Button onClick={this.onSend} size="lg" type='submit' >Send</Button>
                                        </Col>

                                    </Row>
                                </Form> : <div></div>
                        }

                        {
                            this.state.messages.map((message, i) => {
                                if (i !== 0) {
                                    return (
                                        <div>
                                            <hr></hr>
                                            <h6><b>{message.poster}</b></h6>
                                            <p><b>{message.message}</b></p>
                                        </div>
                                    )
                                }
                                else {
                                    return (
                                        <div>

                                            <h6><b>{message.poster}</b></h6>
                                            <p>{message.message}</p>
                                        </div>
                                    )
                                }
                            })
                        }
                    </Col>
                </Row>
            </div >
        )
    }
}