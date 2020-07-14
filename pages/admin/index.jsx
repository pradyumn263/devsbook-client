import Layout from "../../components/layout";
import withAdmin from "../withAdmin";
import Link from "next/link";

import { Row, Col, Button, ListGroup } from "react-bootstrap";
import Category from "../../components/category";

const Admin = ({ user }) => {
	return (
		<Layout>
			<h1>Admin Dashboard</h1>
			<br />
			<Row>
				<Col md={4}>
					<ListGroup>
						<Link href="/admin/category/create">
							<ListGroup.Item as="button" className="btn btn-outline-info">
								Create Category
							</ListGroup.Item>
						</Link>
						<Link href="/admin/category/read">
							<ListGroup.Item as="button" className="btn btn-outline-info">
								All Categories
							</ListGroup.Item>
						</Link>
						<Link href="/admin/link/read">
							<ListGroup.Item as="button" className="btn btn-outline-info">
								All Links
							</ListGroup.Item>
						</Link>
						<Link href="/user/profile/update">
							<ListGroup.Item as="button" className="btn btn-outline-info">
								Update your Profile
							</ListGroup.Item>
						</Link>
					</ListGroup>
				</Col>
				<Col md={8}></Col>
			</Row>
		</Layout>
	);
};

export default withAdmin(Admin);
