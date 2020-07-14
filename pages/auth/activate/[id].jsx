import { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alert";
import { API } from "../../../config";
import { withRouter } from "next/router";
import Layout from "../../../components/layout";

// BootStrap imports
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

const ActivateAccount = ({ router }) => {
	const [state, setState] = useState({
		name: "",
		token: "",
		buttonText: "Activate Account",
		success: "",
		error: "",
	});

	const { name, token, buttonText, success, error } = state;

	//As soon as Component mounts, useEffect runs
	useEffect(() => {
		let token = router.query.id;

		if (token) {
			const { name } = jwt.decode(token);
			setState({ ...state, name, token });
		}
	}, [router]);

	const clickSubmit = async (e) => {
		e.preventDefault();
		setState({
			...state,
			buttonText: "Activating",
		});

		try {
			const response = await axios.post(`${API}/register/activate`, {
				token,
			});

			// console.log('Account Activate Response', response);
			setState({
				...state,
				name: "",
				token: "",
				buttonText: "Activated",
				success: response.data.message,
			});
		} catch (error) {
			setState({
				...state,
				buttonText: "Activate Account",
				error: error.response.data.error,
			});
		}
	};

	return (
		<Layout>
			<Row>
				<Col md={8} className="offset-md-2">
					<h1>Hey {name}! Ready to activate your account?</h1>
					<br />
					<hr />
					{success && showSuccessMessage(success)}
					{error && showErrorMessage(error)}
					<Button onClick={clickSubmit} variant="outline-info" type="lg" block>
						{buttonText}
					</Button>
				</Col>
			</Row>
		</Layout>
	);
};

export default withRouter(ActivateAccount);
