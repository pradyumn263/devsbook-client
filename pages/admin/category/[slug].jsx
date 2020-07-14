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

const Update = ({ oldCategory, token }) => {
	const [state, setState] = useState({
		name: oldCategory.name,
		error: "",
		success: "",
		buttonText: "Update",
		imagePreview: oldCategory.image.url,
		image: "",
	});
	const [content, setContent] = useState(oldCategory.content);
	const [imageUploadButtonName, setImageUploadButtonName] = useState(
		"Update image"
	);

	const { name, success, error, image, buttonText, imagePreview } = state;

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
			buttonText: "Updating...",
		});

		try {
			const response = await axios.put(
				`${API}/category/${oldCategory.slug}`,
				{ name, content, image },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			console.log("Axios Update Category Response", response);

			setState({
				...state,
				imagePreview: response.data.image.url,
				buttonText: "Update",
				imageUploadText: "Update Image",
				success: `${response.data.name} is updated`,
			});
			setContent(response.data.content);
		} catch (error) {
			console.log("Category Update Error", error);
			setState({
				...state,
				buttonText: "Update",
				error: error.response.data.error,
			});
		}
	};

	const updateCategoryForm = () => {
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
					/>{" "}
					<span>
						<img src={imagePreview} alt="image" height="20" />
					</span>
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
					<h1>Update Category</h1>
					<br />
					{success && showSuccessMessage(success)}
					{error && showErrorMessage(error)}
					{updateCategoryForm()}
				</Col>
			</Row>
		</Layout>
	);
};

Update.getInitialProps = async ({ req, query, token }) => {
	const response = await axios.post(`${API}/category/${query.slug}`);
	return { oldCategory: response.data.category, token };
};

export default withAdmin(Update);
