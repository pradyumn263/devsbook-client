import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../../config";
import Link from "next/link";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alert";
import Layout from "../../../components/layout";
import withAdmin from "../../withAdmin";
import Category from "../../../components/category";

import { Button, ButtonGroup } from "react-bootstrap";

const Read = ({ user, token }) => {
	const [state, setState] = useState({
		error: "",
		success: "",
		categories: [],
	});

	const { error, success, categories } = state;

	useEffect(() => {
		loadCategories();
	}, []);

	const loadCategories = async () => {
		const response = await axios.get(`${API}/categories`);
		setState({ ...state, categories: response.data });
	};

	const confirmDelete = (e, slug) => {
		e.preventDefault();
		let answer = window.confirm("Are you sure you want to delete?");

		if (answer) {
			handleDelete(slug);
		}
	};

	const handleDelete = async (slug) => {
		try {
			const response = await axios.delete(`${API}/category/${slug}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			console.log("Category deleted successfully", response);

			loadCategories();
		} catch (error) {
			console.log("Category delete error");
		}
	};

	const listCategories = () =>
		categories.map((c, i) => (
			<div
				key={i}
				className="card text-center mx-auto"
				style={{ maxWidth: "18rem" }}
			>
				<img src={c.image.url} className="card-img-top" alt={c.name} />
				<div className="card-body">
					<h5 className="card-title">{c.name}</h5>
					<ButtonGroup>
						<Link href={`/admin/category/${c.slug}`} passHref>
							<Button variant="outline-warning" size="sm">
								Update
							</Button>
						</Link>
						<Button
							onClick={(e) => confirmDelete(e, c.slug)}
							variant="outline-danger"
							size="sm"
						>
							Delete
						</Button>
					</ButtonGroup>
				</div>
			</div>
		));

	return (
		<Layout>
			<div className="row">
				<div className="col">
					<h1>List of categories</h1>
					<br />
				</div>
			</div>

			<div className="row">{listCategories()}</div>
		</Layout>
	);
};

export default withAdmin(Read);
