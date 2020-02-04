import React, { Component } from 'react';
import { Navbar, Nav, Button, Form, FormControl } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

export default class Navb extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            redirect: false
        }

        this.logout = this.logout.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    logout() {
        localStorage.clear()

    }

    onChange(e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    onSearch(e) {
        sessionStorage.setItem('search', `${this.state.search}`)
        // return (<Redirect to="/search"></Redirect>)
        this.setState({ redirect: true })
        e.preventDefault()
    }

    render() {

        const nav = {
            marginLeft: '40px'
        }

        let { redirect } = this.state
        if (redirect) {
            return (<Redirect to="/search"></Redirect>)
        }



        return (
            <div>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="/Home"><b>facenotebook</b></Navbar.Brand>
                    <Form inline>

                        <FormControl type="text" value={this.state.value} onChange={this.onChange} name="search" placeholder="Search"></FormControl >

                        <Button onClick={this.onSearch} type='submit'>Search</Button>
                    </Form>

                    <Nav >
                        <Nav.Link href='/messages'>Messages</Nav.Link>
                        <Nav.Link onClick={this.logout} href='/'>Logout</Nav.Link>
                    </Nav>


                </Navbar>
            </div>
        )
    }
} 