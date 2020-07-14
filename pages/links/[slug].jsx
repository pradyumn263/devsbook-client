import { useState, useEffect } from "react";
import Layout from "../../components/layout";
import Link from "next/link";
import axios from "axios";
import renderHTML from "react-render-html";
import moment from "moment";
import { API, APP_NAME } from "../../config";
import InfiniteScroll from "react-infinite-scroller";

import Head from "next/head";

import { Button } from "react-bootstrap";

const Links = ({
	query,
	category,
	links,
	totalLinks,
	linksLimit,
	linkSkip,
}) => {
	const [allLinks, setAllLinks] = useState(links);
	const [limit, setLimit] = useState(linksLimit);
	const [skip, setSkip] = useState(0);
	const [size, setSize] = useState(totalLinks);
	const [popular, setPopular] = useState([]);

	useEffect(() => {
		loadPopular();
	}, []);

	const stripHTML = (data) => data.replace(/<\/?[^>]+(>|$)/g, "");

	const head = () => (
		<Head>
			<title>
				{category.name} | {APP_NAME}
			</title>
			<meta
				name="description"
				content={stripHTML(category.content.substring(0, 160))}
			/>
			<meta property="og:title" content={category.name} />
			<meta
				property="og:description"
				content={stripHTML(category.content.substring(0, 160))}
			/>
			<meta property="og:image" content={category.image.url} />
			<meta property="og:image:secure_url" content={category.image.url} />
		</Head>
	);

	const loadPopular = async () => {
		const response = await axios.get(`${API}/link/popular/${category.slug}`);
		// console.log(response);
		setPopular(response.data);
	};

	const handleClick = async (linkId) => {
		const response = await axios.put(`${API}/click-count`, { linkId });
		loadUpdatedLinks();
		loadPopular();
	};

	const loadUpdatedLinks = async () => {
		const response = await axios.post(`${API}/category/${query.slug}`);
		setAllLinks(response.data.links);
	};

	const listOfPopular = () => {
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

	const listOfLinks = () =>
		allLinks.map((l, i) => (
			<div key={i} className="card border-info">
				<div className="card-body alert-info">
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
		));

	const loadMore = async () => {
		let toSkip = skip + limit;
		const response = await axios.post(`${API}/category/${query.slug}`, {
			skip: toSkip,
			limit,
		});
		setAllLinks([...allLinks, ...response.data.links]);
		console.log("allLinks", allLinks);
		console.log("response.data.links.length", response.data.links.length);
		setSize(response.data.links.length);
		setSkip(toSkip);
	};

	// const loadMoreButton = () => {
	// 	return (
	// 		size > 0 &&
	// 		size >= limit && (
	// 			<button onClick={loadMore} className="btn btn-outline-info btn-lg">
	// 				Load more
	// 			</button>
	// 		)
	// 	);
	// };

	return (
		<React.Fragment>
			{head()}
			<Layout>
				{/* <div className="text-center pt-4 pb-5">{loadMoreButton()}</div> */}
				<div className="row">
					<div className="col-md-8">
						<h1 className="display-4 font-weight-bold">
							{category.name} - Resources
						</h1>
						<div className="lead alert alert-secondary pt-4">
							{renderHTML(category.content || "")}
						</div>
					</div>
					<div className="col-md-4">
						<img
							src={category.image.url}
							alt={category.name}
							style={{ width: "auto", maxHeight: "200px" }}
						/>
					</div>
				</div>
				<InfiniteScroll
					pageStart={0}
					loadMore={loadMore}
					hasMore={size > 0 && size >= limit}
					loader={
						<img key={0} src="/static/images/loading.gif" alt="loading" />
					}
				>
					<br />
					<div className="row">
						<div className="col-md-8 order-2 order-md-1">
							<h2 className="lead">All Resources</h2>
						</div>
						<div className="col-md-8 order-2 order-md-1">{listOfLinks()}</div>
						<div className="col-md-4 order-1 order-md-2">
							<h2 className="lead">Most popular in {category.name}</h2>
							{listOfPopular()}
						</div>
					</div>
				</InfiniteScroll>
			</Layout>
		</React.Fragment>
	);
};

Links.getInitialProps = async ({ query, req }) => {
	let skip = 0;
	let limit = 2;

	const response = await axios.post(`${API}/category/${query.slug}`, {
		skip,
		limit,
	});
	return {
		query,
		category: response.data.category,
		links: response.data.links,
		totalLinks: response.data.links.length,
		linksLimit: limit,
		linkSkip: skip,
	};
};

export default Links;
