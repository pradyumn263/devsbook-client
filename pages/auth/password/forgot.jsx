import { useState } from "react";

import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alert";
import { API } from "../../../config";
import Router from "next/router";
import Layout from "../../../components/layout";

// BootStrap imports
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Form } from "react-bootstrap";

const ForgotPassword = () => {
	const [state, setState] = useState({
		email: "",
		buttonText: "Send Link",
		success: "",
		error: "",
	});

	const { email, buttonText, success, error } = state;

	const handleChange = (e) => {
		setState({ ...state, email: e.target.value, success: "", error: "" });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// console.log("Post Email To: ", email);

		try {
			const response = await axios.put(`${API}/forgot-password`, { email });
			// console.log("Forgot Password Response:", response);
			setState({
				...state,
				email: "",
				buttonText: "Done",
				success: response.data.message,
			});
		} catch (error) {
			console.log("Forgot Password error", error);
			setState({
				...state,
				buttonText: "Send Link",
				error: error.response.data.error,
			});
		}
	};

	const passwordForgotForm = () => {
		return (
			<React.Fragment>
				<Form onSubmit={handleSubmit}>
					<p>
						Change your password in three easy steps. This will help you secure
						your account
					</p>

					<ol>
						<li>Enter your email address below.</li>
						<li>Our system will send you a temporary link</li>
						<li>Use the link to reset your password</li>
					</ol>

					{success && showSuccessMessage(success)}

					{error && showErrorMessage(error)}
					<Form.Group>
						<Form.Label>Email</Form.Label>
						<Form.Control
							onChange={handleChange}
							value={email}
							type="email"
							placeholder="Enter Email"
						/>
					</Form.Group>
					<Button type="submit" variant="outline-info">
						{buttonText}
					</Button>
				</Form>
			</React.Fragment>
		);
	};

	return (
		<Layout>
			<Row>
				<Col md={6} className="offset-md-3">
					<h1>Forgot Password</h1>
					<br />
					{passwordForgotForm()}
				</Col>
			</Row>
		</Layout>
	);
};

export default ForgotPassword;
