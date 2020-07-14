import { useState, useEffect } from "react";

import axios from "axios";
import {
	showSuccessMessage,
	showErrorMessage,
} from "../../../../helpers/alert";
import { API } from "../../../../config";
import Router, { withRouter } from "next/router";
import Layout from "../../../../components/layout";
import jwt from "jsonwebtoken";

// BootStrap imports
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Form } from "react-bootstrap";

const ResetPassword = ({ router }) => {
	const [state, setState] = useState({
		name: "",
		token: "",
		newPassword: "",
		buttonText: "Send Link",
		success: "",
		error: "",
	});

	const { name, token, newPassword, buttonText, success, error } = state;

	useEffect(() => {
		//router.query.id will give the id from the URL
		const decoded = jwt.decode(router.query.id);
		if (decoded) {
			setState({ ...state, name: decoded.name, token: router.query.id });
		}
	}, [router]);

	const handleChange = (e) => {
		setState({ ...state, newPassword: e.target.value, success: "", error: "" });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// console.log("Post Email To: ", email);
		setState({
			...state,
			buttonText: "Resetting...",
		});

		try {
			const response = await axios.put(`${API}/reset-password`, {
				resetPasswordLink: token,
				newPassword,
			});
			// console.log("Forgot Password Response:", response);
			setState({
				...state,
				newPassword: "",
				buttonText: "Done",
				success: response.data.message,
			});
		} catch (error) {
			console.log("Reset Password error", error);
			setState({
				...state,
				buttonText: "Send Link",
				error: error.response.data.error,
			});
		}
	};

	const passwordResetForm = () => {
		return (
			<React.Fragment>
				<Form onSubmit={handleSubmit}>
					{success && showSuccessMessage(success)}

					{error && showErrorMessage(error)}
					<Form.Group>
						<Form.Label>New Password</Form.Label>
						<Form.Control
							onChange={handleChange}
							value={newPassword}
							type="password"
							placeholder="Enter your new Password"
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
					<h1>Reset Password</h1>
					<br />
					<h6>Hey {name}, you can now change your password.</h6>
					{passwordResetForm()}
				</Col>
			</Row>
		</Layout>
	);
};

export default withRouter(ResetPassword);
