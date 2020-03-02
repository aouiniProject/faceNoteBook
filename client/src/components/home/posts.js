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
            .then(res => res)
            .catch(err => console.log(err))

    }

    componentDidMount() {
        const { username } = jwtDecode(localStorage.getItem('token'));
        axios.get(`/api/getPosts/${username}`)
            .then(res => {
                // console.log(res)
                this.setState({ friendsPosts: res.data })
            })
            .catch(err => console.log(err))
    }

    render() {
        let randomPlace = {
            marginLeft: document.body.clientWidth * Math.random() - 100 + 'px',
            marginTop: document.body.clientHeight * Math.random() + 'px',
            marginRight: (document.body.clientWidth * Math.random()) + 'px',
            marginDown: document.body.clientHeight * Math.random() + 'px'
        }

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
                    {
                        this.state.friendsPosts.map((friend, i) => {
                            return (
                                <div style={randomPlace}>
                                    <Accordion>
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
                                    </Accordion>
                                </div>
                            )
                        })
                    }
                </Row>
            </div>
        )
    }

}