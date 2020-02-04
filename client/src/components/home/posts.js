import React, { Component } from 'react';
import { Form, FormControl, Col, Row, Button } from 'react-bootstrap';

export default class Posts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post: ''
        }
        this.onchange = this.onchange.bind(this);
    }

    onchange(e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value });
    }



    render() {
        return (
            <div>
                <Row>
                    <Col xs={1}>

                    </Col>
                    <Col xs={11}>
                        <Form>
                            <Row>
                                <Col>
                                    <FormControl value={this.state.value} onChange={this.onchange} type="text" placeholder="Post" name="post"></FormControl>
                                </Col>
                                <Col xs={1}>
                                    <Button type="submit">Post</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>

            </div>
        )
    }

}