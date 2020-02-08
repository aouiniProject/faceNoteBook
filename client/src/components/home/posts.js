import React, { Component } from 'react';
import { Form, FormControl, Col, Row, Button } from 'react-bootstrap';
import axios from 'axios';
import jwtDecode from 'jwt-decode'

export default class Posts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post: ''
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
            .then(res => console.log(res))
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

                </Row>
            </div>
        )
    }

}