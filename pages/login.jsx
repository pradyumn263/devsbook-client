import { useState, useEffect } from "react";
import Layout from "../components/layout";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../helpers/alert";
import { API } from "../config";

import Link from "next/link";
import Router from "next/router";

//Authentication Imports
import { authenticate, isAuth } from "../helpers/auth";

//BootStrap Components
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const Login = () => {
	const [state, setState] = useState({
		email: "",
		password: "",
		error: "",
		success: "",
		buttonText: "Login",
	});

	useEffect(() => {
		isAuth() &&
			(isAuth().role === "admin"
				? Router.push("/admin")
				: Router.push("/user"));
	}, []);

	const { email, password, error, success, buttonText } = state;

	const handleChange = (name) => (e) => {
		setState({
			...state,
			[name]: e.target.value,
			error: "",
			success: "",
			buttonText: "Login",
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setState({ ...state, buttonText: "Logging in..." });

		try {
			const response = await axios.post(`${API}/login`, {
				email,
				password,
			});

			//response : user token
			// console.table({ response });
			authenticate(response, () => Router.push("/"));
		} catch (error) {
			setState({
				...state,
				buttonText: "Login",
				error: error.response.data.error,
			});
			console.log("ERROR IS HERE!", error);
		}
	};

	const loginForm = () => {
		return (
			<Form onSubmit={handleSubmit}>
				<Form.Group controlId="formBasicEmail">
					<Form.Label>Email address</Form.Label>
					<Form.Control
						onChange={handleChange("email")}
						type="email"
						placeholder="Enter email"
					/>
					<Form.Text className="text-muted">
						We'll never share your email with anyone else.
					</Form.Text>
				</Form.Group>

				<Form.Group controlId="formBasicPassword">
					<Form.Label>Password</Form.Label>
					<Form.Control
						onChange={handleChange("password")}
						type="password"
						placeholder="Password"
					/>
				</Form.Group>

				<Form.Group>
					<Button variant="outline-info" type="submit" className="float-left">
						{buttonText}
					</Button>
					<Link href="/auth/password/forgot" passHref>
						<Button variant="outline-danger" className="float-right">
							Forgot Password
						</Button>
					</Link>
				</Form.Group>
			</Form>
		);
	};

	return (
		<Layout>
			<div className="row">
				<div className="col-md-6 mx-auto">
					<h1>Login</h1>

					<br></br>
					{success && showSuccessMessage(success)}

					{error && showErrorMessage(error)}
					{loginForm()}
				</div>
			</div>
		</Layout>
	);
};

export default Login;
