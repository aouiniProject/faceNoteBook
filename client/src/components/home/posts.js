import React, { Component } from 'react';
import { Form, FormControl, Col, Row, Button, Accordion, Card } from 'react-bootstrap';
import axios from 'axios';
import jwtDecode from 'jwt-decode'

export default class Posts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post: '',
            friendsPosts: []
        }
        this.onchange = this.onchange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onchange(e) {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        const { post } = this.state;
        const { username } = jwtDecode(localStorage.getItem('token'));

        axios.post('/api/post', { post, username })
            .then(res => console.log(res))
            .catch(err => console.log(err))

    }

    componentDidMount() {
        const { username } = jwtDecode(localStorage.getItem('token'));
        axios.get(`http://localhost:3001/api/getPosts/${username}`)
            .then(res => {
                console.log(res)
                this.setState({ friendsPosts: res.data })
            })
            .catch(err => console.log(err))
    }

    render() {
        return (
            <div>
                <Row>

                    <Col>
                        <Form>
                            <Row>
                                <Col>
                                    <FormControl value={this.state.value} onChange={this.onchange} type="text" placeholder="Post" name="post"></FormControl>
                                </Col>
                                <Col xs={0}>
                                    <Button onClick={this.onSubmit} type="submit">Post</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Accordion>
                        {
                            this.state.friendsPosts.map((friend, i) => {
                                return (
                                    <Card>
                                        <Card.Header>
                                            <Accordion.Toggle as={Button} eventKey={i}>
                                                {friend[0].poster}
                                            </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey={i}>
                                            <Card.Body>
                                                {
                                                    friend.map((post, i) => {
                                                        if (i === 0) {
                                                            return (
                                                                <div>
                                                                    <p>
                                                                        {post.post}

                                                                    </p>
                                                                </div>
                                                            )
                                                        }
                                                        return (
                                                            <div>
                                                                <hr></hr>
                                                                <p>
                                                                    {post.post}

                                                                </p>
                                                            </div>

                                                        )
                                                    })
                                                }
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                )
                            })
                        }
                    </Accordion>
                </Row>
            </div>
        )
    }

}