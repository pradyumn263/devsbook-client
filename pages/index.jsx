import Layout from "../components/layout";
import axios from "axios";
import { API } from "../config";
import { useEffect, useState } from "react";
import moment from "moment";

import Category from "../components/category";
import { CardColumns, Row, Card, Col, Jumbotron } from "react-bootstrap";

const Home = ({ categories }) => {
	const [popular, setPopular] = useState([]);

	useEffect(() => {
		loadPopular();
	}, []);

	const loadPopular = async () => {
		const response = await axios.get(`${API}/link/popular`);
		setPopular(response.data);
	};

	const handleClick = async (linkId) => {
		const response = await axios.put(`${API}/click-count`, { linkId });
		loadPopular();
	};

	const listOfLinks = () => {
		return popular.map((l, i) => {
			return (
				<div key={i} className="card border-info">
					<div className="card-body alert-secondary">
						<h5 className="card-title">{l.title}</h5>
						<a
							href={l.url}
							className="stretched-link"
							target="_blank"
							onClick={(e) => handleClick(l._id)}
						/>
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
					</div>
				</div>
			);
		});
	};

	const listCategories = () => {
		return categories.map((c, i) => {
			// console.log(c.image.url);
			return (
				<Category
					destinationURL={`/links/${c.slug}`}
					name={c.name}
					imgurl={c.image.url}
				></Category>
			);
		});
	};

	return (
		<React.Fragment>
			<Layout>
				<h1>Welcome to Dev's Book!</h1>
				<h6>Your one stop shop to everything CS related!</h6>

				{/* <Row> */}
				<CardColumns>{listCategories()}</CardColumns>
				{/* </Row> */}

				<Row>
					<h1 className="mt-3 col-12">Trending</h1>
					<br />
					<div className="col-md-8 mx-auto">{listOfLinks()}</div>
				</Row>
			</Layout>
		</React.Fragment>
	);
};

Home.getInitialProps = async () => {
	const response = await axios.get(`${API}/categories`);

	return {
		categories: response.data,
	};
};

export default Home;
