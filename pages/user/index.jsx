import Layout from "../../components/layout";
import axios from "axios";
import Link from "next/link";
import { API } from "../../config";
import moment from "moment";

import { getCookie } from "../../helpers/auth";
import { Col, Row, ListGroup, Button, ButtonGroup } from "react-bootstrap";

import withUser from "../withUser";
import { Router } from "next/router";

const User = ({ user, userLinks, token }) => {
	const confirmDelete = (e, id) => {
		e.preventDefault();
		let answer = window.confirm("Are you sure you want to delete?");

		if (answer) {
			handleDelete(id);
		}
	};

	const handleDelete = async (id) => {
		try {
			const response = await axios.delete(`${API}/link/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			console.log("Link deleted successfully", response);

			Router.replace("/user");
		} catch (error) {
			console.log("Link delete error");
		}
	};

	const listOfLinks = () =>
		userLinks.map((l, i) => (
			<div key={i} className="card border-info">
				<div className="card-body alert-info">
					<a href={l.url} target="_blank" className="nav-link p-0">
						<h5 className="card-title">{l.title}</h5>
					</a>
					<div className="row">
						<div className="col-md-8">
							<h6 className="pt-2 text-danger" style={{ fontSize: "12px" }}>
								{l.url}
							</h6>
						</div>
						<div className="col-md-4 pt-2">
							<small className="text-muted pull-right">
								{moment(l.createdAt).fromNow()} by {l.postedBy.name}
							</small>
							<br />
						</div>
						<div className="col-md-12">
							<span className="badge text-dark">
								{l.type} / {l.medium}
							</span>
							{l.categories.map((c, i) => (
								<span key={i} className="badge text-success">
									{c.name}
								</span>
							))}
							<span className="badge text-secondary pull-right">
								{l.clicks} clicks
							</span>
						</div>
					</div>
					<ButtonGroup className="mt-2">
						<Link href={`/user/link/${l._id}`} passHref>
							<a className="btn btn-outline-success btn-sm">Update</a>
						</Link>
						<Button
							onClick={() => confirmDelete(e, l._id)}
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
			<h1>Hey {user.name}!</h1>
			<h4>This is your Dashboard</h4>
			<br />
			<Row>
				<Col md={4}>
					<ListGroup className="pb-5">
						<Link href="/user/link/create" passHref>
							<ListGroup.Item as="button" className="btn-outline-info">
								Submit a Link
							</ListGroup.Item>
						</Link>
						<Link href="/user/profile/update" passHref>
							<ListGroup.Item as="button" className="btn-outline-info">
								Update your Profile
							</ListGroup.Item>
						</Link>
					</ListGroup>
				</Col>
				<Col md={8}>
					<h3>Your Links</h3>
					<hr />
					{listOfLinks()}
				</Col>
			</Row>
		</Layout>
	);
};

export default withUser(User);
