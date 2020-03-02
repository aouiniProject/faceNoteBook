import React, { Component } from "react";
import { Button, Form, Navbar, FormControl } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Redirect } from "react-router-dom";

export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      redirect: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmite = this.onSubmite.bind(this);
    this.login = this.login.bind(this);
  }

  onChange(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  login() {
    this.setState({ redirect: true })
  }

  onSubmite(e) {
    e.preventDefault();

    axios.post('/api/userIn', this.state)
      .then((res) => {
        if (res.data.red) {
          localStorage.setItem('token', res.data.token)

        }

      })
      .then(() => this.login())
      .catch(err => console.log('this is a nono: ' + err))
  }

  render() {
    let { redirect } = this.state
    if (redirect) {
      return (<Redirect to="/Home"></Redirect>)
    }

    const brand = {
      fontSize: "30px"
    };
    const login = {
      marginLeft: "300px"
    };
    return (
      <Navbar expand="lg">
        <Navbar.Brand href="/">
          <b style={brand}>facenotebook</b>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse style={login} id="navbar-nav">
          <Form inline>
            <Form.Control
              required
              type="email"
              value={this.state.value}
              onChange={this.onChange}
              name="email"
              placeholder="Email"
            />
            <Form.Control
              required
              type="password"
              value={this.state.value}
              onChange={this.onChange}
              name="password"
              placeholder="Password"
            />
            <Button
              onClick={this.onSubmite}
              type="submit"
              variant="outline-success"
            >
              Log in
            </Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
