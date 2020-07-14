import { useState, useEffect } from "react";
import Layout from "../components/layout";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../helpers/alert";
import { API } from "../config";
import { isAuth } from "../helpers/auth";

import Router from "next/router";

//BootStrap Components
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const Register = () => {
	useEffect(() => {
		isAuth() && Router.push("/");
		loadCategories();
	}, []);

	const loadCategories = async () => {
		const response = await axios.get(`${API}/categories`);
		setState({ ...state, loadedCategories: response.data });
	};

	const [state, setState] = useState({
		name: "",
		email: "",
		password: "",
		error: "",
		success: "",
		buttonText: "Register",
		loadedCategories: [],
		categories: [],
	});

	const {
		categories,
		loadedCategories,
		name,
		email,
		password,
		error,
		success,
		buttonText,
	} = state;

	const handleChange = (name) => (e) => {
		setState({
			...state,
			[name]: e.target.value,
			error: "",
			success: "",
			buttonText: "Register",
		});
	};

	const handleToggle = (c) => () => {
		//return the first index or -1
		const clickedCategory = categories.indexOf(c);
		const all = [...categories];

		if (clickedCategory === -1) {
			all.push(c);
		} else {
			all.splice(clickedCategory, 1);
		}

		console.log("All >> categories", all);
		setState({ ...state, categories: all, success: "", error: "" });
	};

	const showCategories = () => {
		return (
			loadedCategories &&
			loadedCategories.map((c, i) => {
				return (
					<li className="list-unstyled" key={c._id}>
						<Form.Check
							onChange={handleToggle(c._id)}
							type="checkbox"
							label={c.name}
						/>
					</li>
				);
			})
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setState({ ...state, buttonText: "Submitting" });

		try {
			const response = await axios.post(`${API}/register`, {
				name,
				email,
				password,
				categories,
			});

			setState({
				...state,
				name: "",
				email: "",
				password: "",
				buttonText: "Submitted",
				success: response.data.message,
			});
		} catch (error) {
			setState({
				...state,
				buttonText: "Register",
				error: error.response.data.error,
			});
			console.log("ERROR IS HERE!", error);
		}
	};

	// const handleSubmit =  (e) => {
	// 	e.preventDefault();
	// 	setState({ ...state, buttonText: "Submitting" });
	// 	axios
	// 		.post("http://localhost:8000/api/register", {
	// 			name,
	// 			email,
	// 			password,
	// 		})
	// 		.then((response) => {
	// 			setState({
	// 				...state,
	// 				name: "",
	// 				email: "",
	// 				password: "",
	// 				buttonText: "Submitted",
	// 				success: response.data.message,
	// 			});
	// 		})
	// 		.catch((err) => {
	// 			setState({
	// 				...state,
	// 				buttonText: "Register",
	// 				error: error.response.data.error,
	// 			});
	// 		});
	// };

	const registerForm = () => {
		return (
			<Form onSubmit={handleSubmit}>
				<Form.Group controlId="formBasicName">
					<Form.Label>Name</Form.Label>
					<Form.Control
						value={name}
						onChange={handleChange("name")}
						type="text"
						placeholder="Enter Name"
					/>
				</Form.Group>

				<Form.Group controlId="formBasicEmail">
					<Form.Label>Email address</Form.Label>
					<Form.Control
						value={email}
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
						value={password}
						onChange={handleChange("password")}
						type="password"
						placeholder="Password"
					/>
				</Form.Group>

				<Form.Group>
					<Form.Label as="h6">Favourite Categories</Form.Label>
					<ul style={{ maxHeight: "20rem", overflowY: "scroll" }}>
						{showCategories()}
					</ul>
				</Form.Group>

				<Button variant="outline-info" type="submit">
					{buttonText}
				</Button>
			</Form>
		);
	};

	return (
		<Layout>
			<div className="row">
				<div className="col-md-6 mx-auto">
					<h1>Register</h1>
					<br></br>
					{success && showSuccessMessage(success)}

					{error && showErrorMessage(error)}
					{registerForm()}
					<hr />
				</div>
			</div>
		</Layout>
	);
};

export default Register;
