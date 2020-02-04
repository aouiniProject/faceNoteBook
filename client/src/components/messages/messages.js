import React, { Component } from 'react';
import Navb from './../nav/nav';
import { Container, Row, Col } from 'react-bootstrap';



export default class Messages extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Container>
                    <Navb></Navb>
                </Container>
                <Row>
                    <Col xs={1}>

                    </Col>
                    <Col xs={11}>

                    </Col>
                </Row>
            </div>
        )
    }
}