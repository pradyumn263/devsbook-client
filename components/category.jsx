import Link from "next/link";

import { Col, Card, Button } from "react-bootstrap";

const Category = (props) => {
	return (
		// <Col md={4}>
		<Link href={props.destinationURL} passHref>
			<div className="card text-center mx-auto" style={{ maxWidth: "18rem" }}>
				<img src={props.imgurl} className="card-img-top" alt={props.name} />
				<div className="card-body">
					<h5 className="card-title">{props.name}</h5>

					<a href="#" className="btn btn-outline-info stretched-link">
						Go to {props.name}
					</a>
				</div>
			</div>
		</Link>
		// </Col>
	);
};

export default Category;
