import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import NProgress from "nprogress";

import "bootstrap/dist/css/bootstrap.min.css";
import "nprogress/nprogress.css";
import "react-quill/dist/quill.snow.css";

// BootStrap Components
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { Row } from "react-bootstrap";

//Function Imports
import { isAuth, logout } from "../helpers/auth";

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Layout = ({ children }) => {
	const head = () => {
		return (
			<React.Fragment>
				<link rel="stylesheet" href="/static/css/styles.css" />
				<link
					href="https://fonts.googleapis.com/css2?family=Open+Sans&family=Roboto:wght@700&family=Rubik&display=swap"
					rel="stylesheet"
				></link>
				<link
					href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600&display=swap"
					rel="stylesheet"
				/>
				<title>Dev's Book</title>
				<link rel="icon" type="image/x-icon" href="/favicon.ico" />
			</React.Fragment>
		);
	};

	const nav = () => {
		return (
			<Navbar collapseOnSelect expand="lg" bg="info" variant="dark">
				<Link href="/" passHref>
					<Navbar.Brand>Dev's Book</Navbar.Brand>
				</Link>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="mr-auto">
						<Link href="/" passHref>
							<Nav.Link>Home</Nav.Link>
						</Link>
						<Link href="/user/link/create" passHref>
							<Nav.Link>Submit a Link</Nav.Link>
						</Link>
					</Nav>
					<Nav>
						{process.browser && !isAuth() && (
							<React.Fragment>
								<Link href="/login" passHref>
									<Nav.Link>Login</Nav.Link>
								</Link>
								<Link href="/register" passHref>
									<Nav.Link>Register</Nav.Link>
								</Link>
							</React.Fragment>
						)}
						{process.browser && isAuth() && isAuth().role === "admin" && (
							<Link href="/admin" passHref>
								<Nav.Link>
									<strong>{isAuth().name}</strong>
								</Nav.Link>
							</Link>
						)}

						{process.browser && isAuth() && isAuth().role === "subscriber" && (
							<Link href="/user" passHref>
								<Nav.Link>
									<strong>{isAuth().name}</strong>
								</Nav.Link>
							</Link>
						)}

						{process.browser && isAuth() && (
							<Nav.Link onClick={logout}>Logout</Nav.Link>
						)}

						{/* <Nav.Link>
							<strong>User</strong>
						</Nav.Link> */}
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	};

	return (
		<React.Fragment>
			{head()}
			{nav()}
			<div className="container pt-5 pb-3">{children}</div>
		</React.Fragment>
	);
};

export default Layout;
