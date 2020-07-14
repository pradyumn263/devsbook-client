import Layout from "../../../components/layout";
import withAdmin from "../../withAdmin";
import { useState, useEffect } from "react";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alert";
import dynamic from "next/dynamic";

import Resizer from "react-image-file-resizer";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

import { API } from "../../../config";
import "react-quill/dist/quill.bubble.css";
import "react-quill/dist/quill.snow.css";

//Bootstrap
import { Form, Col, Row, Button } from "react-bootstrap";

const Create = ({ user, token }) => {
	const [state, setState] = useState({
		name: "",
		error: "",
		success: "",
		buttonText: "Create",
		image: "",
	});

	const [imageUploadButtonName, setImageUploadButtonName] = useState(
		"Upload image"
	);

	const [content, setContent] = useState("");

	const { name, success, error, image, buttonText } = state;

	const handleChange = (names) => (e) => {
		const value = e.target.value;
		setState({
			...state,
			[names]: value,
			error: "",
			success: "",
		});
	};

	const handleContent = (e) => {
		setContent(e);
		setState({ ...state, success: "", error: "" });
	};

	const handleImage = (event) => {
		let fileInput = false;
		if (event.target.files[0]) {
			fileInput = true;
		}
		if (fileInput) {
			setImageUploadButtonName(event.target.files[0].name);
			Resizer.imageFileResizer(
				event.target.files[0],
				300,
				300,
				"JPEG",
				100,
				0,
				(uri) => {
					setState({
						...state,
						image: uri,
						success: "",
						error: "",
					});
				},
				"base64"
			);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setState({
			...state,
			buttonText: "Creating...",
		});

		try {
			const response = await axios.post(
				`${API}/category`,
				{ name, content, image },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			console.log("Axios Create Category Response", response);

			setImageUploadButtonName("Upload Image");
			setContent("");
			setState({
				...state,
				name: "",
				formData: process.browser && new FormData(),
				buttonText: "Create",
				imageUploadText: "Upload Image",
				success: `${response.data.name} is created`,
			});
		} catch (error) {
			console.log("Category Create Error", error);
			setState({
				...state,
				buttonText: "Create",
				error: error.response.data.error,
			});
		}
	};

	const createCategoryForm = () => {
		return (
			<Form onSubmit={handleSubmit}>
				<Form.Group>
					<Form.Label>Category Name</Form.Label>
					<Form.Control
						onChange={handleChange("name")}
						value={name}
						type="text"
						placeholder="Category Name"
					></Form.Control>
				</Form.Group>

				<Form.Group>
					<Form.Label>Category Description</Form.Label>

					<ReactQuill
						value={content}
						onChange={handleContent}
						placeholder="Category Description"
						className="pb-5 mb-3"
						theme="snow"
					/>
				</Form.Group>

				<Button as="label" variant="outline-info">
					{imageUploadButtonName}
					<input
						onChange={handleImage}
						type="file"
						accept="image/*"
						className="form-control"
						hidden
					/>
				</Button>

				<Button variant="outline-info float-right" type="submit">
					{buttonText}
				</Button>
			</Form>
		);
	};

	return (
		<Layout>
			<Row>
				<Col md={6} className="mx-auto">
					<h1>Create Category</h1>
					<br />
					{success && showSuccessMessage(success)}
					{error && showErrorMessage(error)}
					{createCategoryForm()}
				</Col>
			</Row>
		</Layout>
	);
};

export default withAdmin(Create);
