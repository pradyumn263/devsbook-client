import Layout from "../../../components/layout";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

import { API } from "../../../config";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alert";
import withUser from "../../withUser";
import { getCookie, isAuth } from "../../../helpers/auth";

import { Button, Form, Row, Col } from "react-bootstrap";
import { set } from "nprogress";

const Create = ({ token }) => {
	const [state, setState] = useState({
		title: "",
		url: "",
		categories: [],
		loadedCategories: [],
		success: "",
		error: "",
		type: "",
		medium: "",
	});

	const {
		title,
		url,
		categories,
		loadedCategories,
		success,
		error,
		type,
		medium,
	} = state;

	useEffect(() => {
		loadCategories();
	}, [success]);

	const loadCategories = async () => {
		const response = await axios.get(`${API}/categories`);
		setState({ ...state, loadedCategories: response.data });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.table({ title, url, categories, type, medium });

		try {
			const response = await axios.post(
				`${API}/link`,
				{
					title,
					url,
					categories,
					type,
					medium,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			setState({
				...state,
				title: "",
				url: "",
				success: "Link has been created",
				error: "",
				loadedCategories: [],
				categories: [],
				type: "",
				medium: "",
			});
		} catch (error) {
			console.log("Link Submit error", error);
			setState({
				...state,
				error: error.response.data.error,
			});
		}
	};

	const handleTitleChange = (e) => {
		setState({ ...state, title: e.target.value, error: "", success: "" });
	};

	const handleURLChange = (e) => {
		setState({ ...state, url: e.target.value, error: "", success: "" });
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

	const handleType = (e) => {
		setState({
			...state,
			type: e.target.value,
			success: "",
			error: "",
		});
	};

	const handleMedium = (e) => {
		setState({
			...state,
			medium: e.target.value,
			success: "",
			error: "",
		});
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

	const showTypes = () => {
		return (
			<React.Fragment>
				<Form.Group>
					<Form.Check
						checked={type === "free"}
						onChange={handleType}
						type="radio"
						label="Free"
						value="free"
					/>

					<Form.Check
						checked={type === "paid"}
						onChange={handleType}
						type="radio"
						label="Paid"
						value="paid"
					/>
				</Form.Group>
			</React.Fragment>
		);
	};

	const showMedium = () => {
		return (
			<React.Fragment>
				<Form.Group>
					<Form.Check
						checked={medium === "video"}
						onChange={handleMedium}
						type="radio"
						label="Video"
						value="video"
					/>

					<Form.Check
						checked={medium === "book"}
						onChange={handleMedium}
						type="radio"
						label="Book"
						value="book"
					/>
				</Form.Group>
			</React.Fragment>
		);
	};

	const submitLinkForm = () => {
		return (
			<Form onSubmit={handleSubmit}>
				<Form.Group>
					<Form.Label>Title</Form.Label>
					<Form.Control
						onChange={handleTitleChange}
						value={title}
						type="text"
						placeholder="Title of the Resource"
					/>
				</Form.Group>

				<Form.Group>
					<Form.Label>Link</Form.Label>
					<Form.Control
						onChange={handleURLChange}
						value={url}
						type="url"
						placeholder="Link to Resource"
						className="checkbox-info"
					/>
					<Form.Text className="text-muted">
						This should be a direct Link to the resource.
					</Form.Text>
				</Form.Group>

				<Button disabled={!token} variant="outline-info" type="submit">
					{isAuth() || token ? "Submit" : "Login to Post"}
				</Button>
			</Form>
		);
	};

	return (
		<Layout>
			<React.Fragment>
				<h1>Submit a Link</h1>

				<br />
				<Row>
					<Col md={4}>
						<Form.Group>
							<Form.Label as="h6">Categories</Form.Label>
							<ul style={{ maxHeight: "20rem", overflowY: "scroll" }}>
								{showCategories()}
							</ul>
						</Form.Group>
						<Form.Group>
							<h6>Types</h6>
							<ul>{showTypes()}</ul>
						</Form.Group>
						<Form.Group>
							<h6>Medium</h6>
							<ul>{showMedium()}</ul>
						</Form.Group>
					</Col>
					<Col md={6}>
						{success && showSuccessMessage(success)}
						{error && showErrorMessage(error)}
						{submitLinkForm()}
					</Col>
				</Row>
			</React.Fragment>
		</Layout>
	);
};

Create.getInitialProps = ({ req }) => {
	const token = getCookie("token", req);
	return { token };
};

export default Create;
